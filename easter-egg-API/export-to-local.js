import { query } from './config/database.js';
import { transformData } from './config/dataStructure.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导出数据到前端本地文件
async function exportDataToLocal() {
  console.log('🚀 开始导出数据库数据到本地文件...\n');

  try {
    // 1. 导出游戏数据
    console.log('📦 正在导出游戏数据...');
    const gamesResult = await query('SELECT * FROM egg_games ORDER BY publish_date DESC');
    const gamesData = gamesResult.rows.map(row => transformDbToLocal(row, 'games'));
    const gamesClassifications = await getClassifications('egg_games');
    
    // 2. 导出电影数据
    console.log('📦 正在导出电影数据...');
    const moviesResult = await query('SELECT * FROM egg_movies ORDER BY publish_date DESC');
    const moviesData = moviesResult.rows.map(row => transformDbToLocal(row, 'movies'));
    const moviesClassifications = await getClassifications('egg_movies');
    
    // 3. 导出电视数据
    console.log('📦 正在导出电视数据...');
    const tvResult = await query('SELECT * FROM egg_tv ORDER BY publish_date DESC');
    const tvData = tvResult.rows.map(row => transformDbToLocal(row, 'tv'));
    const tvClassifications = await getClassifications('egg_tv');
    
    // 4. 导出新闻数据
    console.log('📦 正在导出新闻数据...');
    const newsResult = await query('SELECT * FROM egg_news ORDER BY publish_date DESC');
    const newsData = newsResult.rows.map(row => transformDbToLocal(row, 'news'));
    const newsClassifications = await getClassifications('egg_news');
    
    // 5. 生成文件
    const frontendDataPath = path.join(__dirname, '../easter-egg/src/data');
    
    console.log('\n📝 正在生成文件...');
    
    // 生成 games.js
    generateDataFile(frontendDataPath, 'games.js', gamesData, gamesClassifications, '游戏');
    
    // 生成 movies.js
    generateDataFile(frontendDataPath, 'movies.js', moviesData, moviesClassifications, '电影');
    
    // 生成 tv.js
    generateDataFile(frontendDataPath, 'tv.js', tvData, tvClassifications, '电视剧');
    
    // 生成 news.js
    generateDataFile(frontendDataPath, 'news.js', newsData, newsClassifications, '新闻');
    
    console.log('\n✅ 数据导出成功！');
    console.log(`\n📊 统计信息:`);
    console.log(`   游戏: ${gamesData.length} 条`);
    console.log(`   电影: ${moviesData.length} 条`);
    console.log(`   电视: ${tvData.length} 条`);
    console.log(`   新闻: ${newsData.length} 条`);
    console.log(`   总计: ${gamesData.length + moviesData.length + tvData.length + newsData.length} 条`);
    
    console.log(`\n📁 文件位置: ${frontendDataPath}`);
    console.log('\n🎉 导出完成！现在可以使用本地数据了。');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 导出失败:', error);
    process.exit(1);
  }
}

// 从数据库格式转换为本地数据格式
function transformDbToLocal(dbRow, mediaType) {
  // 处理 label 字段导出为 tag - 数据库中是 label，本地使用 tag
  let tagArray = [];
  if (dbRow.label) {
    if (Array.isArray(dbRow.label)) {
      // 如果是数组，过滤空值
      tagArray = dbRow.label.filter(t => t && t.trim && t.trim() !== '');
    } else if (typeof dbRow.label === 'string') {
      // 如果是字符串，转为数组
      tagArray = [dbRow.label];
    }
  }
  
  // 基础数据（所有类型通用）
  const baseData = {
    id: dbRow.id,
    title: dbRow.title,
    addressBar: dbRow.address_bar,
    publishDate: dbRow.publish_date,
    description: dbRow.description,
    imageUrl: dbRow.image_url,
    imageAlt: dbRow.image_alt,
    seo: {
      title: dbRow.seo_title || dbRow.title,
      description: dbRow.seo_description || dbRow.description,
      keywords: dbRow.seo_keywords || ''
    },
    classify: Array.isArray(dbRow.classify) ? dbRow.classify.filter(c => c && c.trim()) : [],
    tag: tagArray.filter(t => t && t.trim()),
    detailsHtml: dbRow.details_html || ''
  };
  
  // 新闻类型不包含 iframeUrl, isHome, isLatest
  if (mediaType === 'news') {
    return baseData;
  }
  
  // 其他类型包含完整字段
  return {
    ...baseData,
    iframeUrl: dbRow.iframe_url || '',
    isHome: dbRow.is_home || false,
    isLatest: dbRow.is_latest || false
  };
}

// 获取所有分类
async function getClassifications(tableName) {
  const result = await query(`SELECT DISTINCT UNNEST(classify) AS classification FROM ${tableName}`);
  const uniqueClassifications = [...new Set(result.rows.map(row => row.classification))].filter(c => c && c.trim());
  
  // 转换为对象格式
  return uniqueClassifications.sort().map(name => ({
    name: name,
    display_name: name
  }));
}

// 生成数据文件
function generateDataFile(dirPath, fileName, data, classifications, typeName) {
  const fileContent = `// ${typeName}分类列表
export const classifications = ${JSON.stringify(classifications, null, 2)}

// ${typeName}数据
export const ${fileName.replace('.js', 'Data')} = ${JSON.stringify(data, null, 2)}
`;

  const filePath = path.join(dirPath, fileName);
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`   ✓ ${fileName} 已生成 (${data.length} 条记录)`);
}

// 运行导出
exportDataToLocal();

