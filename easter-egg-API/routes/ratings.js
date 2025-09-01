import express from 'express';
import { pool } from '../config/database.js';
import { DATA_STRUCTURE } from '../config/dataStructure.js';

const router = express.Router();

// 获取内容评分统计
router.get('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    
    // 获取评分统计
    const ratingResult = await pool.query(`
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
      WHERE content_id = $1 AND content_type = $2
    `, [contentId, contentType]);
    
    // 检查当前IP是否已评分
    const userIP = req.ip || req.connection.remoteAddress;
    const userRating = await pool.query(`
      SELECT rating FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
      WHERE content_id = $1 AND content_type = $2 AND user_ip = $3
    `, [contentId, contentType, userIP]);
    
    const stats = ratingResult.rows[0];
    const response = {
      success: true,
      data: {
        totalRatings: parseInt(stats.total_ratings),
        averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
        ratingDistribution: {
          fiveStar: parseInt(stats.five_star),
          fourStar: parseInt(stats.four_star),
          threeStar: parseInt(stats.three_star),
          twoStar: parseInt(stats.two_star),
          oneStar: parseInt(stats.one_star)
        },
        userRating: userRating.rows[0]?.rating || null
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// 提交评分
router.post('/:contentType/:contentId', async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Invalid rating value' });
    }
    
    const userIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // 移除IP重复检查，允许用户多次评分
    // 直接创建新评分记录
    await pool.query(`
      INSERT INTO ${DATA_STRUCTURE.TABLES.RATINGS} (content_id, content_type, rating, user_ip, user_agent)
      VALUES ($1, $2, $3, $4, $5)
    `, [contentId, contentType, rating, userIP, userAgent]);
    
    // 更新内容表的评分统计
    const tableName = `egg_${contentType}`;
    await pool.query(`
      UPDATE ${tableName} 
      SET 
        avg_rating = (
          SELECT AVG(rating) FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
          WHERE content_id = $1 AND content_type = $2
        ),
        rating_count = (
          SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
          WHERE content_id = $1 AND content_type = $2
        )
      WHERE id = $1
    `, [contentId, contentType]);
    
    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ success: false, error: 'Failed to submit rating' });
  }
});

// 获取所有评分（管理后台用）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, contentType, contentId } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    let paramIndex = 1;
    
    if (contentType) {
      whereClause += ` WHERE content_type = $${paramIndex}`;
      params.push(contentType);
      paramIndex++;
    }
    
    if (contentId) {
      whereClause += whereClause ? ` AND content_id = $${paramIndex}` : ` WHERE content_id = $${paramIndex}`;
      params.push(contentId);
      paramIndex++;
    }
    
    const result = await pool.query(`
      SELECT r.*, 
        CASE 
          WHEN r.content_type = 'games' THEN g.title
          WHEN r.content_type = 'movies' THEN m.title
          WHEN r.content_type = 'tv' THEN t.title
        END as content_title
      FROM ${DATA_STRUCTURE.TABLES.RATINGS} r
        LEFT JOIN egg_games g ON r.content_type = 'games' AND r.content_id = g.id
        LEFT JOIN egg_movies m ON r.content_type = 'movies' AND r.content_id = m.id
        LEFT JOIN egg_tv t ON r.content_type = 'tv' AND r.content_id = t.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);
    
    // 获取总数
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.RATINGS} ${whereClause}
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
    console.error('Error fetching all ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// 删除评分（管理后台用）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取评分信息用于更新统计
    const ratingInfo = await pool.query(`
      SELECT content_id, content_type FROM ${DATA_STRUCTURE.TABLES.RATINGS} WHERE id = $1
    `, [id]);
    
    if (ratingInfo.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Rating not found' });
    }
    
    const { content_id, content_type } = ratingInfo.rows[0];
    
    // 删除评分
    await pool.query(`
      DELETE FROM ${DATA_STRUCTURE.TABLES.RATINGS} WHERE id = $1
    `, [id]);
    
    // 更新内容表的评分统计
    const tableName = `egg_${content_type}`;
    await pool.query(`
      UPDATE ${tableName} 
      SET 
        avg_rating = COALESCE((
          SELECT AVG(rating) FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
          WHERE content_id = $1 AND content_type = $2
        ), 0),
        rating_count = COALESCE((
          SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.RATINGS} 
          WHERE content_id = $1 AND content_type = $2
        ), 0)
      WHERE id = $1
    `, [content_id, content_type]);
    
    res.json({ success: true, message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ success: false, error: 'Failed to delete rating' });
  }
});

export default router;
