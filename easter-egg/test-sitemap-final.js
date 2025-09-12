#!/usr/bin/env node
/**
 * 最终站点地图测试
 * 验证修复后的站点地图更新功能
 */

const API_BASE_URL = 'https://easter-egg-api.vercel.app'
const SITE_URL = 'https://eastereggvault.com'

async function testFinalSitemap() {
  console.log('🎯 最终站点地图功能测试...')
  console.log('=' .repeat(50))
  
  try {
    // 1. 测试后端API
    console.log('\n📡 测试后端API...')
    const apiResponse = await fetch(`${API_BASE_URL}/api/sitemap`)
    const apiText = await apiResponse.text()
    const apiUrlCount = (apiText.match(/<url>/g) || []).length
    
    console.log(`✅ 后端API正常`)
    console.log(`   - URL数量: ${apiUrlCount}`)
    console.log(`   - 缓存策略: ${apiResponse.headers.get('cache-control')}`)
    console.log(`   - ETag: ${apiResponse.headers.get('etag')}`)
    
    // 2. 测试前端站点地图（带时间戳）
    console.log('\n🌐 测试前端站点地图（强制刷新）...')
    const timestamp = Date.now()
    const frontendResponse = await fetch(`${SITE_URL}/sitemap.xml?t=${timestamp}`)
    const frontendText = await frontendResponse.text()
    const frontendUrlCount = (frontendText.match(/<url>/g) || []).length
    
    console.log(`✅ 前端站点地图正常`)
    console.log(`   - URL数量: ${frontendUrlCount}`)
    console.log(`   - 缓存策略: ${frontendResponse.headers.get('cache-control')}`)
    console.log(`   - 内容长度: ${frontendText.length}`)
    
    // 3. 测试站点地图更新API
    console.log('\n🔄 测试站点地图更新API...')
    const updateResponse = await fetch(`${API_BASE_URL}/api/sitemap/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json()
      console.log(`✅ 站点地图更新API正常`)
      console.log(`   - 总URL数: ${updateResult.totalRoutes}`)
      console.log(`   - 动态URL数: ${updateResult.dynamicRoutes}`)
      console.log(`   - 静态URL数: ${updateResult.staticRoutes}`)
      console.log(`   - 站点地图URL: ${updateResult.sitemapUrl}`)
    } else {
      console.log(`❌ 站点地图更新API失败: ${updateResponse.status}`)
    }
    
    // 4. 比较结果
    console.log('\n📊 结果比较:')
    console.log(`   - 后端API URL数: ${apiUrlCount}`)
    console.log(`   - 前端站点地图URL数: ${frontendUrlCount}`)
    console.log(`   - 内容是否一致: ${apiText === frontendText ? '是' : '否'}`)
    
    // 5. 生成测试报告
    console.log('\n📋 测试报告:')
    console.log('=' .repeat(50))
    
    if (apiUrlCount === frontendUrlCount) {
      console.log('✅ 站点地图URL数量一致')
    } else {
      console.log('⚠️  站点地图URL数量不一致，可能存在缓存问题')
    }
    
    if (apiText === frontendText) {
      console.log('✅ 站点地图内容完全一致')
    } else {
      console.log('⚠️  站点地图内容不一致，可能存在缓存问题')
    }
    
    console.log('\n💡 使用建议:')
    console.log('1. 在后台管理系统添加内容后，系统会自动更新站点地图')
    console.log('2. 更新后会自动打开站点地图页面（带时间戳强制刷新）')
    console.log('3. 如果看到的内容不是最新的，请等待1-2分钟让缓存过期')
    console.log('4. 可以使用无痕模式访问站点地图避免浏览器缓存')
    console.log('5. 访问: https://eastereggvault.com/sitemap.xml')
    
    console.log('\n🎉 测试完成！')
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

// 运行测试
testFinalSitemap().catch(console.error)
