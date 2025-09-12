#!/usr/bin/env node
/**
 * 测试线上站点地图
 */

async function testOnlineSitemap() {
  console.log('🌐 测试线上站点地图...')
  
  try {
    // 测试线上站点地图
    console.log('\n1️⃣ 测试 https://eastereggvault.com/sitemap.xml...')
    const sitemapResponse = await fetch('https://eastereggvault.com/sitemap.xml', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (sitemapResponse.ok) {
      const sitemapContent = await sitemapResponse.text()
      const urlCount = (sitemapContent.match(/<url>/g) || []).length
      const gameCount = (sitemapContent.match(/\/games\//g) || []).length
      const movieCount = (sitemapContent.match(/\/movies\//g) || []).length
      const tvCount = (sitemapContent.match(/\/tv\//g) || []).length
      const newsCount = (sitemapContent.match(/\/news\//g) || []).length
      
      console.log('✅ 线上站点地图正常:')
      console.log(`   - 总URL数: ${urlCount}`)
      console.log(`   - 游戏页面: ${gameCount}`)
      console.log(`   - 电影页面: ${movieCount}`)
      console.log(`   - 电视剧页面: ${tvCount}`)
      console.log(`   - 新闻页面: ${newsCount}`)
      
      // 检查最后修改时间
      const lastModified = sitemapResponse.headers.get('last-modified')
      const cacheControl = sitemapResponse.headers.get('cache-control')
      console.log(`   - 最后修改: ${lastModified}`)
      console.log(`   - 缓存控制: ${cacheControl}`)
      
      // 显示一些动态URL示例
      const dynamicUrls = sitemapContent.match(/<loc>https:\/\/eastereggvault\.com\/(games|movies|tv|news)\/[^<]+<\/loc>/g) || []
      if (dynamicUrls.length > 0) {
        console.log('\n🔗 动态URL示例:')
        dynamicUrls.slice(0, 5).forEach(url => {
          console.log(`   - ${url.replace(/<[^>]*>/g, '')}`)
        })
        if (dynamicUrls.length > 5) {
          console.log(`   - ... 还有 ${dynamicUrls.length - 5} 个动态URL`)
        }
      }
      
    } else {
      console.log('❌ 线上站点地图访问失败:', sitemapResponse.status)
      const errorText = await sitemapResponse.text()
      console.log('   错误内容:', errorText)
    }
    
    // 测试API端点
    console.log('\n2️⃣ 测试API端点 https://easter-egg-api.vercel.app/api/sitemap...')
    const apiResponse = await fetch('https://easter-egg-api.vercel.app/api/sitemap', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (apiResponse.ok) {
      const apiContent = await apiResponse.text()
      const apiUrlCount = (apiContent.match(/<url>/g) || []).length
      console.log(`✅ API端点正常，包含 ${apiUrlCount} 个URL`)
    } else {
      console.log('❌ API端点访问失败:', apiResponse.status)
    }
    
    console.log('\n🎉 测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error.message)
  }
}

// 运行测试
testOnlineSitemap().catch(console.error)
