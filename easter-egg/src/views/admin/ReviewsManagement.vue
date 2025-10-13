<template>
  <div class="reviews-management">
    <div class="page-header">
      <h1>📝 评价管理</h1>
      <p class="page-description">管理用户评分和评论数据，支持查看、编辑和删除操作</p>
    </div>

         <div class="content-container">
       <!-- 操作栏 -->
               <div class="action-bar">
          <button class="add-btn" @click="showCreateForm">
            ➕ 添加评论
          </button>
        </div>

       <!-- 评价列表 -->
       <div class="content-list">
        <div class="list-header">
          <h2>评价列表</h2>
          <div class="list-actions">
            <span class="total-count">共 {{ pagination.total }} 条记录</span>
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载评价数据...</p>
        </div>

        <div v-else-if="reviews.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无评价数据</h3>
          <p>当前筛选条件下没有找到评价记录</p>
        </div>

        <div v-else class="content-table">
          <table>
            <thead>
              <tr>
                <th width="60">ID</th>
                <th width="100">内容类型</th>
                <th width="150">内容标题</th>
                <th width="100">昵称</th>
                <th width="80">评分</th>
                <th width="200">评论内容</th>
                <th width="120">创建时间</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in reviews" :key="review.id">
                <td>{{ review.id }}</td>
                <td>
                  <span class="content-type-badge" :class="review.content_type">
                    {{ getContentTypeLabel(review.content_type) }}
                  </span>
                </td>
                <td>{{ review.content_title || '未知内容' }}</td>
                <td>{{ review.nickname }}</td>
                <td>
                  <div class="rating-display">
                    <div class="stars">
                      <span 
                        v-for="i in 5" 
                        :key="i"
                        :class="['star', { 'filled': i <= review.rating }]"
                      >
                        {{ i <= review.rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="rating-value">{{ review.rating }}</span>
                  </div>
                </td>
                <td>
                  <div class="comment-preview">
                    <span :title="review.comment_text">
                      {{ getCommentPreview(review.comment_text) }}
                    </span>
                    <button 
                      v-if="review.comment_text && review.comment_text.length > 50"
                      @click="showFullComment(review.comment_text)"
                      class="view-more-btn"
                    >
                      查看全部
                    </button>
                  </div>
                </td>

                <td>{{ formatDate(review.created_at) }}</td>
                                 <td>
                   <button
                     class="action-btn edit"
                     @click="editReview(review)"
                     title="编辑评价"
                   >
                     ✏️ 编辑
                   </button>
                   <button
                     class="action-btn delete"
                     @click="deleteReview(review.id)"
                     title="删除评价"
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



         <!-- 新增/编辑评价弹窗 -->
     <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
       <div class="modal-content" @click.stop>
         <div class="modal-header">
           <h3>{{ showEditModal ? '✏️ 编辑评价' : '➕ 新增评价' }}</h3>
           <button @click="closeModal" class="modal-close">&times;</button>
         </div>

         <form @submit.prevent="submitForm" class="modal-form">
           <div class="form-group">
             <label>内容类型 *</label>
             <select v-model="formData.content_type" @change="onContentTypeChange" required class="form-select">
               <option value="">请选择内容类型</option>
               <option value="games">🎮 游戏</option>
               <option value="movies">🎬 电影</option>
               <option value="tv">📺 电视</option>
             </select>
           </div>

           <div class="form-group">
             <label>内容标题 *</label>
             <select v-model="formData.content_id" required class="form-select" :disabled="!formData.content_type">
               <option value="">请先选择内容类型</option>
               <option v-for="item in contentOptions" :key="item.id" :value="item.id">
                 {{ item.title }}
               </option>
             </select>
           </div>

           <div class="form-group">
             <label>昵称 *</label>
             <input
               v-model="formData.nickname"
               type="text"
               placeholder="请输入昵称"
               required
               class="form-input"
             />
           </div>

           <div class="form-group">
             <label>评分 *</label>
             <select v-model="formData.rating" required class="form-select">
               <option value="">请选择评分</option>
               <option value="1">1星</option>
               <option value="2">2星</option>
               <option value="3">3星</option>
               <option value="4">4星</option>
               <option value="5">5星</option>
             </select>
           </div>

           <div class="form-group">
             <label>评论内容 *</label>
             <textarea
               v-model="formData.comment_text"
               placeholder="请输入评论内容"
               required
               rows="4"
               class="form-textarea"
             ></textarea>
           </div>

           <div class="form-group">
             <label>评论时间</label>
             <input
               v-model="formData.created_at"
               type="datetime-local"
               class="form-input"
               :placeholder="getCurrentDateTime()"
             />
             <div class="form-help">
               如果不选择时间，将使用当前时间
             </div>
           </div>

           <div class="form-actions">
             <button type="button" @click="closeModal" class="btn btn-secondary">
               取消
             </button>
             <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
               {{ isSubmitting ? '上传中...' : (showEditModal ? '更新评价' : '创建评价') }}
             </button>
           </div>
         </form>
       </div>
     </div>

     <!-- 查看完整评论弹窗 -->
     <div v-if="showCommentModal" class="modal-overlay" @click="closeCommentModal">
       <div class="modal-content" @click.stop>
         <div class="modal-header">
           <h3>📄 评论内容</h3>
           <button @click="closeCommentModal" class="modal-close">&times;</button>
         </div>

         <div class="modal-body">
           <div class="full-comment">{{ fullComment }}</div>
         </div>

         <div class="modal-footer">
           <button @click="closeCommentModal" class="btn btn-primary">关闭</button>
         </div>
       </div>
     </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const reviews = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showCommentModal = ref(false)
const isLoading = ref(false)
const fullComment = ref('')
const pagination = ref({ page: 1, pages: 1, total: 0 })
const isSubmitting = ref(false)
const editingReview = ref(null)
const contentOptions = ref([])

const formData = ref({
  content_type: '',
  content_id: '',
  nickname: '',
  rating: '',
  comment_text: '',
  created_at: ''
})

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 获取当前时间字符串，用于datetime-local输入框
const getCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}



const fetchReviews = async () => {
  isLoading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: 20
    }
    
    const response = await axios.get(`${apiBase}/api/reviews`, { params })
    
    if (response.data.success) {
      reviews.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    alert('获取评价数据失败')
  } finally {
    isLoading.value = false
  }
}

// 获取内容选项（二级联动）
const fetchContentOptions = async (contentType) => {
  if (!contentType) {
    contentOptions.value = []
    return
  }
  
  try {
    let endpoint = ''
    switch (contentType) {
      case 'games':
        endpoint = '/api/games'
        break
      case 'movies':
        endpoint = '/api/movies'
        break
      case 'tv':
        endpoint = '/api/tv'
        break
      default:
        return
    }
    
    const response = await axios.get(`${apiBase}${endpoint}`)
    if (response.data.success) {
      contentOptions.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch content options:', error)
    alert('获取内容选项失败')
  }
}

// 内容类型改变时的处理
const onContentTypeChange = () => {
  formData.value.content_id = ''
  fetchContentOptions(formData.value.content_type)
}

// 显示创建表单
const showCreateForm = () => {
  formData.value = {
    content_type: '',
    content_id: '',
    nickname: '',
    rating: '',
    comment_text: '',
    created_at: getCurrentDateTime()
  }
  contentOptions.value = []
  showCreateModal.value = true
}

// 编辑评价
const editReview = (review) => {
  editingReview.value = review
  
  // 格式化时间，确保能正确显示在datetime-local输入框中
  let formattedTime = ''
  if (review.created_at) {
    const date = new Date(review.created_at)
    if (!isNaN(date.getTime())) {
      formattedTime = date.toISOString().slice(0, 16) // 格式化为 YYYY-MM-DDTHH:MM
    }
  }
  
  formData.value = {
    content_type: review.content_type,
    content_id: review.content_id,
    nickname: review.nickname,
    rating: review.rating.toString(),
    comment_text: review.comment_text,
    created_at: formattedTime || getCurrentDateTime()
  }
  
  // 获取对应的内容选项
  fetchContentOptions(review.content_type)
  showEditModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingReview.value = null
  formData.value = {
    content_type: '',
    content_id: '',
    nickname: '',
    rating: '',
    comment_text: '',
    created_at: ''
  }
  contentOptions.value = []
}

// 提交表单
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    const submitData = {
      ...formData.value,
      content_id: parseInt(formData.value.content_id),
      rating: parseInt(formData.value.rating)
    }
    
    // 处理时间字段
    if (submitData.created_at) {
      // 如果选择了时间，转换为ISO字符串
      submitData.created_at = new Date(submitData.created_at).toISOString()
    } else {
      // 如果没有选择时间，使用当前时间
      submitData.created_at = new Date().toISOString()
    }
    
    if (showEditModal.value) {
      await axios.put(`${apiBase}/api/reviews/${editingReview.value.id}`, submitData)
      alert('评价更新成功')
    } else {
      await axios.post(`${apiBase}/api/reviews`, submitData)
      alert('评价创建成功')
    }
    
    await fetchReviews()
    closeModal()
  } catch (error) {
    console.error('Failed to submit form:', error)
    alert('提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const deleteReview = async (id) => {
  if (!confirm('确定要删除这个评价吗？此操作不可恢复。')) return
  
  try {
    await axios.delete(`${apiBase}/api/reviews/${id}`)
    await fetchReviews()
    alert('评价删除成功')
  } catch (error) {
    console.error('Failed to delete review:', error)
    alert('删除失败')
  }
}

const showFullComment = (comment) => {
  fullComment.value = comment
  showCommentModal.value = true
}

const closeCommentModal = () => {
  showCommentModal.value = false
  fullComment.value = ''
}

const changePage = (page) => {
  pagination.value.page = page
  fetchReviews()
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

const getContentTypeLabel = (type) => {
  const labels = {
    games: '🎮 游戏',
    movies: '🎬 电影',
    tv: '📺 电视',
    news: '📰 新闻'
  }
  return labels[type] || type
}

const getCommentPreview = (comment) => {
  if (!comment) return ''
  return comment.length > 50 ? comment.substring(0, 50) + '...' : comment
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
/* 使用与 CategoriesManagement.vue 一致的样式 */
.reviews-management {
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  min-height: 100vh;
  color: #ffffff;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
}

.page-description {
  margin: 0;
  color: #a0a0a0;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.content-container {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.add-btn {
  padding: 12px 24px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}





.content-list {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.list-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.total-count {
  color: #a0a0a0;
  font-size: 14px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(139, 92, 246, 0.2);
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.content-table {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.content-table table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(30, 41, 59, 0.8);
}

.content-table th {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
  color: #ffffff;
  font-weight: 600;
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
  font-size: 14px;
}

.content-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  color: #e0e0e0;
  font-size: 14px;
  vertical-align: top;
}

.content-type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.content-type-badge.games {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.content-type-badge.movies {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.content-type-badge.tv {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #ddd;
}

.star.filled {
  color: #ffd700;
}

.rating-value {
  font-weight: bold;
  color: #8b5cf6;
  font-size: 12px;
  background: rgba(139, 92, 246, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}



.comment-preview {
  max-width: 200px;
}

.view-more-btn {
  display: block;
  margin-top: 4px;
  padding: 2px 6px;
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: rgba(139, 92, 246, 0.3);
}





.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  margin: 0 2px;
  transition: all 0.3s ease;
}



.action-btn.edit {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  margin-right: 8px;
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.3);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  align-items: center;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: rgba(30, 41, 59, 0.8);
  color: #ffffff;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}

.page-btn.active {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  border-color: #8b5cf6;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}



.full-comment {
  background: rgba(30, 41, 59, 0.8);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: #e0e0e0;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.modal-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.modal-form {
  padding: 24px 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.8);
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
  font-style: italic;
}

/* 时间输入框特殊样式 */
input[type="datetime-local"] {
  font-family: inherit;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-bar {
    justify-content: center;
  }
  
  .content-table {
    font-size: 12px;
  }
  
  .content-table th,
  .content-table td {
    padding: 8px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-form {
    padding: 16px 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>


