#!/usr/bin/env node
/**
 * 测试站点地图缓存问题
 * 检查为什么缓存时间没有生效
 */

const API_BASE_URL = 'https://easter-egg-api.vercel.app'
const SITE_URL = 'https://eastereggvault.com'

async function testSitemapCache() {
  console.log('🧪 开始测试站点地图缓存问题...')
  
  try {
    // 1. 测试后端API的缓存头
    console.log('\n📡 测试后端API缓存头...')
    const apiResponse = await fetch(`${API_BASE_URL}/api/sitemap`)
    console.log('后端API响应头:')
    console.log(`   - Content-Type: ${apiResponse.headers.get('content-type')}`)
    console.log(`   - Cache-Control: ${apiResponse.headers.get('cache-control')}`)
    console.log(`   - Last-Modified: ${apiResponse.headers.get('last-modified')}`)
    console.log(`   - ETag: ${apiResponse.headers.get('etag')}`)
    console.log(`   - X-Sitemap-Generated: ${apiResponse.headers.get('x-sitemap-generated')}`)
    
    // 2. 测试前端站点地图的缓存头
    console.log('\n🌐 测试前端站点地图缓存头...')
    const frontendResponse = await fetch(`${SITE_URL}/sitemap.xml`)
    console.log('前端站点地图响应头:')
    console.log(`   - Content-Type: ${frontendResponse.headers.get('content-type')}`)
    console.log(`   - Cache-Control: ${frontendResponse.headers.get('cache-control')}`)
    console.log(`   - Last-Modified: ${frontendResponse.headers.get('last-modified')}`)
    console.log(`   - ETag: ${frontendResponse.headers.get('etag')}`)
    
    // 3. 比较两个响应是否相同
    const apiText = await apiResponse.text()
    const frontendText = await frontendResponse.text()
    
    console.log('\n📊 内容比较:')
    console.log(`   - 后端API内容长度: ${apiText.length}`)
    console.log(`   - 前端站点地图内容长度: ${frontendText.length}`)
    console.log(`   - 内容是否相同: ${apiText === frontendText ? '是' : '否'}`)
    
    // 4. 统计URL数量
    const apiUrlCount = (apiText.match(/<url>/g) || []).length
    const frontendUrlCount = (frontendText.match(/<url>/g) || []).length
    console.log(`   - 后端API URL数量: ${apiUrlCount}`)
    console.log(`   - 前端站点地图URL数量: ${frontendUrlCount}`)
    
    // 5. 检查是否有缓存问题
    console.log('\n🔍 缓存分析:')
    const apiCacheControl = apiResponse.headers.get('cache-control')
    const frontendCacheControl = frontendResponse.headers.get('cache-control')
    
    if (apiCacheControl && apiCacheControl.includes('max-age=60')) {
      console.log('✅ 后端API缓存设置正确 (60秒)')
    } else {
      console.log('❌ 后端API缓存设置异常:', apiCacheControl)
    }
    
    if (frontendCacheControl && frontendCacheControl.includes('max-age=60')) {
      console.log('✅ 前端站点地图缓存设置正确 (60秒)')
    } else {
      console.log('❌ 前端站点地图缓存设置异常:', frontendCacheControl)
    }
    
    // 6. 测试强制刷新
    console.log('\n🔄 测试强制刷新...')
    const timestamp = Date.now()
    const refreshResponse = await fetch(`${API_BASE_URL}/api/sitemap?t=${timestamp}`)
    const refreshETag = refreshResponse.headers.get('etag')
    const originalETag = apiResponse.headers.get('etag')
    
    console.log(`   - 原始ETag: ${originalETag}`)
    console.log(`   - 刷新后ETag: ${refreshETag}`)
    console.log(`   - ETag是否变化: ${originalETag !== refreshETag ? '是' : '否'}`)
    
    // 7. 建议解决方案
    console.log('\n💡 建议解决方案:')
    if (apiCacheControl && !apiCacheControl.includes('max-age=60')) {
      console.log('1. 检查后端API的缓存设置是否正确部署')
    }
    if (frontendCacheControl && !frontendCacheControl.includes('max-age=60')) {
      console.log('2. 检查Vercel配置是否正确部署')
    }
    if (apiUrlCount !== frontendUrlCount) {
      console.log('3. 检查前端重写规则是否正确工作')
    }
    console.log('4. 等待几分钟让CDN缓存过期')
    console.log('5. 使用无痕模式测试')
    console.log('6. 清除浏览器缓存')
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error.message)
  }
}

// 运行测试
testSitemapCache().catch(console.error)
