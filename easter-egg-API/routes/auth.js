import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const router = express.Router();

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '用户名和密码不能为空'
      });
    }

    // 查询用户
    const query = 'SELECT id, username, password_hash FROM egg_users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    const user = result.rows[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // 更新最后登录时间（暂时注释掉，因为表结构中没有此字段）
    // await pool.query(
    //   'UPDATE egg_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    //   [user.id]
    // );

    // 返回成功响应
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      },
      message: '登录成功'
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

// 验证token接口
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: '未提供有效的认证token'
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // 查询用户信息
      const query = 'SELECT id, username FROM egg_users WHERE id = $1';
      const result = await pool.query(query, [decoded.userId]);

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: {
          user: result.rows[0]
        },
        message: 'token验证成功'
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'token无效或已过期'
      });
    }

  } catch (error) {
    console.error('验证token错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

export default router;
