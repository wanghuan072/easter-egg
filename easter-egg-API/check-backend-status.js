import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkBackendStatus() {
  try {
    console.log('🔍 检查后端状态');
    console.log('='.repeat(50));
    
    // 检查数据库连接
    console.log('📡 检查数据库连接...');
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    
    // 检查环境变量
    console.log('\n🔧 环境变量检查:');
    console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置');
    console.log('  - PORT:', process.env.PORT || '未设置');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || '未设置');
    
    // 检查数据库表结构
    console.log('\n🗄️ 数据库表结构检查:');
    const tables = ['egg_games', 'egg_movies', 'egg_tv', 'egg_news'];
    
    for (const table of tables) {
      try {
        const result = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [table]);
        
        console.log(`\n📋 表 ${table}:`);
        if (result.rows.length > 0) {
          result.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? '可空' : '非空'})`);
          });
        } else {
          console.log('   ❌ 表不存在');
        }
      } catch (error) {
        console.log(`   ❌ 检查表 ${table} 时出错:`, error.message);
      }
    }
    
    // 检查游戏数据
    console.log('\n🎮 游戏数据检查:');
    const gameResult = await client.query('SELECT COUNT(*) as total FROM egg_games');
    console.log(`   - 总游戏数: ${gameResult.rows[0].total}`);
    
    if (parseInt(gameResult.rows[0].total) > 0) {
      const sampleGame = await client.query('SELECT * FROM egg_games LIMIT 1');
      const game = sampleGame.rows[0];
      console.log('   - 示例游戏数据:');
      console.log(`     ID: ${game.id}`);
      console.log(`     标题: ${game.title}`);
      console.log(`     iframe_url: ${game.iframe_url} (类型: ${typeof game.iframe_url})`);
      console.log(`     seo_description: ${game.seo_description} (类型: ${typeof game.seo_description})`);
      console.log(`     seo_keywords: ${game.seo_keywords} (类型: ${typeof game.seo_keywords})`);
    }
    
    client.release();
    console.log('\n✅ 检查完成');
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  } finally {
    await pool.end();
  }
}

checkBackendStatus();
