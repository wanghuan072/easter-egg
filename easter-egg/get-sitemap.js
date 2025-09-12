import fs from 'fs';

// 从API获取站点地图并保存到public目录
async function getSitemap() {
  try {
    console.log('🔄 正在从API获取最新站点地图...');
    
    const response = await fetch('https://easter-egg-api.vercel.app/api/sitemap');
    const sitemapXML = await response.text();
    
    // 保存到public目录
    fs.writeFileSync('public/sitemap.xml', sitemapXML, 'utf8');
    
    console.log('✅ 站点地图已保存到 public/sitemap.xml');
    console.log(`   文件大小: ${sitemapXML.length} 字符`);
    console.log('');
    console.log('📋 下一步:');
    console.log('   1. 检查文件: public/sitemap.xml');
    console.log('   2. 提交到Git: git add public/sitemap.xml');
    console.log('   3. 推送: git commit -m "更新站点地图" && git push');
    console.log('   4. Vercel会自动部署');
    
  } catch (error) {
    console.error('❌ 获取站点地图失败:', error.message);
  }
}

getSitemap();
