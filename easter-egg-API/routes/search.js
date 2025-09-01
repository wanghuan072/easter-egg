
import express from 'express';
import { Pool } from 'pg';
import { transformData } from '../config/dataStructure.js';

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
    
    const offset = (page - 1) * limit;
    let results = [];

    // 构建 SQL 查询 - 修复字段名和添加label字段
    const gamesSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'games' AS "mediaType", label FROM egg_games WHERE title ILIKE $1 OR description ILIKE $1`;
    const moviesSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'movies' AS "mediaType", label FROM egg_movies WHERE title ILIKE $1 OR description ILIKE $1`;
    const tvSql = `SELECT id, title, description, publish_date, classify, image_url AS "imageUrl", address_bar AS "addressBar", 'tv' AS "mediaType", label FROM egg_tv WHERE title ILIKE $1 OR description ILIKE $1`;

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
      results = results.filter(item => types.includes(item.mediaType));
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

    // 对搜索结果进行数据转换，确保字段名一致
    const transformedData = paginatedData.map(item => {
      // 为缺少label字段的记录提供默认值
      if (!item.label) {
        if (item.mediaType === 'movies') {
          item.label = ['MOVIE']
        } else if (item.mediaType === 'games') {
          item.label = ['GAME']
        } else if (item.mediaType === 'tv') {
          item.label = ['TV']
        }
      }
      
      // 确保字段名与transformData.dbToFrontend期望的一致
      const normalizedItem = {
        ...item,
        address_bar: item.addressBar, // 将addressBar映射到address_bar
        media_type: item.mediaType,   // 将mediaType映射到media_type
        image_url: item.imageUrl      // 将imageUrl映射到image_url
      }
      
      return transformData.dbToFrontend(normalizedItem)
    });

    res.json({
      success: true,
      data: transformedData,
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
