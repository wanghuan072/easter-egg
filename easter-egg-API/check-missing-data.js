import { query } from './config/database.js';

async function checkMissingData() {
  try {
    console.log('🔍 查询数据库中的数据...\n');
    
    // 查询包含关键词的数据
    const keywords = ['Black Ops 6', 'Monster Hunter Wilds'];
    
    for (const keyword of keywords) {
      console.log(`\n🔎 搜索: "${keyword}"`);
      console.log('━'.repeat(50));
      
      const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
      
      for (const table of tables) {
        const result = await query(
          `SELECT id, title, address_bar, label FROM ${table} WHERE title ILIKE $1`,
          [`%${keyword}%`]
        );
        
        if (result.rows.length > 0) {
          console.log(`\n  在 ${table} 中找到 ${result.rows.length} 条:`);
          result.rows.forEach(row => {
            console.log(`    ID: ${row.id}`);
            console.log(`    标题: ${row.title}`);
            console.log(`    地址: ${row.address_bar}`);
            console.log(`    标签: ${JSON.stringify(row.label)}`);
            console.log('');
          });
        }
      }
    }
    
    // 统计所有表的数据量
    console.log('\n📊 数据统计:');
    console.log('━'.repeat(50));
    const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
    for (const table of tables) {
      const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table.padEnd(15)} ${result.rows[0].count} 条`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 查询失败:', error);
    process.exit(1);
  }
}

checkMissingData();


