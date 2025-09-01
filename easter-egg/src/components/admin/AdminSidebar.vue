<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="nav-title">内容管理</h3>
        
        <ul class="nav-list">
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'games' }"
            @click="$emit('change-module', 'games')"
          >
            <span class="nav-icon">🎮</span>
            <span class="nav-text">游戏管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'movies' }"
            @click="$emit('change-module', 'movies')"
          >
            <span class="nav-icon">🎬</span>
            <span class="nav-text">电影管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'tv' }"
            @click="$emit('change-module', 'tv')"
          >
            <span class="nav-icon">📺</span>
            <span class="nav-text">电视剧管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'news' }"
            @click="$emit('change-module', 'news')"
          >
            <span class="nav-icon">📰</span>
            <span class="nav-text">新闻管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'categories' }"
            @click="$emit('change-module', 'categories')"
          >
            <span class="nav-icon">🏷️</span>
            <span class="nav-text">分类标签管理</span>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 class="nav-title">用户互动</h3>
        
        <ul class="nav-list">
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'reviews' }"
            @click="goToReviews"
          >
            <span class="nav-icon">📝</span>
            <span class="nav-text">评价管理</span>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 class="nav-title">系统</h3>
        
        <ul class="nav-list">
          <li class="nav-item" @click="goHome">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">返回首页</span>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()



const emit = defineEmits(['change-module'])

const props = defineProps({
  activeModule: {
    type: String,
    required: true
  }
})

// 调试信息
console.log('🔍 AdminSidebar - 接收到的activeModule:', props.activeModule)

// 返回首页
const goHome = () => {
  router.push('/')
}

// 跳转到评价管理
const goToReviews = () => {
  console.log('🎯 跳转到评价管理，activeModule:', 'reviews')
  emit('change-module', 'reviews')
}
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(139, 92, 246, 0.3);
  overflow-y: auto;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 20px 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #a0a0a0;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(139, 92, 246, 0.1);
  color: #ffffff;
  border-left-color: rgba(139, 92, 246, 0.5);
}

.nav-item.active {
  background: rgba(139, 92, 246, 0.2);
  color: #ffffff;
  border-left-color: #8b5cf6;
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  }
  
  .sidebar-nav {
    padding: 15px 0;
  }
  
  .nav-list {
    display: flex;
    overflow-x: auto;
    padding: 0 15px;
  }
  
  .nav-item {
    flex-shrink: 0;
    padding: 10px 15px;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-item.active {
    border-left-color: transparent;
    border-bottom-color: #8b5cf6;
  }
  
  .nav-text {
    font-size: 13px;
  }
}
</style>
