
import express from 'express';
import { Pool } from 'pg';
import { DATA_STRUCTURE, transformData, validateData } from '../config/dataStructure.js';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

// Get all games from database
router.get('/', async (req, res) => {
  try {
    const { page = DATA_STRUCTURE.PAGINATION.DEFAULT_PAGE, limit = DATA_STRUCTURE.PAGINATION.DEFAULT_LIMIT, search, classify } = req.query;
    
    // 验证参数
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit), DATA_STRUCTURE.PAGINATION.MAX_LIMIT);
    const offset = (pageNum - 1) * limitNum;
    
    let where = [];
    let params = [];

    if (search) {
      params.push(`%${search}%`);
      where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }
    if (classify) {
      params.push(classify);
      where.push(`$${params.length} = ANY(classify)`);
    }
    
    let query = `SELECT * FROM ${DATA_STRUCTURE.TABLES.GAMES}`;
    if (where.length) {
      query += ' WHERE ' + where.join(' AND ');
    }
    query += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offset);

    const result = await pool.query(query, params);
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    // 计算分页信息
    const countQuery = `SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.GAMES}`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limitNum);
    
    const pagination = {
      page: pageNum,
      limit: limitNum,
      total: total,
      pages: pages
    };
    
    sendResponse(res, transformedData, pagination);
  } catch (error) {
    console.error('Error fetching games:', error);
    sendError(res, 'Failed to fetch games');
  }
});

// Get games for home page from database
router.get('/home', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE is_home = true ORDER BY publish_date DESC LIMIT 6`
    );
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching home games:', error);
    sendError(res, 'Failed to fetch home games');
  }
});

// Get latest games from database
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const limitNum = Math.min(parseInt(limit), DATA_STRUCTURE.PAGINATION.MAX_LIMIT);
    
    console.log(`Fetching latest games with limit: ${limitNum}`);
    
    const result = await pool.query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE is_latest = true ORDER BY publish_date DESC LIMIT $1`,
      [limitNum]
    );
    
    console.log(`Found ${result.rows.length} games with is_latest = true`);
    console.log('Game IDs:', result.rows.map(row => row.id));
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching latest games:', error);
    sendError(res, 'Failed to fetch latest games');
  }
});

// Get game by address bar from database
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    const result = await pool.query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE address_bar = $1 LIMIT 1`,
      [addressBar]
    );
    
    if (result.rows.length === 0) {
      return sendError(res, 'Game not found', 404);
    }
    
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching game:', error);
    sendError(res, 'Failed to fetch game');
  }
});

// Get game classifications from database
router.get('/classifications/all', async (req, res) => {
  try {
    const result = await pool.query(`SELECT DISTINCT UNNEST(classify) AS classification FROM ${DATA_STRUCTURE.TABLES.GAMES}`);
    const classifications = [...new Set(result.rows.map(row => row.classification))].sort();
    sendResponse(res, classifications);
  } catch (error) {
    console.error('Error fetching classifications:', error);
    sendError(res, 'Failed to fetch classifications');
  }
});

// Debug route to check latest games count
router.get('/debug/latest-count', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE is_latest = true`
    );
    const count = result.rows[0].count;
    
    // Also get the actual records
    const records = await pool.query(
      `SELECT id, title, is_latest FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE is_latest = true ORDER BY publish_date DESC`
    );
    
    res.json({
      success: true,
      count: parseInt(count),
      records: records.rows
    });
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
