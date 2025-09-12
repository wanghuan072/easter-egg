/**
 * 站点地图更新脚本
 * 用于在开发过程中快速更新站点地图
 */

import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔄 更新站点地图...')

try {
  // 运行生成脚本
  execSync('node src/seo/scripts/generate-sitemap.js', {
    cwd: path.join(__dirname, '../../..'),
    stdio: 'inherit'
  })
  
  console.log('✅ 站点地图更新完成！')
} catch (error) {
  console.error('❌ 更新站点地图失败:', error.message)
  process.exit(1)
}
