#!/usr/bin/env node
/**
 * 测试站点地图API端点
 */

async function testSitemapAPI() {
  console.log('🧪 测试站点地图API端点...')
  
  try {
    // 测试健康检查
    console.log('\n1️⃣ 测试API健康检查...')
    const healthResponse = await fetch('http://localhost:3000/health')
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ API服务器运行正常:', healthData.status)
    } else {
      console.log('❌ API服务器健康检查失败')
      return
    }
    
    // 测试站点地图更新端点
    console.log('\n2️⃣ 测试站点地图更新端点...')
    const updateResponse = await fetch('http://localhost:3000/api/sitemap/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (updateResponse.ok) {
      const updateData = await updateResponse.json()
      console.log('✅ 站点地图更新成功:')
      console.log(`   - 总URL数: ${updateData.totalRoutes}`)
      console.log(`   - 动态URL数: ${updateData.dynamicRoutes}`)
      console.log(`   - 静态URL数: ${updateData.staticRoutes}`)
    } else {
      const errorText = await updateResponse.text()
      console.log('❌ 站点地图更新失败:', updateResponse.status, errorText)
    }
    
    // 测试动态站点地图端点
    console.log('\n3️⃣ 测试动态站点地图端点...')
    const sitemapResponse = await fetch('http://localhost:3000/api/sitemap')
    if (sitemapResponse.ok) {
      const sitemapContent = await sitemapResponse.text()
      const urlCount = (sitemapContent.match(/<url>/g) || []).length
      console.log(`✅ 动态站点地图正常，包含 ${urlCount} 个URL`)
    } else {
      console.log('❌ 动态站点地图端点失败:', sitemapResponse.status)
    }
    
    console.log('\n🎉 测试完成！')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error.message)
  }
}

// 运行测试
testSitemapAPI().catch(console.error)
