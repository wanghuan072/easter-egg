<template>
  <div class="admin-layout">
    <div class="admin-main">
      <!-- 左侧导航栏 -->
      <AdminSidebar 
        :activeModule="activeModule" 
        @change-module="handleModuleChange"
      />
      
      <!-- 右侧内容区域 -->
      <div class="admin-content">
        <!-- 欢迎信息 -->
        <div v-if="activeModule === 'welcome'" class="welcome-section">
          <h1>🎉 欢迎来到管理后台</h1>
          <div class="welcome-card">
            <h2>📝 系统说明</h2>
            <p>前端内容（游戏、电影、电视、新闻）已迁移至本地数据文件。</p>
            <p>管理后台现在专注于用户互动功能：</p>
            <ul>
              <li>💬 评论管理 - 管理用户评论</li>
              <li>⭐ 评分管理 - 管理用户评分</li>
              <li>📝 评价管理 - 管理用户评价</li>
            </ul>
            <div class="info-box">
              <strong>💡 提示：</strong>
              <p>如需修改内容数据，请编辑前端项目中的数据文件：</p>
              <code>src/data/games.js</code>
              <code>src/data/movies.js</code>
              <code>src/data/tv.js</code>
              <code>src/data/news.js</code>
            </div>
          </div>
        </div>

        <!-- 评论管理区域 -->
        <div v-if="activeModule === 'comments'" class="management-section">
          <CommentsManagement />
        </div>

        <!-- 评分管理区域 -->
        <div v-if="activeModule === 'ratings'" class="management-section">
          <RatingsManagement />
        </div>

        <!-- 评价管理区域 -->
        <div v-if="activeModule === 'reviews'" class="management-section">
          <ReviewsManagement />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from './AdminSidebar.vue'
import CommentsManagement from '@/views/admin/CommentsManagement.vue'
import RatingsManagement from '@/views/admin/RatingsManagement.vue'
import ReviewsManagement from '@/views/admin/ReviewsManagement.vue'

const router = useRouter()

// 当前激活的模块 - 默认显示欢迎页面
const activeModule = ref('welcome')

// 处理模块切换
const handleModuleChange = (module) => {
  activeModule.value = module
}


// 检查认证状态
onMounted(() => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
}

.admin-main {
  display: flex;
  min-height: 100vh;
}

.admin-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

/* 欢迎页面样式 */
.welcome-section {
  max-width: 900px;
  margin: 0 auto;
}

.welcome-section h1 {
  font-size: 42px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 40px;
  margin-bottom: 30px;
}

.welcome-card h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #8b5cf6;
}

.welcome-card p {
  font-size: 18px;
  line-height: 1.8;
  color: #a0a0a0;
  margin-bottom: 15px;
}

.welcome-card ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.welcome-card ul li {
  font-size: 18px;
  padding: 12px 0;
  color: #d0d0d0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-box {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.info-box strong {
  display: block;
  font-size: 18px;
  color: #8b5cf6;
  margin-bottom: 15px;
}

.info-box p {
  margin-bottom: 15px;
}

.info-box code {
  display: block;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  border-radius: 6px;
  margin: 8px 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #06b6d4;
  border-left: 3px solid #8b5cf6;
}

/* 管理区域样式 */
.management-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-main {
    flex-direction: column;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .welcome-section h1 {
    font-size: 32px;
  }
  
  .welcome-card {
    padding: 25px;
  }
  
  .welcome-card h2 {
    font-size: 24px;
  }
  
  .welcome-card p, .welcome-card ul li {
    font-size: 16px;
  }
}
</style>
