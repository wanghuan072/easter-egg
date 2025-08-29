
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
    
    // 调试：查看原始数据库行数据
    console.log('🔍 原始数据库行数据示例:', result.rows[0] ? {
      id: result.rows[0].id,
      title: result.rows[0].title,
      publish_date: result.rows[0].publish_date,
      iframe_url: result.rows[0].iframe_url,
      seo_description: result.rows[0].seo_description,
      seo_keywords: result.rows[0].seo_keywords
    } : '无数据');
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    // 调试：查看转换后的数据
    console.log('🔍 转换后的数据示例:', transformedData[0] ? {
      id: transformedData[0].id,
      title: transformedData[0].title,
      publishDate: transformedData[0].publishDate,
      iframeUrl: transformedData[0].iframeUrl,
      seoDescription: transformedData[0].seoDescription,
      seoKeywords: transformedData[0].seoKeywords
    } : '无数据');
    
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
      `SELECT id, title, is_latest FROM ${DATA_STRUCTURE.GAMES} WHERE is_latest = true ORDER BY publish_date DESC`
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

// Create new game
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendError(res, 'Unauthorized', 401);
    }

    console.log('🔍 创建游戏 - 接收到的数据:', req.body);
    
    const {
      title,
      description,
      publish_date,
      is_latest,
      is_home,
      label,
      classify,
      image_url,
      image_alt,
      address_bar,
      iframe_url,
      seo_title,
      seo_description,
      seo_keywords,
      details_html
    } = req.body;
    
    console.log('🔍 创建游戏 - 关键字段检查:');
    console.log('  - iframe_url:', iframe_url, '类型:', typeof iframe_url);
    console.log('  - seo_description:', seo_description, '类型:', typeof seo_description);
    console.log('  - seo_keywords:', seo_keywords, '类型:', typeof seo_keywords);

    // 验证必填字段
    if (!title || !description || !address_bar) {
      return sendError(res, 'Missing required fields', 400);
    }

    // 检查address_bar是否已存在
    const existingGame = await pool.query(
      `SELECT id FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE address_bar = $1`,
      [address_bar]
    );

    if (existingGame.rows.length > 0) {
      return sendError(res, 'Address bar already exists', 400);
    }

    const result = await pool.query(
      `INSERT INTO ${DATA_STRUCTURE.TABLES.GAMES} (
        title, description, publish_date, is_latest, is_home, label, classify,
        image_url, image_alt, address_bar, iframe_url, seo_title, seo_description,
        seo_keywords, details_html, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        title, description, publish_date || new Date().toISOString().split('T')[0], is_latest || false, is_home || false,
        label, classify || [], image_url, image_alt, address_bar, iframe_url,
        seo_title, seo_description, seo_keywords, details_html, 1, 1
      ]
    );

    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'Game created successfully');
  } catch (error) {
    console.error('Error creating game:', error);
    sendError(res, 'Failed to create game');
  }
});

// Update game
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    console.log('🔍 更新游戏 - 接收到的数据:', req.body);
    
    const {
      title,
      description,
      publish_date,
      is_latest,
      is_home,
      label,
      classify,
      image_url,
      image_alt,
      iframe_url,
      seo_title,
      seo_description,
      seo_keywords,
      details_html
    } = req.body;
    
    console.log('🔍 更新游戏 - 关键字段检查:');
    console.log('  - iframe_url:', iframe_url, '类型:', typeof iframe_url);
    console.log('  - seo_description:', seo_description, '类型:', typeof seo_description);
    console.log('  - seo_keywords:', seo_keywords, '类型:', typeof seo_keywords);

    // 验证必填字段
    if (!title || !description) {
      return sendError(res, 'Missing required fields', 400);
    }

    const result = await pool.query(
      `UPDATE ${DATA_STRUCTURE.TABLES.GAMES} SET
        title = $1, description = $2, publish_date = $3, is_latest = $4, is_home = $5,
        label = $6, classify = $7, image_url = $8, image_alt = $9, iframe_url = $10,
        seo_title = $11, seo_description = $12, seo_keywords = $13, details_html = $14,
        updated_by = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16 RETURNING *`,
      [
        title, description, publish_date, is_latest || false, is_home || false,
        label, classify || [], image_url, image_alt, iframe_url,
        seo_title, seo_description, seo_keywords, details_html, 1, id
      ]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Game not found', 404);
    }

    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'Game updated successfully');
  } catch (error) {
    console.error('Error updating game:', error);
    sendError(res, 'Failed to update game');
  }
});

// Delete game
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Game not found', 404);
    }

    sendResponse(res, { id: parseInt(id) }, null, 'Game deleted successfully');
  } catch (error) {
    console.error('Error deleting game:', error);
    sendError(res, 'Failed to delete game');
  }
});

export default router;
