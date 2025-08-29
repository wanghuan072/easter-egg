<template>
  <div class="game-management">
    <div class="page-header">
      <h1>🎮 游戏管理</h1>
      <p class="page-description">管理所有游戏内容，包括添加、编辑和删除操作</p>
    </div>
    
    <div class="content-container">
      <!-- 数据统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总游戏数</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏠</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.home }}</div>
            <div class="stat-label">首页显示</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.latest }}</div>
            <div class="stat-label">最新发现</div>
          </div>
        </div>
      </div>
      
      <!-- 游戏列表 -->
      <div class="games-list">
        <div class="list-header">
          <h2>游戏列表</h2>
          <button class="add-btn" @click="handleAddGame">
            🎮 添加游戏
          </button>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载游戏数据...</p>
        </div>
        
        <div v-else-if="games.length === 0" class="empty-state">
          <div class="empty-icon">🎮</div>
          <h3>暂无游戏数据</h3>
          <p>点击顶部"添加游戏"按钮开始创建第一个游戏</p>
        </div>
        
        <div v-else class="games-table">
          <table class="content-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>发布日期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in games" :key="game.id">
                <td>{{ game.id }}</td>
                <td>{{ game.title }}</td>
                <td>{{ formatDate(game.publishDate) }}</td>
                <td>
                  <span v-if="game.isLatest" class="status-badge latest">最新</span>
                  <span v-if="game.isHome" class="status-badge home">首页</span>
                </td>
                <td>
                  <button 
                    class="action-btn edit"
                    @click="$emit('edit-content', game)"
                    title="编辑游戏"
                  >
                    ✏️ 编辑
                  </button>
                  <button 
                    class="action-btn delete"
                    @click="handleDeleteGame(game.id)"
                    title="删除游戏"
                  >
                    🗑️ 删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getApiUrl } from '@/config/env.js'

const emit = defineEmits(['edit-content', 'delete-content'])

// 状态数据
const games = ref([])
const isLoading = ref(false)
const stats = ref({
  total: 0,
  home: 0,
  latest: 0
})

// 加载游戏数据
const loadGames = async () => {
  try {
    isLoading.value = true
    
    const token = localStorage.getItem('admin_token')
    const response = await fetch(getApiUrl('/api/games'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      games.value = data.data || []
      
      // 计算统计数据
      stats.value = {
        total: games.value.length,
        home: games.value.filter(g => g.isHome).length,
        latest: games.value.filter(g => g.isLatest).length
      }
    } else {
      console.error('加载游戏失败:', response.statusText)
    }
  } catch (error) {
    console.error('加载游戏错误:', error)
  } finally {
    isLoading.value = false
  }
}

// 添加游戏
const handleAddGame = () => {
  emit('edit-content', null) // 传递null表示添加模式
}

// 删除游戏
const handleDeleteGame = async (gameId) => {
  if (!confirm('确定要删除这个游戏吗？此操作不可恢复。')) {
    return
  }
  
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(getApiUrl(`/api/games/${gameId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      // 从列表中移除
      games.value = games.value.filter(g => g.id !== gameId)
      
      // 重新计算统计
      stats.value = {
        total: games.value.length,
        home: games.value.filter(g => g.is_home).length,
        latest: games.value.filter(g => g.is_latest).length
      }
      
      // 发送刷新事件
      emit('refresh')
    } else {
      alert('删除失败，请重试')
    }
  } catch (error) {
    console.error('删除游戏错误:', error)
    alert('删除失败，请重试')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未设置'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '日期无效'
    }
    return date.toLocaleDateString('zh-CN')
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '日期错误'
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/images/games-category.jpg'
}

// 组件挂载时加载数据
onMounted(() => {
  loadGames()
  
  // 监听刷新事件
  window.addEventListener('refresh-data', loadGames)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('refresh-data', loadGames)
})
</script>

<style scoped>
.game-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  color: #a0a0a0;
  font-size: 16px;
  margin: 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}

.stat-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
}

/* 游戏列表 */
.games-list {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 24px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.list-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.3);
  border-color: #8b5cf6;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #ffffff;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 游戏网格 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.game-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.3);
  border-color: #8b5cf6;
}

.game-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.game-status {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.latest {
  background: rgba(251, 146, 60, 0.9);
  color: #ffffff;
}

.status-badge.home {
  background: rgba(34, 197, 94, 0.9);
  color: #ffffff;
}

.game-info {
  padding: 20px;
}

.game-title {
  margin: 0 0 12px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.game-description {
  margin: 0 0 16px 0;
  color: #a0a0a0;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #6b7280;
}

.game-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tag {
  padding: 4px 8px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 500;
}

.tag.more {
  background: rgba(107, 114, 128, 0.2);
  border-color: rgba(107, 114, 128, 0.3);
  color: #6b7280;
}

.game-actions {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn.edit {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.action-btn.edit:hover {
  background: rgba(6, 182, 212, 0.3);
  border-color: #06b6d4;
}

.action-btn.delete {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.action-btn.delete:hover {
  background: rgba(220, 38, 38, 0.3);
  border-color: #dc2626;
}

/* 列表标题和添加按钮 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

/* 表格样式 */
.content-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.content-table th,
.content-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.content-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.content-table td {
  color: #6b7280;
  font-size: 14px;
}

.content-table tr:hover {
  background: #f9fafb;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-right: 4px;
}

.status-badge.latest {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.home {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* 添加按钮 */
.add-btn {
  background: linear-gradient(90deg, #22c55e, #06b6d4);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-management {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .game-card {
    margin: 0 10px;
  }
}
</style>
