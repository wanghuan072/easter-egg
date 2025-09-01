import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const { mediaType } = req.query;
    
    let query = 'SELECT * FROM egg_categories';
    let params = [];
    
    if (mediaType) {
      query += ' WHERE media_type = $1';
      params.push(mediaType);
    }
    
    query += ' ORDER BY sort_order, name';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// 获取特定媒体类型的分类
router.get('/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM egg_categories WHERE media_type = $1 AND is_active = true ORDER BY sort_order, name',
      [mediaType]
    );
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// 创建新分类
router.post('/', async (req, res) => {
  try {
    const { name, display_name, media_type, sort_order = 0, is_active = true } = req.body;
    
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }
    
    // 验证必需字段
    if (!name || !display_name || !media_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, display_name, and media_type are required'
      });
    }
    
    // 检查分类名称是否已存在
    const existingCategory = await pool.query(
      'SELECT id FROM egg_categories WHERE name = $1 AND media_type = $2',
      [name, media_type]
    );
    
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
        message: 'A category with this name already exists for this media type'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO egg_categories (name, display_name, media_type, sort_order, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, display_name, media_type, sort_order, is_active]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category',
      message: error.message
    });
  }
});

// 更新分类
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_name, media_type, sort_order, is_active } = req.body;
    
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }
    
    // 检查分类是否存在
    const existingCategory = await pool.query(
      'SELECT id FROM egg_categories WHERE id = $1',
      [id]
    );
    
    if (existingCategory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with this ID does not exist'
      });
    }
    
    // 如果更改了名称，检查是否与其他分类重复
    if (name) {
      const duplicateCategory = await pool.query(
        'SELECT id FROM egg_categories WHERE name = $1 AND media_type = $2 AND id != $3',
        [name, media_type, id]
      );
      
      if (duplicateCategory.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Category name already exists',
          message: 'A category with this name already exists for this media type'
        });
      }
    }
    
    const result = await pool.query(
      'UPDATE egg_categories SET name = COALESCE($1, name), display_name = COALESCE($2, display_name), media_type = COALESCE($3, media_type), sort_order = COALESCE($4, sort_order), is_active = COALESCE($5, is_active) WHERE id = $6 RETURNING *',
      [name, display_name, media_type, sort_order, is_active, id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category',
      message: error.message
    });
  }
});

// 删除分类
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }
    
    // 这里可以添加JWT验证逻辑，暂时跳过具体验证
    // 在实际部署时应该验证token的有效性
    
    // 检查分类是否存在
    const existingCategory = await pool.query(
      'SELECT id FROM egg_categories WHERE id = $1',
      [id]
    );
    
    if (existingCategory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with this ID does not exist'
      });
    }
    
    // 软删除：将is_active设置为false
    await pool.query(
      'UPDATE egg_categories SET is_active = false WHERE id = $1',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

// 批量更新分类排序
router.put('/sort/batch', async (req, res) => {
  try {
    const { categories } = req.body; // [{id, sort_order}, ...]
    
    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid data format',
        message: 'Categories must be an array'
      });
    }
    
    // 批量更新排序
    for (const category of categories) {
      await pool.query(
        'UPDATE egg_categories SET sort_order = $1 WHERE id = $2',
        [category.sort_order, category.id]
      );
    }
    
    res.json({
      success: true,
      message: 'Categories order updated successfully'
    });
  } catch (error) {
    console.error('Error updating categories order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update categories order',
      message: error.message
    });
  }
});

export default router;
