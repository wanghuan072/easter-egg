import express from 'express';
import jwt from 'jsonwebtoken';
import { pool, query } from '../config/database.js';

const router = express.Router();

// JWT 认证中间件
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      message: 'Authentication token is invalid or expired'
    });
  }
};

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const { mediaType } = req.query;
    
    let queryText = 'SELECT * FROM egg_categories WHERE is_active = true';
    let params = [];
    
    if (mediaType) {
      queryText += ' AND media_type = $1';
      params.push(mediaType);
    }
    
    queryText += ' ORDER BY sort_order, name';
    
    const result = await query(queryText, params);
    
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
    
    const result = await query(
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
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Received category data:', req.body); // 调试日志
    const { name, display_name, media_type, sort_order = 0, is_active = true } = req.body;
    
    // 验证必需字段
    if (!name || !display_name || !media_type) {
      console.log('Validation failed:', { name, display_name, media_type }); // 调试日志
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: `Name, display_name, and media_type are required. Received: name=${name}, display_name=${display_name}, media_type=${media_type}`
      });
    }
    
    // 检查分类名称是否已存在（全局唯一约束）
    const existingCategory = await query(
      'SELECT id, media_type FROM egg_categories WHERE name = $1',
      [name]
    );
    
    if (existingCategory.rows.length > 0) {
      const existingMediaType = existingCategory.rows[0].media_type;
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
        message: `分类名称 "${name}" 已存在，当前用于 ${existingMediaType} 类型。请使用不同的名称。`
      });
    }
    
    const result = await query(
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
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_name, media_type, sort_order, is_active } = req.body;
    
    // 检查分类是否存在，并获取旧名称
    const existingCategory = await query(
      'SELECT id, name FROM egg_categories WHERE id = $1',
      [id]
    );
    
    if (existingCategory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with this ID does not exist'
      });
    }
    
    const oldName = existingCategory.rows[0].name;
    
    // 如果更改了名称，检查是否与其他分类重复（全局唯一约束）
    if (name && name !== oldName) {
      const duplicateCategory = await query(
        'SELECT id, media_type FROM egg_categories WHERE name = $1 AND id != $2',
        [name, id]
      );
      
      if (duplicateCategory.rows.length > 0) {
        const existingMediaType = duplicateCategory.rows[0].media_type;
        return res.status(400).json({
          success: false,
          error: 'Category name already exists',
          message: `分类名称 "${name}" 已存在，当前用于 ${existingMediaType} 类型。请使用不同的名称。`
        });
      }
    }
    
    // 更新分类
    const result = await query(
      'UPDATE egg_categories SET name = COALESCE($1, name), display_name = COALESCE($2, display_name), media_type = COALESCE($3, media_type), sort_order = COALESCE($4, sort_order), is_active = COALESCE($5, is_active) WHERE id = $6 RETURNING *',
      [name, display_name, media_type, sort_order, is_active, id]
    );
    
    // 如果分类名称发生了变化，同步更新所有相关内容项的分类字段
    if (name && name !== oldName) {
      // 更新所有表的相关内容
      const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
      
      for (const table of tables) {
        try {
          // 更新classify数组中包含旧分类名称的记录
          await query(
            `UPDATE ${table} SET classify = array_replace(classify, $1, $2) WHERE $1 = ANY(classify)`,
            [oldName, name]
          );
        } catch (tableError) {
          console.error(`更新 ${table} 表时出错:`, tableError);
          // 继续处理其他表，不中断整个操作
        }
      }
    }
    
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
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query; // 支持硬删除参数
    
    // 检查分类是否存在
    const existingCategory = await query(
      'SELECT id, name FROM egg_categories WHERE id = $1',
      [id]
    );
    
    if (existingCategory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with this ID does not exist'
      });
    }
    
    if (hard === 'true') {
      // 硬删除：完全从数据库中删除
      await query('DELETE FROM egg_categories WHERE id = $1', [id]);
      
      res.json({
        success: true,
        message: 'Category permanently deleted successfully'
      });
    } else {
      // 软删除：将is_active设置为false
      await query(
        'UPDATE egg_categories SET is_active = false WHERE id = $1',
        [id]
      );
      
      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category',
      message: error.message
    });
  }
});

// 恢复已删除的分类
router.put('/:id/restore', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查分类是否存在
    const existingCategory = await query(
      'SELECT id, name, is_active FROM egg_categories WHERE id = $1',
      [id]
    );
    
    if (existingCategory.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
        message: 'Category with this ID does not exist'
      });
    }
    
    if (existingCategory.rows[0].is_active) {
      return res.status(400).json({
        success: false,
        error: 'Category is already active',
        message: 'This category is not deleted'
      });
    }
    
    const result = await query(
      'UPDATE egg_categories SET is_active = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Category restored successfully'
    });
  } catch (error) {
    console.error('Error restoring category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore category',
      message: error.message
    });
  }
});

// 管理员获取所有分类（包括已删除的）
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const { mediaType } = req.query;
    
    let queryText = 'SELECT * FROM egg_categories';
    let params = [];
    
    if (mediaType) {
      queryText += ' WHERE media_type = $1';
      params.push(mediaType);
    }
    
    queryText += ' ORDER BY is_active DESC, sort_order, name';
    
    const result = await query(queryText, params);
    
    res.json({
      success: true,
      data: result.rows,
      message: 'All categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// 批量更新分类排序
router.put('/sort/batch', verifyToken, async (req, res) => {
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
      await query(
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
