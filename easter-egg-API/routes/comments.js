import express from 'express';
import { pool } from '../config/database.js';
import { DATA_STRUCTURE } from '../config/dataStructure.js';

const router = express.Router();

// 获取评论列表
router.get('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    // 获取主评论
    const commentsResult = await pool.query(`
      SELECT 
        c.id, c.nickname, c.content, c.created_at, c.parent_id,
        COUNT(r.id) as reply_count
      FROM ${DATA_STRUCTURE.TABLES.COMMENTS} c
      LEFT JOIN ${DATA_STRUCTURE.TABLES.COMMENTS} r ON c.id = r.parent_id
      WHERE c.content_id = $1 AND c.content_type = $2 AND c.parent_id IS NULL
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $3 OFFSET $4
    `, [contentId, contentType, limit, offset]);
    
    // 获取回复
    const commentIds = commentsResult.rows.map(c => c.id);
    let replies = [];
    if (commentIds.length > 0) {
      const repliesResult = await pool.query(`
        SELECT id, nickname, content, created_at, parent_id
        FROM ${DATA_STRUCTURE.TABLES.COMMENTS}
        WHERE parent_id = ANY($1) AND is_approved = true
        ORDER BY created_at ASC
      `, [commentIds]);
      replies = repliesResult.rows;
    }
    
    // 组织评论结构
    const comments = commentsResult.rows.map(comment => ({
      ...comment,
      replies: replies.filter(reply => reply.parent_id === comment.id)
    }));
    
    // 获取总数
    const totalResult = await pool.query(`
      SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.COMMENTS} 
      WHERE content_id = $1 AND content_type = $2 AND parent_id IS NULL
    `, [contentId, contentType]);
    
    const total = parseInt(totalResult.rows[0].count);
    const pages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

// 提交评论
router.post('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { nickname, content, parentId } = req.body;
    
    if (!nickname || !content) {
      return res.status(400).json({ success: false, error: 'Nickname and content are required' });
    }
    
    if (nickname.length > 50) {
      return res.status(400).json({ success: false, error: 'Nickname too long' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ success: false, error: 'Comment too long' });
    }
    
    const userIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    const result = await pool.query(`
      INSERT INTO ${DATA_STRUCTURE.TABLES.COMMENTS} (content_id, content_type, nickname, content, parent_id, user_ip, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nickname, content, created_at, parent_id
    `, [contentId, contentType, nickname, content, parentId || null, userIP, userAgent]);
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Comment submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to submit comment' });
  }
});

// 获取所有评论（管理后台用）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, contentType, contentId, isApproved } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    let paramIndex = 1;
    
    if (contentType) {
      whereClause += ` WHERE c.content_type = $${paramIndex}`;
      params.push(contentType);
      paramIndex++;
    }
    
    if (contentId) {
      whereClause += whereClause ? ` AND c.content_id = $${paramIndex}` : ` WHERE c.content_id = $${paramIndex}`;
      params.push(contentId);
      paramIndex++;
    }
    
    if (isApproved !== undefined) {
      whereClause += whereClause ? ` AND c.is_approved = $${paramIndex}` : ` WHERE c.is_approved = $${paramIndex}`;
      params.push(isApproved === 'true');
      paramIndex++;
    }
    
    const result = await pool.query(`
      SELECT c.*, 
        CASE 
          WHEN c.content_type = 'games' THEN g.title
          WHEN c.content_type = 'movies' THEN m.title
          WHEN c.content_type = 'tv' THEN t.title
        END as content_title,
        CASE 
          WHEN c.parent_id IS NOT NULL THEN (
            SELECT nickname FROM ${DATA_STRUCTURE.TABLES.COMMENTS} WHERE id = c.parent_id
          )
          ELSE NULL
        END as parent_nickname
      FROM ${DATA_STRUCTURE.TABLES.COMMENTS} c
        LEFT JOIN egg_games g ON c.content_type = 'games' AND c.content_id = g.id
        LEFT JOIN egg_movies m ON c.content_type = 'movies' AND c.content_id = m.id
        LEFT JOIN egg_tv t ON c.content_type = 'tv' AND c.content_id = t.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);
    
    // 获取总数
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.COMMENTS} c ${whereClause}
    `, params);
    
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

// 更新评论（管理后台用）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, content, isApproved } = req.body;
    
    const updateFields = [];
    const params = [];
    let paramIndex = 1;
    
    if (nickname !== undefined) {
      updateFields.push(`nickname = $${paramIndex}`);
      params.push(nickname);
      paramIndex++;
    }
    
    if (content !== undefined) {
      updateFields.push(`content = $${paramIndex}`);
      params.push(content);
      paramIndex++;
    }
    
    if (isApproved !== undefined) {
      updateFields.push(`is_approved = $${paramIndex}`);
      params.push(isApproved);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }
    
    params.push(id);
    
    const result = await pool.query(`
      UPDATE ${DATA_STRUCTURE.TABLES.COMMENTS} 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, error: 'Failed to update comment' });
  }
});

// 删除评论（管理后台用）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查是否有回复
    const repliesResult = await pool.query(`
      SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.COMMENTS} WHERE parent_id = $1
    `, [id]);
    
    if (parseInt(repliesResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete comment with replies. Delete replies first.' 
      });
    }
    
    const result = await pool.query(`
      DELETE FROM ${DATA_STRUCTURE.TABLES.COMMENTS} WHERE id = $1 RETURNING id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete comment' });
  }
});

export default router;
