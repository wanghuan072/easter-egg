import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAllDates() {
  try {
    console.log('🔍 检查所有表的日期字段');
    console.log('='.repeat(50));
    
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    
    const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
    
    for (const table of tables) {
      console.log(`\n📋 检查表 ${table}:`);
      
      try {
        // 检查表结构
        const structureResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = $1 AND column_name = 'publish_date'
        `, [table]);
        
        if (structureResult.rows.length > 0) {
          const column = structureResult.rows[0];
          console.log(`   - publish_date 字段类型: ${column.data_type} (${column.is_nullable === 'YES' ? '可空' : '非空'})`);
        }
        
        // 检查实际数据
        const dataResult = await client.query(`
          SELECT id, title, publish_date, 
                 pg_typeof(publish_date) as actual_type,
                 publish_date IS NULL as is_null
          FROM ${table} 
          ORDER BY id 
          LIMIT 3
        `);
        
        if (dataResult.rows.length > 0) {
          console.log(`   - 数据示例:`);
          dataResult.rows.forEach(row => {
            console.log(`     ID ${row.id}: "${row.title}"`);
            console.log(`       日期值: ${row.publish_date}`);
            console.log(`       实际类型: ${row.actual_type}`);
            console.log(`       是否为NULL: ${row.is_null}`);
            
            // 尝试解析日期
            if (row.publish_date) {
              const date = new Date(row.publish_date);
              console.log(`       解析后日期: ${date}`);
              console.log(`       是否为有效日期: ${!isNaN(date.getTime())}`);
              console.log(`       ISO字符串: ${date.toISOString()}`);
              console.log(`       yyyy-MM-dd格式: ${date.toISOString().split('T')[0]}`);
            }
            console.log('');
          });
        } else {
          console.log('   - 表中没有数据');
        }
        
      } catch (error) {
        console.log(`   ❌ 检查表 ${table} 时出错:`, error.message);
      }
    }
    
    client.release();
    console.log('\n✅ 检查完成');
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await pool.end();
  }
}

checkAllDates();
