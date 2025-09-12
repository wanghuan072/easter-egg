import express from 'express';
import { query } from '../config/database.js';
import { DATA_STRUCTURE, transformData } from '../config/dataStructure.js';

const router = express.Router();

// 静态路由配置
const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/games', priority: 0.9, changefreq: 'daily' },
  { path: '/movies', priority: 0.9, changefreq: 'daily' },
  { path: '/tv', priority: 0.9, changefreq: 'daily' },
  { path: '/news', priority: 0.8, changefreq: 'daily' },
  { path: '/search', priority: 0.7, changefreq: 'weekly' },
  { path: '/popular', priority: 0.8, changefreq: 'weekly' },
  { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
  { path: '/terms', priority: 0.3, changefreq: 'monthly' },
  { path: '/copyright', priority: 0.3, changefreq: 'monthly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'monthly' }
];

// 获取所有动态内容
async function getAllDynamicContent() {
  const routes = [];
  
  try {
    // 获取游戏数据
    const gamesResult = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE address_bar IS NOT NULL ORDER BY publish_date DESC`
    );
    
    gamesResult.rows.forEach(game => {
      const transformedGame = transformData.dbToFrontend(game, 'games');
      if (transformedGame.addressBar) {
        routes.push({
          path: `/games/${transformedGame.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: transformedGame.updatedAt || transformedGame.publishDate || new Date().toISOString()
        });
      }
    });
    
    // 获取电影数据
    const moviesResult = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE address_bar IS NOT NULL ORDER BY publish_date DESC`
    );
    
    moviesResult.rows.forEach(movie => {
      const transformedMovie = transformData.dbToFrontend(movie, 'movies');
      if (transformedMovie.addressBar) {
        routes.push({
          path: `/movies/${transformedMovie.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: transformedMovie.updatedAt || transformedMovie.publishDate || new Date().toISOString()
        });
      }
    });
    
    // 获取电视节目数据
    const tvResult = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.TV} WHERE address_bar IS NOT NULL ORDER BY publish_date DESC`
    );
    
    tvResult.rows.forEach(tv => {
      const transformedTv = transformData.dbToFrontend(tv, 'tv');
      if (transformedTv.addressBar) {
        routes.push({
          path: `/tv/${transformedTv.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: transformedTv.updatedAt || transformedTv.publishDate || new Date().toISOString()
        });
      }
    });
    
    // 获取新闻数据
    const newsResult = await query(
      `SELECT * FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE address_bar IS NOT NULL ORDER BY publish_date DESC`
    );
    
    newsResult.rows.forEach(news => {
      const transformedNews = transformData.dbToFrontend(news, 'news');
      if (transformedNews.addressBar) {
        routes.push({
          path: `/news/${transformedNews.addressBar}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: transformedNews.updatedAt || transformedNews.publishDate || new Date().toISOString()
        });
      }
    });
    
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }
  
  return routes;
}

// 生成站点地图XML
function generateSitemapXML(routes) {
  const now = new Date().toISOString();
  const siteUrl = 'https://eastereggvault.com';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  routes.forEach(route => {
    xml += `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  });

  xml += '</urlset>';
  return xml;
}

// 动态站点地图端点
router.get('/', async (req, res) => {
  try {
    console.log('🗺️ 生成动态站点地图...');
    
    // 获取所有动态内容
    const dynamicRoutes = await getAllDynamicContent();
    
    // 合并静态和动态路由
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // 生成XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // 设置正确的Content-Type
    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // 缓存1小时
    });
    
    console.log(`✅ 站点地图生成完成，包含 ${allRoutes.length} 个URL`);
    res.send(sitemapXML);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap',
      message: error.message
    });
  }
});

// 触发站点地图更新端点（用于后台管理）
router.post('/update', async (req, res) => {
  try {
    console.log('🔄 触发站点地图更新...');
    
    // 获取所有动态内容
    const dynamicRoutes = await getAllDynamicContent();
    
    // 合并静态和动态路由
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // 生成XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // 这里可以添加将站点地图保存到文件系统的逻辑
    // 或者触发前端重新生成站点地图
    
    console.log(`✅ 站点地图更新完成，包含 ${allRoutes.length} 个URL`);
    
    res.json({
      success: true,
      message: 'Sitemap updated successfully',
      totalRoutes: allRoutes.length,
      dynamicRoutes: dynamicRoutes.length,
      staticRoutes: staticRoutes.length
    });
    
  } catch (error) {
    console.error('Error updating sitemap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update sitemap',
      message: error.message
    });
  }
});

export default router;
