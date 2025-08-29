
import express from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 全表联合模糊搜索
router.get('/', async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20, mediaType, classify } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    
    // 检查数据库连接
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }
    
    console.log('Searching with query:', query);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    
    const offset = (page - 1) * limit;
    let results = [];

    // 构建 SQL 查询
    const gamesSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'games' AS media_type FROM egg_games WHERE title ILIKE $1 OR description ILIKE $1`;
    const moviesSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'movies' AS media_type FROM egg_movies WHERE title ILIKE $1 OR description ILIKE $1`;
    const tvSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'tv' AS media_type FROM egg_tv WHERE title ILIKE $1 OR description ILIKE $1`;

    const searchParam = `%${query}%`;
    const [gamesRes, moviesRes, tvRes] = await Promise.all([
      pool.query(gamesSql, [searchParam]),
      pool.query(moviesSql, [searchParam]),
      pool.query(tvSql, [searchParam])
    ]);
    results = [
      ...gamesRes.rows,
      ...moviesRes.rows,
      ...tvRes.rows
    ];

    // 可选：按 mediaType/classify 过滤
    if (mediaType) {
      const types = mediaType.split(',');
      results = results.filter(item => types.includes(item.media_type));
    }
    if (classify) {
      const classifications = classify.split(',');
      results = results.filter(item =>
        item.classify && classifications.some(cat => item.classify.includes(cat))
      );
    }

    // 按标题匹配度排序
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return new Date(b.publish_date) - new Date(a.publish_date);
    });

    const total = results.length;
    const paginatedData = results.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      searchInfo: {
        query,
        mediaType: mediaType || 'all',
        classify: classify || 'all'
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

export default router;
