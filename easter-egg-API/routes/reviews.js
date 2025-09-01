import express from 'express';
import { pool } from '../config/database.js';
import { DATA_STRUCTURE } from '../config/dataStructure.js';

const router = express.Router();

// 提交评价（评分+评论）
router.post('/', async (req, res) => {
  try {
    const { 
      content_id, 
      content_type, 
      rating, 
      nickname, 
      comment_text, 
      created_at,
      is_approved = true 
    } = req.body;

    // 获取用户IP和User-Agent
    const user_ip = req.ip || req.connection.remoteAddress || 'unknown';
    const user_agent = req.headers['user-agent'] || '';

    // 验证必填字段
    if (!content_id || !content_type || !nickname || !comment_text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: content_id, content_type, nickname, comment_text'
      });
    }

    // 验证rating字段：评价必须有rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating is required and must be between 1 and 5'
      });
    }

    // 移除IP重复检查，允许用户多次评价
    // 直接插入新评价记录


    // 处理时间字段
    let reviewTime = new Date();
    if (created_at) {
      const customTime = new Date(created_at);
      if (!isNaN(customTime.getTime())) {
        reviewTime = customTime;
      }
    }

    // 插入新评价
    const insertResult = await pool.query(`
      INSERT INTO egg_reviews (
        content_id, content_type, rating, nickname, comment_text, 
        created_at, is_approved, user_ip, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      content_id, content_type, rating, nickname, comment_text,
      reviewTime, is_approved, user_ip, user_agent
    ]);

    res.json({
      success: true,
      data: insertResult.rows[0],
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit review' 
    });
  }
});

// 获取内容的评价列表
router.get('/', async (req, res) => {
  try {
    const { 
      content_id, 
      content_type, 
      page = 1, 
      limit = 20,
      is_approved 
    } = req.query;

    let whereClause = '';
    let params = [];
    let paramIndex = 1;

    // 如果提供了内容ID和类型，则获取特定内容的评价
    if (content_id && content_type) {
      whereClause = 'WHERE r.content_id = $1 AND r.content_type = $2';
      params.push(content_id, content_type);
      paramIndex = 3;
      
      if (is_approved !== undefined) {
        whereClause += ` AND r.is_approved = $${paramIndex}`;
        params.push(is_approved === 'true');
        paramIndex++;
      }
    } else {
      // 管理后台获取所有评价
      if (content_type) {
        whereClause = 'WHERE r.content_type = $1';
        params.push(content_type);
        paramIndex = 2;
      }
      
      if (is_approved !== undefined) {
        whereClause += whereClause ? ` AND r.is_approved = $${paramIndex}` : `WHERE r.is_approved = $${paramIndex}`;
        params.push(is_approved === 'true');
        paramIndex++;
      }
    }

    const offset = (page - 1) * limit;

    // 获取评价数据
    const result = await pool.query(`
      SELECT r.*, 
        CASE 
          WHEN r.content_type = 'games' THEN g.title
          WHEN r.content_type = 'movies' THEN m.title
          WHEN r.content_type = 'tv' THEN t.title
          WHEN r.content_type = 'news' THEN n.title
        END as content_title
      FROM egg_reviews r
        LEFT JOIN egg_games g ON r.content_type = 'games' AND r.content_id = g.id
        LEFT JOIN egg_movies m ON r.content_type = 'movies' AND r.content_id = m.id
        LEFT JOIN egg_tv t ON r.content_type = 'tv' AND r.content_id = t.id
        LEFT JOIN egg_news n ON r.content_type = 'news' AND r.content_id = n.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    // 获取总数
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM egg_reviews r ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);

    // 返回评价列表（所有评价都是主评价）
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
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    });
  }
});

// 获取评分统计
router.get('/stats', async (req, res) => {
  try {
    const { content_id, content_type } = req.query;

    if (!content_id || !content_type) {
      return res.status(400).json({
        success: false,
        error: 'content_id and content_type are required'
      });
    }

    const result = await pool.query(`
      SELECT 
        COUNT(*)::int as total_ratings,
        COALESCE(AVG(rating)::numeric(3,2), 0) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END)::int as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END)::int as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END)::int as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END)::int as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END)::int as one_star
      FROM egg_reviews 
      WHERE content_id = $1 AND content_type = $2 AND rating IS NOT NULL AND is_approved = true
    `, [content_id, content_type]);

    const stats = result.rows[0];
    
    res.json({
      success: true,
      data: {
        averageRating: parseFloat(stats.average_rating) || 0,
        totalRatings: stats.total_ratings || 0,
        ratingDistribution: {
          fiveStar: stats.five_star || 0,
          fourStar: stats.four_star || 0,
          threeStar: stats.three_star || 0,
          twoStar: stats.two_star || 0,
          oneStar: stats.one_star || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rating stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch rating stats' 
    });
  }
});

// 更新评价
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nickname, 
      comment_text, 
      rating, 
      is_approved,
      content_id,
      content_type,
      created_at
    } = req.body;

    // 构建更新查询
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (nickname !== undefined) {
      updateFields.push(`nickname = $${paramIndex}`);
      updateValues.push(nickname);
      paramIndex++;
    }

    if (comment_text !== undefined) {
      updateFields.push(`comment_text = $${paramIndex}`);
      updateValues.push(comment_text);
      paramIndex++;
    }

    if (rating !== undefined) {
      updateFields.push(`rating = $${paramIndex}`);
      updateValues.push(rating);
      paramIndex++;
    }

    if (is_approved !== undefined) {
      updateFields.push(`is_approved = $${paramIndex}`);
      updateValues.push(is_approved);
      paramIndex++;
    }

    if (content_id !== undefined) {
      updateFields.push(`content_id = $${paramIndex}`);
      updateValues.push(content_id);
      paramIndex++;
    }

    if (content_type !== undefined) {
      updateFields.push(`content_type = $${paramIndex}`);
      updateValues.push(content_type);
      paramIndex++;
    }

    if (created_at !== undefined) {
      const customTime = new Date(created_at);
      if (!isNaN(customTime.getTime())) {
        updateFields.push(`created_at = $${paramIndex}`);
        updateValues.push(customTime);
        paramIndex++;
      }
    }



    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // 添加更新时间
    updateFields.push(`updated_at = $${paramIndex}`);
    updateValues.push(new Date());
    paramIndex++;

    // 添加ID参数
    updateValues.push(id);

    const result = await pool.query(`
      UPDATE egg_reviews 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update review' 
    });
  }
});

// 删除评价
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 删除评价
    const result = await pool.query(`
      DELETE FROM egg_reviews 
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: `Deleted ${result.rows.length} review(s) successfully`
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete review' 
    });
  }
});

export default router;
