#!/usr/bin/env node

// 域名更新脚本
// 使用方法: node scripts/update-domain.js your-new-domain.com

import fs from 'fs';
import path from 'path';

const oldDomain = 'easter-egg-sandy.vercel.app';
const newDomain = process.argv[2];

if (!newDomain) {
  console.error('请提供新域名！');
  console.log('使用方法: node scripts/update-domain.js your-new-domain.com');
  process.exit(1);
}

// 需要更新的文件列表
const filesToUpdate = [
  '.env.production',
  'vite.config.js',
  'src/router/guards.js',
  'src/seo/scripts/generate-sitemap.js',
  'index.html',
  '.robots.production.txt'
];

console.log(`🔄 开始将域名从 ${oldDomain} 更新为 ${newDomain}`);

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(new RegExp(oldDomain, 'g'), newDomain);
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent);
        console.log(`✅ 已更新: ${filePath}`);
      } else {
        console.log(`⏭️  跳过: ${filePath} (未找到旧域名)`);
      }
    } else {
      console.log(`⚠️  文件不存在: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ 更新失败: ${filePath}`, error.message);
  }
});

console.log('\n📋 还需要手动更新的地方:');
console.log('1. Vercel后端环境变量: CORS_ORIGIN');
console.log('2. Vercel前端环境变量: VITE_SITE_URL, VITE_SITEMAP_URL');
console.log('3. 域名DNS设置指向Vercel');
console.log('\n🎉 域名更新完成！记得重新部署项目。');