#!/usr/bin/env node

/**
 * 站点地图更新脚本
 * 从后端API获取最新站点地图并更新前端
 */

import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:3000';
const SITEMAP_PATH = './public/sitemap.xml';

async function updateSitemap() {
  try {
    console.log('🔄 正在从后端API获取最新站点地图...');
    
    // 1. 触发后端更新
    console.log('📡 触发后端站点地图更新...');
    const updateResponse = await fetch(`${API_BASE_URL}/api/sitemap/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!updateResponse.ok) {
      throw new Error(`更新请求失败: ${updateResponse.status}`);
    }
    
    const updateResult = await updateResponse.json();
    console.log('✅ 后端更新完成:', updateResult.message);
    console.log(`   - 总路由数: ${updateResult.totalRoutes}`);
    console.log(`   - 动态路由: ${updateResult.dynamicRoutes}`);
    console.log(`   - 静态路由: ${updateResult.staticRoutes}`);
    
    // 2. 获取站点地图XML
    console.log('📄 获取站点地图XML...');
    const sitemapResponse = await fetch(`${API_BASE_URL}/api/sitemap`);
    
    if (!sitemapResponse.ok) {
      throw new Error(`获取站点地图失败: ${sitemapResponse.status}`);
    }
    
    const sitemapXML = await sitemapResponse.text();
    
    // 3. 保存到public目录
    fs.writeFileSync(SITEMAP_PATH, sitemapXML, 'utf8');
    
    console.log('✅ 站点地图已更新!');
    console.log(`   - 文件路径: ${SITEMAP_PATH}`);
    console.log(`   - 文件大小: ${sitemapXML.length} 字符`);
    console.log('');
    console.log('📋 下一步:');
    console.log('   1. 检查文件: public/sitemap.xml');
    console.log('   2. 提交到Git: git add public/sitemap.xml');
    console.log('   3. 推送: git commit -m "更新站点地图" && git push');
    console.log('   4. Vercel会自动部署');
    console.log('');
    console.log('🔍 验证站点地图:');
    console.log('   - 本地: http://localhost:5173/sitemap.xml');
    console.log('   - 线上: https://eastereggvault.com/sitemap.xml');
    
  } catch (error) {
    console.error('❌ 更新站点地图失败:', error.message);
    process.exit(1);
  }
}

// 运行更新
updateSitemap();
