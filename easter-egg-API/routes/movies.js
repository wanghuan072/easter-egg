import express from 'express';
import jwt from 'jsonwebtoken';
import { pool, query } from '../config/database.js';
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

// JWT 认证中间件
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return sendError(res, 'Access token required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

// Get all movies from database
router.get('/', async (req, res) => {
  try {
    const { page = DATA_STRUCTURE.PAGINATION.DEFAULT_PAGE, limit = DATA_STRUCTURE.PAGINATION.DEFAULT_LIMIT, search, classify } = req.query;
    
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
    
    let queryText = `SELECT * FROM ${DATA_STRUCTURE.TABLES.MOVIES}`;
    if (where.length) {
      queryText += ' WHERE ' + where.join(' AND ');
    }
    queryText += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offset);

    const result = await query(queryText, params);
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    const countQuery = `SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.MOVIES}`;
    const countResult = await query(countQuery);
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
    console.error('Error fetching movies:', error);
    sendError(res, 'Failed to fetch movies');
  }
});

// Get movies for home page
router.get('/home', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE is_home = true ORDER BY publish_date DESC LIMIT 6`
    );
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching home movies:', error);
    sendError(res, 'Failed to fetch home movies');
  }
});

// Get latest movies from database
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const limitNum = Math.min(parseInt(limit), DATA_STRUCTURE.PAGINATION.MAX_LIMIT);
    
    const result = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE is_latest = true ORDER BY publish_date DESC LIMIT $1`,
      [limitNum]
    );
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    sendError(res, 'Failed to fetch latest movies');
  }
});

// Get movie by address bar from database
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    const result = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE address_bar = $1 LIMIT 1`,
      [addressBar]
    );
    
    if (result.rows.length === 0) {
      return sendError(res, 'Movie not found', 404);
    }
    
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching movie:', error);
    sendError(res, 'Failed to fetch movie');
  }
});

// Get movie classifications from database
router.get('/classifications/all', async (req, res) => {
  try {
    const result = await query(`SELECT DISTINCT UNNEST(classify) AS classification FROM ${DATA_STRUCTURE.TABLES.MOVIES}`);
    const classifications = [...new Set(result.rows.map(row => row.classification))].sort();
    sendResponse(res, classifications);
  } catch (error) {
    console.error('Error fetching classifications:', error);
    sendError(res, 'Failed to fetch classifications');
  }
});

// Create new movie
router.post('/', verifyToken, async (req, res) => {
  try {

    
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

    // 验证必填字段
    if (!title || !description || !address_bar) {

      return sendError(res, 'Missing required fields: title, description, address_bar', 400);
    }

    // 检查address_bar是否已存在
    const existingMovie = await query(
      `SELECT id FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE address_bar = $1`,
      [address_bar]
    );

    if (existingMovie.rows.length > 0) {
      return sendError(res, 'Address bar already exists', 400);
    }

    // 准备插入数据
    const insertData = [
      title, 
      description, 
      publish_date || new Date().toISOString().split('T')[0], 
      is_latest || false, 
      is_home || false,
      label ? [label] : [], // label 应该是数组
      classify || [], 
      image_url, 
      image_alt, 
      address_bar, 
      iframe_url,
      seo_title, 
      seo_description, 
      seo_keywords, 
      details_html, 
      req.user.id || 1, 
      req.user.id || 1
    ];



    const result = await query(
      `INSERT INTO ${DATA_STRUCTURE.TABLES.MOVIES} (
        title, description, publish_date, is_latest, is_home, label, classify,
        image_url, image_alt, address_bar, iframe_url, seo_title, seo_description,
        seo_keywords, details_html, created_by, updated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      insertData
    );

    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'Movie created successfully');
  } catch (error) {
    console.error('Error creating movie:', error);

    sendError(res, `Failed to create movie: ${error.message}`, 500);
  }
});

// Update movie
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
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

    // 验证必填字段
    if (!title || !description) {
      return sendError(res, 'Missing required fields', 400);
    }

    const result = await query(
      `UPDATE ${DATA_STRUCTURE.TABLES.MOVIES} SET
        title = $1, description = $2, publish_date = $3, is_latest = $4, is_home = $5,
        label = $6, classify = $7, image_url = $8, image_alt = $9, iframe_url = $10,
        seo_title = $11, seo_description = $12, seo_keywords = $13, details_html = $14,
        updated_by = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16 RETURNING *`,
      [
        title, description, publish_date, is_latest || false, is_home || false,
        label, classify || [], image_url, image_alt, iframe_url,
        seo_title, seo_description, seo_keywords, details_html, req.user.id || 1, id
      ]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Movie not found', 404);
    }

    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'Movie updated successfully');
  } catch (error) {
    console.error('Error updating movie:', error);
    sendError(res, 'Failed to update movie');
  }
});

// Delete movie
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `DELETE FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Movie not found', 404);
    }

    sendResponse(res, { id: parseInt(id) }, null, 'Movie deleted successfully');
  } catch (error) {
    console.error('Error deleting movie:', error);
    sendError(res, 'Failed to delete movie');
  }
});

export default router;