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
    
    console.log(`🎮 游戏数据查询结果: ${gamesResult.rows.length} 条记录`);
    gamesResult.rows.forEach((game, index) => {
      console.log(`   游戏 ${index + 1}: address_bar = "${game.address_bar}"`);
    });
    
    gamesResult.rows.forEach(game => {
      const transformedGame = transformData.dbToFrontend(game, 'games');
      if (transformedGame.addressBar) {
        routes.push({
          path: `/games/${transformedGame.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: formatDateToISO(transformedGame.updatedAt || transformedGame.publishDate)
        });
        console.log(`   ✅ 添加游戏路由: /games/${transformedGame.addressBar}`);
      } else {
        console.log(`   ❌ 跳过游戏: addressBar为空`);
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
          lastmod: formatDateToISO(transformedMovie.updatedAt || transformedMovie.publishDate)
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
          lastmod: formatDateToISO(transformedTv.updatedAt || transformedTv.publishDate)
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
          lastmod: formatDateToISO(transformedNews.updatedAt || transformedNews.publishDate)
        });
      }
    });
    
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }
  
  return routes;
}

// 格式化日期为ISO 8601格式
function formatDateToISO(dateString) {
  if (!dateString) {
    return new Date().toISOString();
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}, using current time`);
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}, using current time`, error);
    return new Date().toISOString();
  }
}

// 生成站点地图XML
function generateSitemapXML(routes) {
  const now = new Date().toISOString();
  const siteUrl = 'https://eastereggvault.com';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  routes.forEach(route => {
    const lastmod = formatDateToISO(route.lastmod);
    xml += `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
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
    console.log(`   请求时间: ${new Date().toISOString()}`);
    console.log(`   请求头: ${JSON.stringify(req.headers)}`);
    
    // 获取所有动态内容
    const dynamicRoutes = await getAllDynamicContent();
    
    // 合并静态和动态路由
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // 生成XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // 设置正确的Content-Type和缓存策略
    const timestamp = Date.now();
    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=60, must-revalidate', // 缓存1分钟，必须重新验证
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${timestamp}"`, // 添加ETag强制刷新
      'X-Sitemap-Generated': timestamp.toString() // 添加自定义头用于调试
    });
    
    console.log(`✅ 站点地图生成完成，包含 ${allRoutes.length} 个URL`);
    console.log(`   - 静态路由: ${staticRoutes.length}`);
    console.log(`   - 动态路由: ${dynamicRoutes.length}`);
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
    console.log(`   请求时间: ${new Date().toISOString()}`);
    console.log(`   环境: ${process.env.NODE_ENV || 'development'}`);
    
    // 获取所有动态内容
    const dynamicRoutes = await getAllDynamicContent();
    
    // 合并静态和动态路由
    const allRoutes = [...staticRoutes, ...dynamicRoutes];
    
    // 生成XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // 站点地图数据已准备就绪，需要手动生成本地文件
    console.log(`✅ 站点地图数据已准备就绪，包含 ${allRoutes.length} 个URL`);
    console.log(`   - 静态路由: ${staticRoutes.length}`);
    console.log(`   - 动态路由: ${dynamicRoutes.length}`);
    console.log(`   - XML大小: ${sitemapXML.length} 字符`);
    console.log(`💡 请使用前端脚本生成本地文件: node generate-local-sitemap.js`);
    
    console.log(`✅ 站点地图数据已更新，包含 ${allRoutes.length} 个URL`);
    console.log(`   - 静态路由: ${staticRoutes.length}`);
    console.log(`   - 动态路由: ${dynamicRoutes.length}`);
    console.log(`   - XML大小: ${sitemapXML.length} 字符`);
    
    // 返回成功响应，包含完整的站点地图XML
    res.json({
      success: true,
      message: 'Sitemap data updated successfully',
      totalRoutes: allRoutes.length,
      dynamicRoutes: dynamicRoutes.length,
      staticRoutes: staticRoutes.length,
      sitemapUrl: process.env.NODE_ENV === 'production' ? 'https://eastereggvault.com/sitemap.xml' : 'http://localhost:5173/sitemap.xml',
      sitemapXML: sitemapXML, // 添加完整的XML内容
      note: 'Sitemap is dynamically generated via API endpoint'
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
