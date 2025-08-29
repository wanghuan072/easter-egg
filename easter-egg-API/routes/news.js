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

// 获取所有新闻（分页、搜索、筛选）
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
    
    let query = `SELECT * FROM ${DATA_STRUCTURE.TABLES.NEWS}`;
    if (where.length) {
      query += ' WHERE ' + where.join(' AND ');
    }
    query += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limitNum, offset);

    const result = await pool.query(query, params);
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    // 计算分页信息
    const countQuery = `SELECT COUNT(*) FROM ${DATA_STRUCTURE.TABLES.NEWS}`;
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
    console.error('Error fetching news:', error);
    sendError(res, 'Failed to fetch news');
  }
});

// 获取首页新闻
router.get('/home', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE is_home = true ORDER BY publish_date DESC LIMIT 6`
    );
    
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching home news:', error);
    sendError(res, 'Failed to fetch home news');
  }
});

// 根据地址栏获取新闻详情
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE address_bar = $1 LIMIT 1`,
      [addressBar]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'News not found' });
    }
    
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData);
  } catch (error) {
    console.error('Error fetching news:', error);
    sendError(res, 'Failed to fetch news');
  }
});

// 获取新闻分类
router.get('/classifications/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT UNNEST(classify) AS classification FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE classify IS NOT NULL AND array_length(classify, 1) > 0`
    );
    
    const classifications = result.rows.map(row => row.classification);
    sendResponse(res, classifications);
  } catch (error) {
    console.error('Error fetching news classifications:', error);
    sendError(res, 'Failed to fetch news classifications');
  }
});

// 创建新闻（需要认证）
router.post('/', async (req, res) => {
  try {
    const newsData = req.body;
    
    // 验证必需字段
    console.log('Received news data:', newsData);
    const validation = validateData.requiredFields(newsData);
    if (!validation.valid) {
      console.error('Validation failed:', validation);
      return res.status(400).json({ success: false, error: validation.message });
    }
    
    // 设置默认值
    const dataToInsert = {
      ...newsData,
      label: newsData.label || 'NEWS',
      classify: newsData.classify || [],
      publish_date: newsData.publish_date || new Date().toISOString().split('T')[0],
      created_by: 1,
      updated_by: 1
    };
    
    // 移除新闻不需要的字段
    delete dataToInsert.is_latest;
    delete dataToInsert.iframe_url;
    
    const columns = Object.keys(dataToInsert);
    const values = Object.values(dataToInsert);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${DATA_STRUCTURE.TABLES.NEWS} (${columns.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    
    sendResponse(res, transformedData, null, 'News created successfully');
  } catch (error) {
    console.error('Error creating news:', error);
    console.error('Request body:', req.body);
    if (error.code === '23505') { // 唯一约束违反
      sendError(res, 'Address bar already exists', 400);
    } else {
      sendError(res, `Failed to create news: ${error.message}`);
    }
  }
});

// 更新新闻（需要认证）
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // 验证必需字段
    const validation = validateData.requiredFields(updateData);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.message });
    }
    
    // 移除新闻不需要的字段
    delete updateData.is_latest;
    delete updateData.iframe_url;
    
    // 设置更新者信息
    updateData.updated_by = 1;
    
    const columns = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = columns.map((col, index) => `${col} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE ${DATA_STRUCTURE.TABLES.NEWS} 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'News not found' });
    }
    
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'News updated successfully');
  } catch (error) {
    console.error('Error updating news:', error);
    if (error.code === '23505') { // 唯一约束违反
      sendError(res, 'Address bar already exists', 400);
    } else {
      sendError(res, 'Failed to update news');
    }
  }
});

// 删除新闻（需要认证）
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `DELETE FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE id = $1 RETURNING id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'News not found' });
    }
    
    sendResponse(res, { id: result.rows[0].id }, null, 'News deleted successfully');
  } catch (error) {
    console.error('Error deleting news:', error);
    sendError(res, 'Failed to delete news');
  }
});

// 批量更新新闻状态（首页显示、分类等）
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_home, classify } = req.body;
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (typeof is_home === 'boolean') {
      updateFields.push(`is_home = $${paramIndex++}`);
      values.push(is_home);
    }
    
    if (classify && Array.isArray(classify)) {
      updateFields.push(`classify = $${paramIndex++}`);
      values.push(classify);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }
    
    values.push(1); // updated_by
    values.push(id); // WHERE id
    
    const query = `
      UPDATE ${DATA_STRUCTURE.TABLES.NEWS} 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP, updated_by = $${paramIndex}
      WHERE id = $${paramIndex + 1} 
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'News not found' });
    }
    
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    sendResponse(res, transformedData, null, 'News status updated successfully');
  } catch (error) {
    console.error('Error updating news status:', error);
    sendError(res, 'Failed to update news status');
  }
});

export default router;
