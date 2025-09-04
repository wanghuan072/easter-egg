import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// API配置
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'
const SITE_URL = 'https://eastereggvault.com'

// 静态路由配置（与路由文件中的meta信息对应）
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
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/admin/login', priority: 0.1, changefreq: 'monthly' },
  { path: '/admin/dashboard', priority: 0.1, changefreq: 'monthly' }
]

// 获取API数据的函数
async function fetchApiData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.warn(`Warning: Failed to fetch ${endpoint}:`, error.message)
    return []
  }
}

// 生成站点地图XML
function generateSitemapXML(routes) {
  const now = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  routes.forEach(route => {
    xml += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
  })

  xml += '</urlset>'
  return xml
}

// 主函数
async function generateSitemap() {
  console.log('🚀 开始生成动态站点地图...')
  
  const routes = [...staticRoutes]
  
  try {
    // 获取游戏数据
    console.log('📡 获取游戏数据...')
    const games = await fetchApiData('games')
    if (games && games.length > 0) {
      games.forEach(game => {
        if (game.addressBar) {
          routes.push({
            path: `/games/${game.addressBar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: game.updatedAt || game.publishDate || new Date().toISOString()
          })
        }
      })
      console.log(`✅ 添加了 ${games.length} 个游戏页面`)
    }
    
    // 获取电影数据
    console.log('📡 获取电影数据...')
    const movies = await fetchApiData('movies')
    if (movies && movies.length > 0) {
      movies.forEach(movie => {
        if (movie.addressBar) {
          routes.push({
            path: `/movies/${movie.addressBar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: movie.updatedAt || movie.publishDate || new Date().toISOString()
          })
        }
      })
      console.log(`✅ 添加了 ${movies.length} 个电影页面`)
    }
    
    // 获取电视节目数据
    console.log('📡 获取电视节目数据...')
    const tvShows = await fetchApiData('tv')
    if (tvShows && tvShows.length > 0) {
      tvShows.forEach(tv => {
        if (tv.addressBar) {
          routes.push({
            path: `/tv/${tv.addressBar}`,
            priority: 0.8,
            changefreq: 'weekly',
            lastmod: tv.updatedAt || tv.publishDate || new Date().toISOString()
          })
        }
      })
      console.log(`✅ 添加了 ${tvShows.length} 个电视节目页面`)
    }
    
    // 获取新闻数据
    console.log('📡 获取新闻数据...')
    const news = await fetchApiData('news')
    if (news && news.length > 0) {
      news.forEach(item => {
        if (item.addressBar) {
          routes.push({
            path: `/news/${item.addressBar}`,
            priority: 0.7,
            changefreq: 'weekly',
            lastmod: item.updatedAt || item.publishDate || new Date().toISOString()
          })
        }
      })
      console.log(`✅ 添加了 ${news.length} 个新闻页面`)
    }
    
  } catch (error) {
    console.error('❌ 获取API数据时出错:', error)
  }
  
  // 生成XML
  const sitemapXML = generateSitemapXML(routes)
  
  // 写入文件到dist和public目录
  const distPath = path.join(__dirname, '../../../dist/sitemap.xml')
  const publicPath = path.join(__dirname, '../../../public/sitemap.xml')
  
  fs.writeFileSync(distPath, sitemapXML, 'utf8')
  fs.writeFileSync(publicPath, sitemapXML, 'utf8')
  
  console.log(`✅ 站点地图生成完成！`)
  console.log(`📊 总路由数: ${routes.length}`)
  console.log(`📁 输出路径: ${distPath}`)
  console.log(`📁 公共路径: ${publicPath}`)
  
  // 输出统计信息
  const staticCount = staticRoutes.length
  const dynamicCount = routes.length - staticCount
  console.log(`📈 静态路由: ${staticCount}`)
  console.log(`📈 动态路由: ${dynamicCount}`)
}

// 运行生成器
generateSitemap().catch(console.error)
