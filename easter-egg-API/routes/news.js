import express from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Get all news from database
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
    let query = 'SELECT * FROM egg_news';
    if (where.length) {
      query += ' WHERE ' + where.join(' AND ');
    }
    query += ` ORDER BY publish_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

// Get news for home page from database
router.get('/home', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM egg_news WHERE is_home = true ORDER BY publish_date DESC LIMIT 6'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching home news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch home news' });
  }
});

// Get latest news from database
router.get('/latest', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const result = await pool.query(
      'SELECT * FROM egg_news WHERE is_latest = true ORDER BY publish_date DESC LIMIT $1',
      [limit]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch latest news' });
  }
});

// Get news by address bar from database
router.get('/:addressBar', async (req, res) => {
  try {
    const { addressBar } = req.params;
    const result = await pool.query(
      'SELECT * FROM egg_news WHERE address_bar = $1 LIMIT 1',
      [addressBar]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'News not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

// Get news classifications from database
router.get('/classifications/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT UNNEST(classify) AS classification FROM egg_news');
    const classifications = [...new Set(result.rows.map(row => row.classification))].sort();
    res.json({ success: true, data: classifications });
  } catch (error) {
    console.error('Error fetching classifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch classifications' });
  }
});

export default router;
