#!/usr/bin/env node
/**
 * 动态更新站点地图脚本
 * 用于在后台管理添加新内容后更新站点地图
 * 可以通过API调用或定时任务触发
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// API配置
const API_BASE_URL = process.env.VITE_API_URL || (process.env.NODE_ENV === 'production' ? 'https://easter-egg-api.vercel.app' : 'http://localhost:3000')
const SITE_URL = 'https://eastereggvault.com'

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
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/admin/login', priority: 0.1, changefreq: 'monthly' },
  { path: '/admin/dashboard', priority: 0.1, changefreq: 'monthly' }
]

// 获取API数据的函数
async function fetchApiData(endpoint) {
  try {
    const url = `${API_BASE_URL}/api/${endpoint}`
    console.log(`🔗 请求URL: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'EasterEggVault-SitemapUpdater/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.warn(`⚠️  Warning: Failed to fetch ${endpoint}:`, error.message)
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
async function updateSitemap() {
  console.log('🚀 开始更新动态站点地图...')
  console.log(`🔗 API基础URL: ${API_BASE_URL}`)
  
  const routes = [...staticRoutes]
  let totalDynamicRoutes = 0
  
  try {
    // 获取所有类型的数据
    const [games, movies, tvShows, news] = await Promise.all([
      fetchApiData('games?limit=1000'),
      fetchApiData('movies?limit=1000'),
      fetchApiData('tv?limit=1000'),
      fetchApiData('news?limit=1000')
    ])
    
    // 处理游戏数据
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
    
    // 处理电影数据
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
    
    // 处理电视节目数据
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
    
    // 处理新闻数据
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
  
  // 确保目录存在
  fs.mkdirSync(path.dirname(distPath), { recursive: true })
  fs.mkdirSync(path.dirname(publicPath), { recursive: true })
  
  fs.writeFileSync(distPath, sitemapXML, 'utf8')
  fs.writeFileSync(publicPath, sitemapXML, 'utf8')
  
  console.log(`\n✅ 站点地图更新完成！`)
  console.log(`📊 总路由数: ${routes.length}`)
  console.log(`📁 输出路径: ${distPath}`)
  console.log(`📁 公共路径: ${publicPath}`)
  
  // 输出统计信息
  const staticCount = staticRoutes.length
  console.log(`\n📈 统计信息:`)
  console.log(`   - 静态路由: ${staticCount}`)
  console.log(`   - 动态路由: ${totalDynamicRoutes}`)
  console.log(`   - 总路由数: ${routes.length}`)
  
  return {
    success: true,
    totalRoutes: routes.length,
    dynamicRoutes: totalDynamicRoutes,
    staticRoutes: staticCount
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitemap().catch(console.error)
}

export default updateSitemap
