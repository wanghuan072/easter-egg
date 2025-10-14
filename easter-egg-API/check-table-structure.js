import { query } from './config/database.js';

async function checkTableStructure() {
  try {
    console.log('🔍 检查数据库表结构...\n');
    
    const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
    
    for (const table of tables) {
      console.log(`\n📋 ${table} 表结构:`);
      console.log('━'.repeat(50));
      
      // 查询表结构
      const result = await query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      result.rows.forEach(col => {
        console.log(`  ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${col.is_nullable}`);
      });
      
      // 查询一条示例数据
      const sampleResult = await query(`SELECT * FROM ${table} LIMIT 1`);
      if (sampleResult.rows.length > 0) {
        console.log('\n  示例数据字段:');
        Object.keys(sampleResult.rows[0]).forEach(key => {
          const value = sampleResult.rows[0][key];
          const valuePreview = typeof value === 'string' ? value.substring(0, 50) : JSON.stringify(value);
          console.log(`    ${key}: ${valuePreview}`);
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  }
}

checkTableStructure();


