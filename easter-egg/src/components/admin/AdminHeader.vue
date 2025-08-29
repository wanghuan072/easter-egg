<template>
  <header class="admin-header">
    <div class="header-left">
      <h1 class="logo">EasterEggVault 管理后台</h1>
    </div>
    
    <div class="header-center">
      <div class="add-buttons">
        <button 
          class="add-button game"
          @click="$emit('add-content', 'game')"
        >
          <span class="icon">🎮</span>
          <span class="text">添加游戏</span>
        </button>
        
        <button 
          class="add-button movie"
          @click="$emit('add-content', 'movie')"
        >
          <span class="icon">🎬</span>
          <span class="text">添加电影</span>
        </button>
        
        <button 
          class="add-button tv"
          @click="$emit('add-content', 'tv')"
        >
          <span class="icon">📺</span>
          <span class="text">添加电视剧</span>
        </button>
        
        <button 
          class="add-button news"
          @click="$emit('add-content', 'news')"
        >
          <span class="icon">📰</span>
          <span class="text">添加新闻</span>
        </button>
      </div>
    </div>
    
    <div class="header-right">
      <button class="logout-button" @click="handleLogout">
        <span class="icon">🚪</span>
        <span class="text">退出登录</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // 清除认证信息
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  
  // 跳转到登录页
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 80px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.header-left .logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.add-buttons {
  display: flex;
  gap: 15px;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(51, 65, 85, 0.8);
  color: #ffffff;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  border-color: #8b5cf6;
}

.add-button .icon {
  font-size: 18px;
}

.add-button.game:hover {
  background: rgba(139, 92, 246, 0.2);
}

.add-button.movie:hover {
  background: rgba(6, 182, 212, 0.2);
}

.add-button.tv:hover {
  background: rgba(34, 197, 94, 0.2);
}

.add-button.news:hover {
  background: rgba(251, 146, 60, 0.2);
}

.header-right .logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(220, 38, 38, 0.8);
  color: #ffffff;
}

.logout-button:hover {
  background: rgba(220, 38, 38, 1);
  transform: translateY(-1px);
}

.logout-button .icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .add-buttons {
    gap: 10px;
  }
  
  .add-button {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .add-button .text {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0 15px;
    height: 70px;
  }
  
  .header-left .logo {
    font-size: 20px;
  }
  
  .add-buttons {
    gap: 8px;
  }
  
  .add-button {
    padding: 8px 12px;
  }
}
</style>
