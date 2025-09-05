import express from 'express';
import { query } from '../config/database.js';
import { DATA_STRUCTURE } from '../config/dataStructure.js';

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

// 生成站点地图XML
function generateSitemapXML(routes) {
  const now = new Date().toISOString();
  const siteUrl = process.env.SITE_URL || 'https://eastereggvault.com';
  
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

// 获取所有数据用于站点地图
async function getAllDataForSitemap() {
  try {
    console.log('📊 Fetching all data for sitemap...');
    
    // 并行获取所有数据，只获取必要的字段
    const [gamesResult, moviesResult, tvResult, newsResult] = await Promise.all([
      query(`SELECT id, title, address_bar, updated_at, publish_date FROM ${DATA_STRUCTURE.TABLES.GAMES} WHERE address_bar IS NOT NULL AND address_bar != '' ORDER BY publish_date DESC`),
      query(`SELECT id, title, address_bar, updated_at, publish_date FROM ${DATA_STRUCTURE.TABLES.MOVIES} WHERE address_bar IS NOT NULL AND address_bar != '' ORDER BY publish_date DESC`),
      query(`SELECT id, title, address_bar, updated_at, publish_date FROM ${DATA_STRUCTURE.TABLES.TV} WHERE address_bar IS NOT NULL AND address_bar != '' ORDER BY publish_date DESC`),
      query(`SELECT id, title, address_bar, updated_at, publish_date FROM ${DATA_STRUCTURE.TABLES.NEWS} WHERE address_bar IS NOT NULL AND address_bar != '' ORDER BY publish_date DESC`)
    ]);

    const result = {
      games: gamesResult.rows,
      movies: moviesResult.rows,
      tv: tvResult.rows,
      news: newsResult.rows
    };
    
    console.log(`📈 Data fetched: Games(${result.games.length}), Movies(${result.movies.length}), TV(${result.tv.length}), News(${result.news.length})`);
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching data for sitemap:', error);
    throw error;
  }
}

// 动态生成站点地图
router.get('/sitemap.xml', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('🗺️  Generating dynamic sitemap...');
    
    // 获取所有数据
    const data = await getAllDataForSitemap();
    
    // 构建路由数组
    const routes = [...staticRoutes];
    let totalDynamicRoutes = 0;
    
    // 添加游戏路由
    if (data.games && data.games.length > 0) {
      data.games.forEach(game => {
        if (game.address_bar) {
          routes.push({
            path: `/games/${game.address_bar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: game.updated_at || game.publish_date || new Date().toISOString()
          });
        }
      });
      totalDynamicRoutes += data.games.length;
    }
    
    // 添加电影路由
    if (data.movies && data.movies.length > 0) {
      data.movies.forEach(movie => {
        if (movie.address_bar) {
          routes.push({
            path: `/movies/${movie.address_bar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: movie.updated_at || movie.publish_date || new Date().toISOString()
          });
        }
      });
      totalDynamicRoutes += data.movies.length;
    }
    
    // 添加电视路由
    if (data.tv && data.tv.length > 0) {
      data.tv.forEach(tv => {
        if (tv.address_bar) {
          routes.push({
            path: `/tv/${tv.address_bar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: tv.updated_at || tv.publish_date || new Date().toISOString()
          });
        }
      });
      totalDynamicRoutes += data.tv.length;
    }
    
    // 添加新闻路由
    if (data.news && data.news.length > 0) {
      data.news.forEach(news => {
        if (news.address_bar) {
          routes.push({
            path: `/news/${news.address_bar}`,
            priority: 0.7,
            changefreq: 'weekly',
            lastmod: news.updated_at || news.publish_date || new Date().toISOString()
          });
        }
      });
      totalDynamicRoutes += data.news.length;
    }
    
    // 生成XML
    const sitemapXML = generateSitemapXML(routes);
    
    // 设置响应头
    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800', // 缓存30分钟
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"sitemap-${Date.now()}"`
    });
    
    const generationTime = Date.now() - startTime;
    console.log(`✅ Dynamic sitemap generated in ${generationTime}ms: ${routes.length} total routes (${staticRoutes.length} static + ${totalDynamicRoutes} dynamic)`);
    
    // 返回XML
    res.send(sitemapXML);
    
  } catch (error) {
    console.error('❌ Error generating dynamic sitemap:', error);
    
    // 返回错误响应，但保持XML格式
    res.status(500).set('Content-Type', 'application/xml; charset=utf-8').send(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Failed to generate sitemap</message>
  <details>${error.message}</details>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`);
  }
});

// 获取站点地图统计信息
router.get('/sitemap/stats', async (req, res) => {
  try {
    const data = await getAllDataForSitemap();
    
    const stats = {
      static: staticRoutes.length,
      dynamic: {
        games: data.games.length,
        movies: data.movies.length,
        tv: data.tv.length,
        news: data.news.length,
        total: data.games.length + data.movies.length + data.tv.length + data.news.length
      },
      total: staticRoutes.length + data.games.length + data.movies.length + data.tv.length + data.news.length,
      lastGenerated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sitemap stats',
      message: error.message
    });
  }
});

// 动态生成robots.txt
router.get('/robots.txt', (req, res) => {
  const siteUrl = process.env.SITE_URL || 'https://eastereggvault.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# 动态站点地图
Sitemap: ${siteUrl}/sitemap.xml

# 禁止访问管理后台
Disallow: /admin/
Disallow: /api/

# 禁止访问开发文件
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
`;

  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400' // 缓存24小时
  });
  
  res.send(robotsTxt);
});

export default router;
