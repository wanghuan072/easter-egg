<template>
  <div class="news-management">
    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon">📰</div>
        <div class="stat-info">
          <h3>总新闻数</h3>
          <p class="stat-number">{{ newsList.length }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏠</div>
        <div class="stat-info">
          <h3>首页显示</h3>
          <p class="stat-number">{{ homeNewsCount }}</p>
        </div>
      </div>

    </div>

          <!-- 新闻列表 -->
      <div class="news-list">
        <div class="list-header">
          <h2>新闻管理</h2>
          <button class="add-btn" @click="handleAddNews">
            📰 添加新闻
          </button>
        </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载新闻数据...</p>
      </div>
      
      <div v-else-if="newsList.length === 0" class="empty-state">
        <div class="empty-icon">📰</div>
        <h3>暂无新闻</h3>
        <p>点击上方"添加新闻"按钮创建第一条新闻</p>
      </div>
      
      <div v-else class="news-table">
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
            <tr v-for="news in newsList" :key="news.id">
              <td>{{ news.id }}</td>
              <td>{{ news.title }}</td>
              <td>{{ formatDate(news.publishDate) }}</td>
                              <td>
                  <span v-if="news.isHome" class="status-badge home">首页</span>
                </td>
              <td>
                <button 
                  @click="$emit('edit-content', news)" 
                  class="action-btn edit"
                  title="编辑新闻"
                >
                  ✏️ 编辑
                </button>
                <button 
                  @click="handleDelete(news.id)" 
                  class="action-btn delete"
                  title="删除新闻"
                >
                  🗑️ 删除
                </button>
                </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-if="newsList.length === 0" class="empty-state">
        <div class="empty-icon">📰</div>
        <h3>暂无新闻</h3>
        <p>点击顶部"添加新闻"按钮创建第一条新闻</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getApiUrl } from '@/config/env.js'

// 定义事件
const emit = defineEmits(['edit-content', 'delete-content'])

// 响应式数据
const newsList = ref([])
const loading = ref(false)

// 计算属性
const homeNewsCount = computed(() => {
  return newsList.value.filter(news => news.isHome).length
})

// 获取新闻列表
const fetchNewsList = async () => {
  try {
    loading.value = true
    const response = await fetch(`${getApiUrl('')}/api/news`)
    if (response.ok) {
      const data = await response.json()
      newsList.value = data.data || []
    } else {
      console.error('获取新闻列表失败:', response.statusText)
    }
  } catch (error) {
    console.error('获取新闻列表出错:', error)
  } finally {
    loading.value = false
  }
}

// 添加新闻
const handleAddNews = () => {
  emit('edit-content', null) // 传递null表示添加模式
}

// 删除新闻
const handleDelete = async (id) => {
  if (confirm('确定要删除这条新闻吗？此操作不可恢复。')) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${getApiUrl('')}/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        // 从列表中移除
        newsList.value = newsList.value.filter(news => news.id !== id)
        // 触发删除事件
        emit('delete-content', id)
      } else {
        alert('删除失败，请重试')
      }
    } catch (error) {
      console.error('删除新闻出错:', error)
      alert('删除失败，请重试')
    }
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.src = '/images/default-news.jpg'
}

// 组件挂载时获取数据
onMounted(() => {
  fetchNewsList()
  
  // 监听刷新事件
  window.addEventListener('refresh-data', fetchNewsList)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('refresh-data', fetchNewsList)
})
</script>

<style scoped>
.news-management {
  padding: 20px;
}

/* 统计区域 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #8b5cf6;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-info h3 {
  color: #a0a0a0;
  font-size: 14px;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.stat-number {
  color: #f5f5f5;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* 列表区域 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  color: #f5f5f5;
  font-size: 24px;
  margin: 0;
}

.refresh-btn {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
}

/* 新闻网格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.news-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-status {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.status-badge.home {
  background: rgba(34, 197, 94, 0.9);
}

.status-badge.latest {
  background: rgba(59, 130, 246, 0.9);
}

.news-content {
  padding: 20px;
}

.news-title {
  color: #f5f5f5;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.news-description {
  color: #a0a0a0;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.news-meta span {
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 500;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.news-actions {
  padding: 0 20px 20px;
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(59, 130, 246, 0.8);
  color: white;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 1);
  transform: translateY(-2px);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
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
  color: #f5f5f5;
  font-size: 20px;
  margin: 0 0 10px 0;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-management {
    padding: 15px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .list-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .news-actions {
    flex-direction: column;
  }
  
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
}
</style>
