import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const DOMAIN = 'https://eastereggvault.com'
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml')
const supportedLanguages = ['en', 'ru', 'es', 'fr', 'de', 'ja', 'ko']

// 静态页面配置
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/games', priority: '0.9', changefreq: 'daily' },
  { path: '/movies', priority: '0.9', changefreq: 'daily' },
  { path: '/tv', priority: '0.9', changefreq: 'daily' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  { path: '/search', priority: '0.7', changefreq: 'weekly' },
  { path: '/popular', priority: '0.8', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
  { path: '/copyright', priority: '0.3', changefreq: 'monthly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' }
]

// 读取数据文件
async function loadDataForLocale(locale) {
  try {
    const dataPath = path.join(__dirname, 'src', 'data', locale)
    
    // 动态导入数据文件
    const gamesModule = await import(`./src/data/${locale}/games.js`)
    const moviesModule = await import(`./src/data/${locale}/movies.js`)
    const tvModule = await import(`./src/data/${locale}/tv.js`)
    const newsModule = await import(`./src/data/${locale}/news.js`)
    
    return {
      games: gamesModule.gamesData || [],
      movies: moviesModule.moviesData || [],
      tv: tvModule.tvData || [],
      news: newsModule.newsData || []
    }
  } catch (error) {
    console.warn(`Failed to load data for locale ${locale}:`, error.message)
    return {
      games: [],
      movies: [],
      tv: [],
      news: []
    }
  }
}

// 检查语言是否有数据
function hasData(data) {
  return data.games.length > 0 || 
         data.movies.length > 0 || 
         data.tv.length > 0 || 
         data.news.length > 0
}

// 获取本地化路径
function getLocalizedPath(basePath, locale) {
  if (locale === 'en') {
    return basePath
  }
  return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`
}

// 生成URL条目
function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${DOMAIN}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

// 主函数
async function generateSitemap() {
  console.log('🌍 开始生成多语言站点地图...\n')
  
  const urls = []
  const now = new Date().toISOString()
  
  // 1. 为每种语言加载数据
  console.log('📊 检查各语言数据...')
  const languageData = {}
  for (const locale of supportedLanguages) {
    const data = await loadDataForLocale(locale)
    languageData[locale] = data
    const hasContent = hasData(data)
    console.log(`  ${locale}: ${hasContent ? '✅ 有数据' : '⏳ 仅UI'} (Games: ${data.games.length}, Movies: ${data.movies.length}, TV: ${data.tv.length}, News: ${data.news.length})`)
  }
  
  console.log('\n📄 生成静态页面 URL...')
  // 2. 生成静态页面URL（所有语言都有UI翻译）
  for (const locale of supportedLanguages) {
    for (const page of staticPages) {
      const localizedPath = getLocalizedPath(page.path, locale)
      urls.push(generateUrlEntry(
        localizedPath,
        now,
        page.changefreq,
        page.priority
      ))
    }
  }
  console.log(`  ✅ 生成 ${staticPages.length * supportedLanguages.length} 个静态页面 URL`)
  
  console.log('\n📝 生成动态内容 URL...')
  // 3. 生成动态内容URL（只为有数据的语言）
  let dynamicUrlCount = 0
  
  for (const locale of supportedLanguages) {
    const data = languageData[locale]
    
    // Games
    if (data.games.length > 0) {
      for (const game of data.games) {
        const localizedPath = getLocalizedPath(`/games/${game.addressBar}`, locale)
        urls.push(generateUrlEntry(
          localizedPath,
          game.publishDate || now,
          'weekly',
          '0.8'
        ))
        dynamicUrlCount++
      }
    }
    
    // Movies
    if (data.movies.length > 0) {
      for (const movie of data.movies) {
        const localizedPath = getLocalizedPath(`/movies/${movie.addressBar}`, locale)
        urls.push(generateUrlEntry(
          localizedPath,
          movie.publishDate || now,
          'weekly',
          '0.8'
        ))
        dynamicUrlCount++
      }
    }
    
    // TV
    if (data.tv.length > 0) {
      for (const show of data.tv) {
        const localizedPath = getLocalizedPath(`/tv/${show.addressBar}`, locale)
        urls.push(generateUrlEntry(
          localizedPath,
          show.publishDate || now,
          'weekly',
          '0.8'
        ))
        dynamicUrlCount++
      }
    }
    
    // News
    if (data.news.length > 0) {
      for (const item of data.news) {
        const localizedPath = getLocalizedPath(`/news/${item.addressBar}`, locale)
        urls.push(generateUrlEntry(
          localizedPath,
          item.publishDate || now,
          'weekly',
          '0.7'
        ))
        dynamicUrlCount++
      }
    }
  }
  console.log(`  ✅ 生成 ${dynamicUrlCount} 个动态内容 URL`)
  
  // 4. 生成XML
  console.log('\n📦 生成 sitemap.xml...')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  
  // 5. 写入文件
  fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8')
  
  console.log(`\n✅ 站点地图生成完成！`)
  console.log(`📍 位置: ${OUTPUT_FILE}`)
  console.log(`📊 总计: ${urls.length} 个 URL`)
  console.log(`   - 静态页面: ${staticPages.length * supportedLanguages.length}`)
  console.log(`   - 动态内容: ${dynamicUrlCount}`)
  
  // 6. 生成统计信息
  console.log('\n📈 各语言统计:')
  for (const locale of supportedLanguages) {
    const data = languageData[locale]
    const total = data.games.length + data.movies.length + data.tv.length + data.news.length
    const staticCount = staticPages.length
    const totalUrls = staticCount + total
    console.log(`  ${locale}: ${totalUrls} URLs (${staticCount} 静态 + ${total} 动态)`)
  }
  
  console.log('\n🎉 完成！')
}

// 运行
generateSitemap().catch(error => {
  console.error('❌ 错误:', error)
  process.exit(1)
})

