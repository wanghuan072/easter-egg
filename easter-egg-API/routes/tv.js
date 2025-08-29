
import express from 'express';
import { Pool } from 'pg';
import { transformData } from '../config/dataStructure.js';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


// Get all TV shows from database
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, classify } = req.query;
    const offset = (page - 1) * limit;
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
    let query = 'SELECT * FROM egg_tv';
    if (where.length) {
      query += ' WHERE ' + where.join(' AND ');
    }
    query += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch TV shows' });
  }
});


// Get TV shows for home page from database
router.get('/home', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM egg_tv WHERE is_home = true ORDER BY publish_date DESC LIMIT 6'
    );
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching home TV shows:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch home TV shows' });
  }
});


// Get latest TV shows from database
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const result = await pool.query(
      'SELECT * FROM egg_tv WHERE is_latest = true ORDER BY publish_date DESC LIMIT $1',
      [limit]
    );
    
    // 转换数据格式
    const transformedData = result.rows.map(row => transformData.dbToFrontend(row));
    
    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch latest TV shows' });
  }
});


// Get TV show by address bar from database
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    const result = await pool.query(
      'SELECT * FROM egg_tv WHERE address_bar = $1 LIMIT 1',
      [addressBar]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'TV show not found' });
    }
    
    // 转换数据格式
    const transformedData = transformData.dbToFrontend(result.rows[0]);
    
    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching TV show:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch TV show' });
  }
});


// Get TV show classifications from database
router.get('/classifications/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT UNNEST(classify) AS classification FROM egg_tv');
    const classifications = [...new Set(result.rows.map(row => row.classification))].sort();
    res.json({ success: true, data: classifications });
  } catch (error) {
    console.error('Error fetching classifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch classifications' });
  }
});

// Create new TV show
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

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
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // 检查address_bar是否已存在
    const existingTV = await pool.query(
      'SELECT id FROM egg_tv WHERE address_bar = $1',
      [address_bar]
    );

    if (existingTV.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Address bar already exists' });
    }

    const result = await pool.query(
      `INSERT INTO egg_tv (
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

    res.json({ success: true, data: result.rows[0], message: 'TV show created successfully' });
  } catch (error) {
    console.error('Error creating TV show:', error);
    res.status(500).json({ success: false, error: 'Failed to create TV show' });
  }
});

// Update TV show
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

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
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await pool.query(
      `UPDATE egg_tv SET
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
      return res.status(404).json({ success: false, error: 'TV show not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'TV show updated successfully' });
  } catch (error) {
    console.error('Error updating TV show:', error);
    res.status(500).json({ success: false, error: 'Failed to update TV show' });
  }
});

// Delete TV show
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM egg_tv WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'TV show not found' });
    }

    res.json({ success: true, data: { id: parseInt(id) }, message: 'TV show deleted successfully' });
  } catch (error) {
    console.error('Error deleting TV show:', error);
    res.status(500).json({ success: false, error: 'Failed to delete TV show' });
  }
});

export default router;
