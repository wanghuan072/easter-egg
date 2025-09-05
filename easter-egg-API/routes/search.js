import express from 'express';
import { query } from '../config/database.js';
import { DATA_STRUCTURE, transformData } from '../config/dataStructure.js';

const router = express.Router();

// 统一响应格式
const sendResponse = (res, data, pagination = null, message = '') => {
  const response = {
    success: true,
    data: data,
    pagination: pagination,
    message: message
  };
  res.json(response);
};

const sendError = (res, error, status = 500) => {
  const response = {
    success: false,
    error: error.message || error,
    message: 'Request failed'
  };
  res.status(status).json(response);
};

// 全表联合模糊搜索
router.get('/', async (req, res) => {
  try {
    const { q: searchQuery, page = 1, limit = 20, mediaType, classify } = req.query;
    if (!searchQuery) {
      return sendError(res, 'Search query is required', 400);
    }
    
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), DATA_STRUCTURE.PAGINATION.MAX_LIMIT);
    const offset = (pageNum - 1) * limitNum;
    let results = [];

    // 构建 SQL 查询
    const gamesSql = `SELECT id, title, description, publish_date, classify, image_url, address_bar, 'games' AS media_type, label FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE title ILIKE $1 OR description ILIKE $1`;
    const moviesSql = `SELECT id, title, description, publish_date, classify, image_url, address_bar, 'movies' AS media_type, label FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE title ILIKE $1 OR description ILIKE $1`;
    const tvSql = `SELECT id, title, description, publish_date, classify, image_url, address_bar, 'tv' AS media_type, label FROM ${DATA_STRUCTURE.TABLES.TV} WHERE title ILIKE $1 OR description ILIKE $1`;

    const searchParam = `%${searchQuery}%`;
    const [gamesRes, moviesRes, tvRes] = await Promise.all([
      query(gamesSql, [searchParam]),
      query(moviesSql, [searchParam]),
      query(tvSql, [searchParam])
    ]);
    
    results = [
      ...gamesRes.rows,
      ...moviesRes.rows,
      ...tvRes.rows
    ];

    // 按 mediaType 过滤
    if (mediaType) {
      const types = mediaType.split(',');
      results = results.filter(item => types.includes(item.media_type));
    }

    // 按 classify 过滤
    if (classify) {
      const classifications = classify.split(',');
      results = results.filter(item => 
        item.classify && item.classify.some(c => classifications.includes(c))
      );
    }

    // 按相关性排序（标题匹配优先）
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return new Date(b.publish_date) - new Date(a.publish_date);
    });

    // 分页
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limitNum);
    
    // 转换数据格式
    const transformedData = paginatedResults.map(row => transformData.dbToFrontend(row, row.media_type));

    const pagination = {
      page: pageNum,
      limit: limitNum,
      total: total,
      pages: Math.ceil(total / limitNum)
    };

    sendResponse(res, transformedData, pagination);
  } catch (error) {
    console.error('Search error:', error);
    sendError(res, 'Search failed');
  }
});

// 搜索建议
router.get('/suggestions', async (req, res) => {
  try {
    const { q: searchQuery, limit = 5 } = req.query;
    if (!searchQuery) {
      return sendResponse(res, []);
    }

    const limitNum = Math.min(parseInt(limit), 10);
    const searchParam = `%${searchQuery}%`;

    // 从所有表中获取标题建议
    const gamesSql = `SELECT DISTINCT title FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE title ILIKE $1 LIMIT $2`;
    const moviesSql = `SELECT DISTINCT title FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE title ILIKE $1 LIMIT $2`;
    const tvSql = `SELECT DISTINCT title FROM ${DATA_STRUCTURE.TABLES.TV} WHERE title ILIKE $1 LIMIT $2`;

    const [gamesRes, moviesRes, tvRes] = await Promise.all([
      query(gamesSql, [searchParam, limitNum]),
      query(moviesSql, [searchParam, limitNum]),
      query(tvSql, [searchParam, limitNum])
    ]);

    const suggestions = [
      ...gamesRes.rows.map(row => row.title),
      ...moviesRes.rows.map(row => row.title),
      ...tvRes.rows.map(row => row.title)
    ];

    // 去重并限制数量
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, limitNum);

    sendResponse(res, uniqueSuggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    sendError(res, 'Failed to get suggestions');
  }
});

// 搜索统计
router.get('/stats', async (req, res) => {
  try {
    const [gamesCount, moviesCount, tvCount, newsCount] = await Promise.all([
      query(`SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.GAMES}`),
      query(`SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.MOVIES}`),
      query(`SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.TV}`),
      query(`SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.NEWS}`)
    ]);

    const stats = {
      games: parseInt(gamesCount.rows[0].count),
      movies: parseInt(moviesCount.rows[0].count),
      tv: parseInt(tvCount.rows[0].count),
      news: parseInt(newsCount.rows[0].count),
      total: parseInt(gamesCount.rows[0].count) + parseInt(moviesCount.rows[0].count) + parseInt(tvCount.rows[0].count) + parseInt(newsCount.rows[0].count)
    };

    sendResponse(res, stats);
  } catch (error) {
    console.error('Stats error:', error);
    sendError(res, 'Failed to get stats');
  }
});

export default router;