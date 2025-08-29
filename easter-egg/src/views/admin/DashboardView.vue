<template>
  <div class="dashboard-view">
    <!-- 背景装饰 -->
    <div class="dashboard-decorations">
      <div class="tech-circle tech-circle-1"></div>
      <div class="tech-circle tech-circle-2"></div>
    </div>

    <!-- 主要内容 -->
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">管理后台</h1>
        <p class="dashboard-subtitle">欢迎回来，{{ adminUser }}</p>
        <button @click="handleLogout" class="logout-button">
          🚪 退出登录
        </button>
      </div>

      <div class="dashboard-content">
        <div class="welcome-card">
          <div class="welcome-icon">🎉</div>
          <h2>登录成功！</h2>
          <p>您已成功登录到EasterEggVault管理后台</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎮</div>
            <div class="stat-info">
              <h3>游戏彩蛋</h3>
              <p class="stat-number">管理游戏相关的内容</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎬</div>
            <div class="stat-info">
              <h3>电影秘密</h3>
              <p class="stat-number">管理电影相关的内容</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📺</div>
            <div class="stat-info">
              <h3>电视节目</h3>
              <p class="stat-number">管理电视相关的内容</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📰</div>
            <div class="stat-info">
              <h3>新闻资讯</h3>
              <p class="stat-number">管理新闻相关的内容</p>
            </div>
          </div>
        </div>

        <div class="action-section">
          <h3>快速操作</h3>
          <div class="action-buttons">
            <button class="action-button">
              ➕ 添加新内容
            </button>
            <button class="action-button">
              📊 查看统计
            </button>
            <button class="action-button">
              ⚙️ 系统设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminUser = ref('')

onMounted(() => {
  // 获取存储的管理员用户名
  const storedUser = localStorage.getItem('admin_user')
  if (storedUser) {
    adminUser.value = storedUser
  } else {
    // 如果没有用户信息，跳转到登录页
    router.push('/admin/login')
  }
})

const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  
  // 跳转到登录页
  router.push('/admin/login')
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.dashboard-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.tech-circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.tech-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 主要内容 */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 10;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
}

.dashboard-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.dashboard-subtitle {
  color: #a0a0a0;
  font-size: 18px;
  margin-bottom: 24px;
}

.logout-button {
  background: rgba(220, 38, 38, 0.8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(220, 38, 38, 1);
  transform: translateY(-2px);
}

/* 欢迎卡片 */
.welcome-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.welcome-card h2 {
  color: #f5f5f5;
  font-size: 28px;
  margin-bottom: 16px;
}

.welcome-card p {
  color: #a0a0a0;
  font-size: 16px;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.stat-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.stat-info h3 {
  color: #f5f5f5;
  font-size: 18px;
  margin-bottom: 8px;
}

.stat-number {
  color: #a0a0a0;
  font-size: 14px;
  margin: 0;
}

/* 操作区域 */
.action-section {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.action-section h3 {
  color: #f5f5f5;
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 20px 10px;
  }
  
  .dashboard-title {
    font-size: 28px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
