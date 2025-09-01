<template>
  <div class="ratings-management">
    <div class="page-header">
      <h1>⭐ 评分管理</h1>
      <p class="page-description">管理所有用户评分数据</p>
    </div>
    
    <div class="content-container">

      
      <!-- 评分列表 -->
      <div class="ratings-list">
        <div class="list-header">
          <h2>评分列表</h2>
          <div class="list-actions">
            <span class="total-count">共 {{ pagination.total }} 条记录</span>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载评分数据...</p>
        </div>
        
        <div v-else-if="ratings.length === 0" class="empty-state">
          <div class="empty-icon">⭐</div>
          <h3>暂无评分数据</h3>
          <p>当前筛选条件下没有找到评分记录</p>
        </div>
        
        <div v-else class="ratings-table">

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>内容类型</th>
                <th>内容标题</th>
                <th>评分</th>
                <th>用户IP</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rating in ratings" :key="rating.id">
                <td>{{ rating.id }}</td>
                <td>
                  <span :class="['type-badge', `type-${rating.content_type}`]">
                    {{ getTypeLabel(rating.content_type) }}
                  </span>
                </td>
                <td>{{ rating.content_title || '未知内容' }}</td>
                <td>
                  <div class="rating-display">
                    <span class="stars">
                      <span 
                        v-for="i in 5" 
                        :key="i"
                        :class="['star', { 'filled': i <= rating.rating }]"
                      >
                        {{ i <= rating.rating ? '★' : '☆' }}
                      </span>
                    </span>
                    <span class="rating-value">{{ rating.rating }}</span>
                  </div>
                </td>
                <td>{{ rating.user_ip }}</td>
                <td>{{ formatTime(rating.created_at) }}</td>
                <td>
                  <button 
                    class="action-btn delete"
                    @click="handleDeleteRating(rating.id)"
                    title="删除评分"
                  >
                    🗑️ 删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div v-if="pagination.pages > 1" class="pagination">
          <button 
            :disabled="pagination.page <= 1"
            @click="changePage(pagination.page - 1)"
            class="page-btn"
          >
            上一页
          </button>
          
          <button 
            v-for="page in getPageNumbers()" 
            :key="page"
            :class="['page-btn', { 'active': page === pagination.page }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          
          <button 
            :disabled="pagination.page >= pagination.pages"
            @click="changePage(pagination.page + 1)"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const ratings = ref([])
const isLoading = ref(false)
const pagination = ref({ page: 1, pages: 1, total: 0 })


const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchRatings = async () => {
  isLoading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: 20
    }
    
    const response = await axios.get(`${apiBase}/api/ratings`, { params })
    
    if (response.data.success) {
      ratings.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch ratings:', error)
    alert('获取评分数据失败')
  } finally {
    isLoading.value = false
  }
}



const changePage = (page) => {
  pagination.value.page = page
  fetchRatings()
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.page
  const total = pagination.value.pages
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

const handleDeleteRating = async (id) => {
  if (!confirm('确定要删除这个评分吗？此操作不可恢复。')) {
    return
  }
  
  try {
    const response = await axios.delete(`${apiBase}/api/ratings/${id}`)
    
    if (response.data.success) {
      alert('评分删除成功')
      fetchRatings()
    } else {
      alert('删除失败：' + response.data.error)
    }
  } catch (error) {
    console.error('Failed to delete rating:', error)
    alert('删除评分失败')
  }
}

const getTypeLabel = (type) => {
  const labels = {
    games: '游戏',
    movies: '电影',
    tv: '电视',
    news: '新闻'
  }
  return labels[type] || type
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchRatings()
})
</script>

<style scoped>
.ratings-management {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #333;
}

.page-description {
  margin: 0;
  color: #666;
}

.content-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}



.ratings-list {
  margin-top: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  margin: 0;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 0.9rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ratings-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #333;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-games { background: #e3f2fd; color: #1976d2; }
.type-movies { background: #f3e5f5; color: #7b1fa2; }
.type-tv { background: #e8f5e8; color: #388e3c; }


.rating-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 1rem;
  color: #ddd;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffd700;
}

.rating-value {
  font-weight: bold;
  color: #333;
  font-size: 0.9rem;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.delete:hover {
  background: #c82333;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.page-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.page-btn:disabled {
  background: #f8f9fa;
  color: #ccc;
  cursor: not-allowed;
}
</style>
