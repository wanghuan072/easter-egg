#!/usr/bin/env node
/**
 * 测试站点地图更新功能
 * 用于验证后台管理系统添加内容后站点地图是否正确更新
 */

const API_BASE_URL = process.env.VITE_API_URL || 'https://easter-egg-api.vercel.app'
const SITE_URL = 'https://eastereggvault.com'

async function testSitemapUpdate() {
  console.log('🧪 开始测试站点地图更新功能...')
  console.log(`🔗 API基础URL: ${API_BASE_URL}`)
  console.log(`🌐 网站URL: ${SITE_URL}`)
  
  try {
    // 1. 测试站点地图API端点
    console.log('\n📡 测试站点地图API端点...')
    const sitemapResponse = await fetch(`${API_BASE_URL}/api/sitemap`)
    
    if (sitemapResponse.ok) {
      const sitemapText = await sitemapResponse.text()
      console.log('✅ 站点地图API响应正常')
      console.log(`   - 响应大小: ${sitemapText.length} 字符`)
      console.log(`   - Content-Type: ${sitemapResponse.headers.get('content-type')}`)
      console.log(`   - Cache-Control: ${sitemapResponse.headers.get('cache-control')}`)
      
      // 统计URL数量
      const urlMatches = sitemapText.match(/<url>/g)
      const urlCount = urlMatches ? urlMatches.length : 0
      console.log(`   - 包含URL数量: ${urlCount}`)
    } else {
      console.error('❌ 站点地图API响应失败:', sitemapResponse.status)
      return
    }
    
    // 2. 测试站点地图更新端点
    console.log('\n🔄 测试站点地图更新端点...')
    const updateResponse = await fetch(`${API_BASE_URL}/api/sitemap/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json()
      console.log('✅ 站点地图更新端点响应正常')
      console.log(`   - 总URL数: ${updateResult.totalRoutes}`)
      console.log(`   - 动态URL数: ${updateResult.dynamicRoutes}`)
      console.log(`   - 静态URL数: ${updateResult.staticRoutes}`)
      console.log(`   - 站点地图URL: ${updateResult.sitemapUrl}`)
    } else {
      console.error('❌ 站点地图更新端点响应失败:', updateResponse.status)
      const errorText = await updateResponse.text()
      console.error('   错误详情:', errorText)
      return
    }
    
    // 3. 测试前端站点地图访问
    console.log('\n🌐 测试前端站点地图访问...')
    const frontendSitemapResponse = await fetch(`${SITE_URL}/sitemap.xml`)
    
    if (frontendSitemapResponse.ok) {
      const frontendSitemapText = await frontendSitemapResponse.text()
      console.log('✅ 前端站点地图访问正常')
      console.log(`   - 响应大小: ${frontendSitemapText.length} 字符`)
      console.log(`   - Content-Type: ${frontendSitemapResponse.headers.get('content-type')}`)
      console.log(`   - Cache-Control: ${frontendSitemapResponse.headers.get('cache-control')}`)
      
      // 统计URL数量
      const frontendUrlMatches = frontendSitemapText.match(/<url>/g)
      const frontendUrlCount = frontendUrlMatches ? frontendUrlMatches.length : 0
      console.log(`   - 包含URL数量: ${frontendUrlCount}`)
    } else {
      console.error('❌ 前端站点地图访问失败:', frontendSitemapResponse.status)
    }
    
    console.log('\n✅ 站点地图更新功能测试完成！')
    console.log('\n📋 使用说明:')
    console.log('1. 在后台管理系统添加新内容')
    console.log('2. 系统会自动调用站点地图更新API')
    console.log('3. 站点地图会在1分钟内更新（由于缓存策略）')
    console.log('4. 访问 https://eastereggvault.com/sitemap.xml 查看最新站点地图')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error.message)
  }
}

// 运行测试
testSitemapUpdate().catch(console.error)
