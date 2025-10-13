<template>
  <aside class="admin-sidebar">
    <nav class="sidebar-nav">
      <!-- 内容管理已迁移至前端本地数据，管理功能已移除 -->
      
      <div class="nav-section">
        <h3 class="nav-title">用户互动管理</h3>
        
        <ul class="nav-list">
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'comments' }"
            @click="$emit('change-module', 'comments')"
          >
            <span class="nav-icon">💬</span>
            <span class="nav-text">评论管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'ratings' }"
            @click="$emit('change-module', 'ratings')"
          >
            <span class="nav-icon">⭐</span>
            <span class="nav-text">评分管理</span>
          </li>
          
          <li 
            class="nav-item"
            :class="{ active: activeModule === 'reviews' }"
            @click="goToReviews"
          >
            <span class="nav-icon">📝</span>
            <span class="nav-text">评论管理</span>
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
          
          <li class="nav-item" @click="logout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">退出登录</span>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useEasterEggsStore } from '@/stores/easterEggs.js'

const router = useRouter()
const store = useEasterEggsStore()

const emit = defineEmits(['change-module'])

const props = defineProps({
  activeModule: {
    type: String,
    required: true
  }
})

// 返回首页
const goHome = () => {
  router.push('/')
}

// 跳转到评价管理
const goToReviews = () => {
  console.log('🎯 跳转到评价管理，activeModule:', 'reviews')
  emit('change-module', 'reviews')
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    store.logout()
    router.push('/admin/login')
  }
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
