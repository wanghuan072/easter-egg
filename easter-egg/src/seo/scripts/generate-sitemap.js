import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// API配置
const API_BASE_URL = process.env.VITE_API_URL || (process.env.NODE_ENV === 'production' ? 'https://easter-egg-api.vercel.app' : 'http://localhost:3000')
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
    const url = `${API_BASE_URL}/api/${endpoint}`
    console.log(`🔗 请求URL: ${url}`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'EasterEggVault-SitemapGenerator/1.0'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const result = data.data || data
    
    console.log(`📊 ${endpoint} 数据: ${Array.isArray(result) ? result.length : 'N/A'} 条记录`)
    return result
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`⚠️  Warning: Request timeout for ${endpoint}`)
    } else {
      console.warn(`⚠️  Warning: Failed to fetch ${endpoint}:`, error.message)
    }
    console.warn(`   API服务器: ${API_BASE_URL}`)
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
  console.log(`🔗 API基础URL: ${API_BASE_URL}`)
  
  // 检查API服务器是否可用
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const testResponse = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (testResponse.ok) {
      console.log('✅ API服务器连接正常')
    } else {
      throw new Error(`Health check failed: ${testResponse.status}`)
    }
  } catch (error) {
    console.warn('⚠️  API服务器连接失败，将只生成静态路由')
    console.warn(`   错误: ${error.message}`)
    console.warn(`   API服务器: ${API_BASE_URL}`)
    console.warn(`   请确保API服务器正在运行`)
  }
  
  const routes = [...staticRoutes]
  let totalDynamicRoutes = 0
  
  try {
    // 获取游戏数据
    console.log('\n📡 获取游戏数据...')
    const games = await fetchApiData('games')
    if (games && games.length > 0) {
      const gamesWithAddress = games.filter(game => game.addressBar)
      gamesWithAddress.forEach(game => {
        routes.push({
          path: `/games/${game.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: game.updatedAt || game.publishDate || new Date().toISOString()
        })
      })
      console.log(`✅ 添加了 ${gamesWithAddress.length} 个游戏页面`)
      totalDynamicRoutes += gamesWithAddress.length
    }
    
    // 获取电影数据
    console.log('\n📡 获取电影数据...')
    const movies = await fetchApiData('movies')
    if (movies && movies.length > 0) {
      const moviesWithAddress = movies.filter(movie => movie.addressBar)
      moviesWithAddress.forEach(movie => {
        routes.push({
          path: `/movies/${movie.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: movie.updatedAt || movie.publishDate || new Date().toISOString()
        })
      })
      console.log(`✅ 添加了 ${moviesWithAddress.length} 个电影页面`)
      totalDynamicRoutes += moviesWithAddress.length
    }
    
    // 获取电视节目数据
    console.log('\n📡 获取电视节目数据...')
    const tvShows = await fetchApiData('tv')
    if (tvShows && tvShows.length > 0) {
      const tvWithAddress = tvShows.filter(tv => tv.addressBar)
      tvWithAddress.forEach(tv => {
        routes.push({
          path: `/tv/${tv.addressBar}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: tv.updatedAt || tv.publishDate || new Date().toISOString()
        })
      })
      console.log(`✅ 添加了 ${tvWithAddress.length} 个电视节目页面`)
      totalDynamicRoutes += tvWithAddress.length
    }
    
    // 获取新闻数据
    console.log('\n📡 获取新闻数据...')
    const news = await fetchApiData('news')
    if (news && news.length > 0) {
      const newsWithAddress = news.filter(item => item.addressBar)
      newsWithAddress.forEach(item => {
        routes.push({
          path: `/news/${item.addressBar}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: item.updatedAt || item.publishDate || new Date().toISOString()
        })
      })
      console.log(`✅ 添加了 ${newsWithAddress.length} 个新闻页面`)
      totalDynamicRoutes += newsWithAddress.length
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
  
  console.log(`\n✅ 站点地图生成完成！`)
  console.log(`📊 总路由数: ${routes.length}`)
  console.log(`📁 输出路径: ${distPath}`)
  console.log(`📁 公共路径: ${publicPath}`)
  
  // 输出统计信息
  const staticCount = staticRoutes.length
  console.log(`\n📈 统计信息:`)
  console.log(`   - 静态路由: ${staticCount}`)
  console.log(`   - 动态路由: ${totalDynamicRoutes}`)
  console.log(`   - 总路由数: ${routes.length}`)
  
  // 显示一些动态路由示例
  if (totalDynamicRoutes > 0) {
    console.log(`\n🔗 动态路由示例:`)
    const dynamicRoutes = routes.slice(staticCount, staticCount + 5)
    dynamicRoutes.forEach(route => {
      console.log(`   - ${route.path}`)
    })
    if (totalDynamicRoutes > 5) {
      console.log(`   - ... 还有 ${totalDynamicRoutes - 5} 个路由`)
    }
  }
}

// 运行生成器
generateSitemap().catch(console.error)
