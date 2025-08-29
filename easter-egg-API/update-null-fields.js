import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateNullFields() {
  try {
    console.log('🔍 检查数据库连接...');
    
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    
    // 更新所有表中的NULL字段
    const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
    
    for (const table of tables) {
      console.log(`\n📋 更新表 ${table}...`);
      
      try {
        // 更新NULL字段为默认值
        const result = await client.query(`
          UPDATE ${table} 
          SET 
            iframe_url = COALESCE(iframe_url, ''),
            seo_description = COALESCE(seo_description, ''),
            seo_keywords = COALESCE(seo_keywords, ''),
            image_url = COALESCE(image_url, ''),
            image_alt = COALESCE(image_alt, ''),
            seo_title = COALESCE(seo_title, ''),
            details_html = COALESCE(details_html, ''),
            label = COALESCE(label, ''),
            classify = COALESCE(classify, ARRAY[]::text[])
          WHERE 
            iframe_url IS NULL OR 
            seo_description IS NULL OR 
            seo_keywords IS NULL OR
            image_url IS NULL OR
            image_alt IS NULL OR
            seo_title IS NULL OR
            details_html IS NULL OR
            label IS NULL OR
            classify IS NULL
        `);
        
        console.log(`   ✅ 更新了 ${result.rowCount} 条记录`);
        
        // 检查更新后的记录
        const checkResult = await client.query(`
          SELECT COUNT(*) as total,
                 COUNT(CASE WHEN iframe_url IS NULL THEN 1 END) as null_iframe,
                 COUNT(CASE WHEN seo_description IS NULL THEN 1 END) as null_seo_desc,
                 COUNT(CASE WHEN seo_keywords IS NULL THEN 1 END) as null_seo_keywords
          FROM ${table}
        `);
        
        const stats = checkResult.rows[0];
        console.log(`   📊 统计信息:`);
        console.log(`      总记录数: ${stats.total}`);
        console.log(`      iframe_url为NULL: ${stats.null_iframe}`);
        console.log(`      seo_description为NULL: ${stats.null_seo_desc}`);
        console.log(`      seo_keywords为NULL: ${stats.null_seo_keywords}`);
        
      } catch (error) {
        console.log(`   ❌ 更新表 ${table} 时出错:`, error.message);
      }
    }
    
    client.release();
    console.log('\n✅ 更新完成');
    
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
  } finally {
    await pool.end();
  }
}

updateNullFields();
