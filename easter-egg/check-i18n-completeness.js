import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supportedLanguages = ['en', 'ru', 'es', 'fr', 'de', 'ja', 'ko']

console.log('🔍 检查多语言翻译和数据完整性...\n')

// 1. 检查 UI 翻译文件
console.log('📝 UI 翻译文件检查:')
console.log('='.repeat(60))

const issues = []

for (const lang of supportedLanguages) {
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', `${lang}.js`)
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n').length
    const size = fs.statSync(filePath).size
    
    // 检查文件是否太小（可能是空文件）
    if (size < 1000) {
      console.log(`  ⚠️  ${lang}.js - ${lines} 行, ${(size/1024).toFixed(2)}KB (可能不完整)`)
      issues.push(`UI翻译 ${lang}: 文件太小，可能缺少内容`)
    } else {
      console.log(`  ✅ ${lang}.js - ${lines} 行, ${(size/1024).toFixed(2)}KB`)
    }
    
    // 检查关键字段
    const hasNav = content.includes('nav:')
    const hasFooter = content.includes('footer:')
    const hasCommon = content.includes('common:')
    const hasHomePage = content.includes('HomePage:')
    
    if (!hasNav || !hasFooter || !hasCommon || !hasHomePage) {
      issues.push(`UI翻译 ${lang}: 缺少关键部分 - nav:${hasNav}, footer:${hasFooter}, common:${hasCommon}, HomePage:${hasHomePage}`)
    }
    
  } catch (error) {
    console.log(`  ❌ ${lang}.js - 文件不存在或无法读取`)
    issues.push(`UI翻译 ${lang}: 文件缺失`)
  }
}

// 2. 检查 SEO 翻译
console.log('\n📊 SEO 翻译检查:')
console.log('='.repeat(60))

const seoPath = path.join(__dirname, 'src', 'i18n', 'seo.js')
try {
  const seoContent = fs.readFileSync(seoPath, 'utf-8')
  
  for (const lang of supportedLanguages) {
    const hasLangSection = seoContent.includes(`${lang}: {`)
    const hasHome = seoContent.includes(`home:`) && seoContent.indexOf(`${lang}: {`) < seoContent.indexOf('home:')
    
    if (!hasLangSection) {
      console.log(`  ❌ ${lang} - SEO 翻译缺失`)
      issues.push(`SEO翻译 ${lang}: 完全缺失`)
    } else {
      console.log(`  ✅ ${lang} - SEO 翻译存在`)
    }
  }
} catch (error) {
  console.log('  ❌ seo.js 文件不存在')
  issues.push('SEO翻译: seo.js 文件缺失')
}

// 3. 检查数据文件
console.log('\n📁 数据文件检查:')
console.log('='.repeat(60))

const dataTypes = ['games', 'movies', 'tv', 'news']
const dataStats = {}

for (const lang of supportedLanguages) {
  dataStats[lang] = { total: 0, files: {} }
  
  console.log(`\n  ${lang.toUpperCase()}:`)
  
  for (const type of dataTypes) {
    const filePath = path.join(__dirname, 'src', 'data', lang, `${type}.js`)
    
    try {
      const module = await import(`./src/data/${lang}/${type}.js`)
      const data = module[`${type}Data`] || []
      const classifications = module.classifications || []
      
      dataStats[lang].files[type] = data.length
      dataStats[lang].total += data.length
      
      if (data.length === 0) {
        console.log(`    ⏳ ${type}.js - 0 条数据`)
      } else {
        console.log(`    ✅ ${type}.js - ${data.length} 条数据, ${classifications.length} 个分类`)
        
        // 检查数据完整性
        for (let i = 0; i < Math.min(data.length, 3); i++) {
          const item = data[i]
          if (!item.title || !item.addressBar || !item.description) {
            issues.push(`数据 ${lang}/${type}: 第${i+1}条数据缺少必需字段`)
          }
        }
      }
    } catch (error) {
      console.log(`    ❌ ${type}.js - 加载失败: ${error.message}`)
      issues.push(`数据 ${lang}/${type}: 文件无法加载`)
    }
  }
}

// 4. 生成总结
console.log('\n\n📈 数据统计总结:')
console.log('='.repeat(60))
console.log('语言    | Games | Movies | TV | News | 总计 | 状态')
console.log('-'.repeat(60))

for (const lang of supportedLanguages) {
  const stats = dataStats[lang]
  const status = stats.total === 0 ? '⏳ 仅UI' : stats.total >= 20 ? '✅ 完整' : '⚠️  部分'
  
  console.log(
    `${lang.padEnd(7)} | ${(stats.files.games || 0).toString().padEnd(5)} | ` +
    `${(stats.files.movies || 0).toString().padEnd(6)} | ` +
    `${(stats.files.tv || 0).toString().padEnd(2)} | ` +
    `${(stats.files.news || 0).toString().padEnd(4)} | ` +
    `${stats.total.toString().padEnd(4)} | ${status}`
  )
}

// 5. 检查路由配置
console.log('\n\n🛣️  路由配置检查:')
console.log('='.repeat(60))

try {
  const routerPath = path.join(__dirname, 'src', 'router', 'index.js')
  const routerContent = fs.readFileSync(routerPath, 'utf-8')
  
  const hasSupportedLanguages = routerContent.includes('supportedLanguages')
  const hasGenerateRoutes = routerContent.includes('generateRoutes')
  const hasDetectLanguage = routerContent.includes('detectLanguageFromPath')
  
  console.log(`  ${hasSupportedLanguages ? '✅' : '❌'} supportedLanguages 定义`)
  console.log(`  ${hasGenerateRoutes ? '✅' : '❌'} generateRoutes 函数`)
  console.log(`  ${hasDetectLanguage ? '✅' : '❌'} detectLanguageFromPath 函数`)
  
  if (!hasSupportedLanguages || !hasGenerateRoutes || !hasDetectLanguage) {
    issues.push('路由配置: 缺少必要的多语言路由函数')
  }
} catch (error) {
  console.log('  ❌ 无法读取路由配置')
  issues.push('路由配置: 文件读取失败')
}

// 6. 输出问题报告
console.log('\n\n⚠️  问题报告:')
console.log('='.repeat(60))

if (issues.length === 0) {
  console.log('  ✅ 未发现问题！所有翻译和数据文件完整。')
} else {
  console.log(`  发现 ${issues.length} 个问题:\n`)
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`)
  })
}

// 7. 建议
console.log('\n\n💡 建议:')
console.log('='.repeat(60))

const emptyLangs = Object.keys(dataStats).filter(lang => dataStats[lang].total === 0)
const partialLangs = Object.keys(dataStats).filter(lang => dataStats[lang].total > 0 && dataStats[lang].total < 20)

if (emptyLangs.length > 0) {
  console.log(`  📝 需要添加数据的语言: ${emptyLangs.join(', ')}`)
}

if (partialLangs.length > 0) {
  console.log(`  ⚠️  数据不完整的语言: ${partialLangs.join(', ')}`)
}

console.log('\n✅ 检查完成！\n')

