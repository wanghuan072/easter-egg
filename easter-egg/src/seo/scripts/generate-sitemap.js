/**
 * 站点地图生成脚本
 * 从API获取数据并生成sitemap.xml
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const SITE_URL = 'https://eastereggvault.com'
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'
const OUTPUT_PATH = path.join(__dirname, '../../../public/sitemap.xml')

// 静态页面配置
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/games', priority: '0.9', changefreq: 'daily' },
  { url: '/movies', priority: '0.9', changefreq: 'daily' },
  { url: '/tv', priority: '0.9', changefreq: 'daily' },
  { url: '/news', priority: '0.8', changefreq: 'daily' },
  { url: '/search', priority: '0.7', changefreq: 'weekly' },
  { url: '/popular', priority: '0.8', changefreq: 'weekly' },
  { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { url: '/terms', priority: '0.3', changefreq: 'monthly' },
  { url: '/copyright', priority: '0.3', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.4', changefreq: 'monthly' }
]

/**
 * 从API获取数据
 */
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message)
    return []
  }
}

/**
 * 格式化日期为ISO格式
 */
function formatDate(date) {
  if (!date) return new Date().toISOString()
  
  // 如果已经是ISO格式，直接返回
  if (date.includes('T') && date.includes('Z')) {
    return date
  }
  
  // 否则转换为ISO格式
  return new Date(date).toISOString()
}

/**
 * 生成站点地图XML
 */
function generateSitemap(staticPages, dynamicPages) {
  const now = new Date().toISOString()
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // 添加静态页面
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  })

  // 添加动态页面
  dynamicPages.forEach(page => {
    const lastmod = formatDate(page.publish_date || page.publishDate)
    sitemap += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })

  sitemap += `
</urlset>`

  return sitemap
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始生成站点地图...')
  
  try {
    // 获取动态页面数据
    const [games, movies, tv, news] = await Promise.all([
      fetchData('/api/games'),
      fetchData('/api/movies'),
      fetchData('/api/tv'),
      fetchData('/api/news')
    ])

    // 构建动态页面URL列表
    const dynamicPages = []
    
    // 添加游戏页面
    if (Array.isArray(games)) {
      games.forEach(game => {
        if (game.addressBar || game.address_bar) {
          dynamicPages.push({
            url: `/games/${game.addressBar || game.address_bar}`,
            publish_date: game.publish_date || game.publishDate
          })
        }
      })
    }

    // 添加电影页面
    if (Array.isArray(movies)) {
      movies.forEach(movie => {
        if (movie.addressBar || movie.address_bar) {
          dynamicPages.push({
            url: `/movies/${movie.addressBar || movie.address_bar}`,
            publish_date: movie.publish_date || movie.publishDate
          })
        }
      })
    }

    // 添加电视剧页面
    if (Array.isArray(tv)) {
      tv.forEach(show => {
        if (show.addressBar || show.address_bar) {
          dynamicPages.push({
            url: `/tv/${show.addressBar || show.address_bar}`,
            publish_date: show.publish_date || show.publishDate
          })
        }
      })
    }

    // 添加新闻页面
    if (Array.isArray(news)) {
      news.forEach(article => {
        if (article.addressBar || article.address_bar) {
          dynamicPages.push({
            url: `/news/${article.addressBar || article.address_bar}`,
            publish_date: article.publish_date || article.publishDate
          })
        }
      })
    }

    // 生成站点地图
    const sitemap = generateSitemap(STATIC_PAGES, dynamicPages)

    // 写入文件
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8')
    
    console.log(`✅ 站点地图生成成功！`)
    console.log(`📄 静态页面: ${STATIC_PAGES.length} 个`)
    console.log(`📄 动态页面: ${dynamicPages.length} 个`)
    console.log(`📁 输出路径: ${OUTPUT_PATH}`)
    
  } catch (error) {
    console.error('❌ 生成站点地图失败:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
