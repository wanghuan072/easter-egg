<template>
  <div class="comments-management">
    <div class="page-header">
      <h1>💬 评论管理</h1>
      <p class="page-description">管理所有用户评论数据</p>
    </div>
    
    <div class="content-container">
      

      
      <!-- 评论列表 -->
      <div class="comments-list">
        <div class="list-header">
          <h2>评论列表</h2>
          <div class="list-actions">
            <span class="total-count">共 {{ pagination.total }} 条记录</span>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载评论数据...</p>
        </div>
        
        <div v-else-if="comments.length === 0" class="empty-state">
          <div class="empty-icon">💬</div>
          <h3>暂无评论数据</h3>
          <p>当前筛选条件下没有找到评论记录</p>
        </div>
        
        <div v-else class="comments-table">

          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>内容类型</th>
                <th>内容标题</th>
                <th>昵称</th>
                <th>评论内容</th>
                <th>回复对象</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comment in comments" :key="comment.id">
                <td>{{ comment.id }}</td>
                <td>
                  <span :class="['type-badge', `type-${comment.content_type}`]">
                    {{ getTypeLabel(comment.content_type) }}
                  </span>
                </td>
                <td>{{ comment.content_title || '未知内容' }}</td>
                <td>{{ comment.nickname }}</td>
                <td>
                  <div class="comment-content-cell">
                    <span class="content-preview">{{ getContentPreview(comment.content) }}</span>
                    <button 
                      v-if="comment.content.length > 50"
                      @click="showFullContent(comment.content)"
                      class="view-more-btn"
                    >
                      查看全部
                    </button>
                  </div>
                </td>
                <td>
                  <span v-if="comment.parent_id" class="reply-info">
                    回复: {{ comment.parent_nickname || '未知用户' }}
                  </span>
                  <span v-else class="main-comment">主评论</span>
                </td>
                <td>
                  <span :class="['status-badge', comment.is_approved ? 'approved' : 'pending']">
                    {{ comment.is_approved ? '已审核' : '待审核' }}
                  </span>
                </td>
                <td>{{ formatTime(comment.created_at) }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="action-btn edit"
                      @click="handleEditComment(comment)"
                      title="编辑评论"
                    >
                      ✏️ 编辑
                    </button>
                    <button 
                      v-if="!comment.is_approved"
                      class="action-btn approve"
                      @click="handleApproveComment(comment.id)"
                      title="审核通过"
                    >
                      ✅ 通过
                    </button>
                    <button 
                      class="action-btn delete"
                      @click="handleDeleteComment(comment.id)"
                      title="删除评论"
                    >
                      🗑️ 删除
                    </button>
                  </div>
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
    
    <!-- 编辑评论弹窗 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>编辑评论</h3>
          <button @click="closeEditModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>昵称:</label>
            <input 
              v-model="editForm.nickname" 
              type="text" 
              maxlength="50"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>评论内容:</label>
            <textarea 
              v-model="editForm.content" 
              rows="4" 
              maxlength="1000"
              class="form-textarea"
            ></textarea>
            <div class="char-count">{{ editForm.content.length }}/1000</div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="editForm.isApproved" 
                type="checkbox"
              />
              <span class="checkmark"></span>
              审核通过
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeEditModal" class="btn btn-secondary">取消</button>
          <button @click="saveEditComment" class="btn btn-primary">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 查看完整内容弹窗 -->
    <div v-if="showContentModal" class="modal-overlay" @click="closeContentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>评论内容</h3>
          <button @click="closeContentModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="full-content">{{ fullContent }}</div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeContentModal" class="btn btn-primary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const comments = ref([])
const isLoading = ref(false)
const pagination = ref({ page: 1, pages: 1, total: 0 })




const showEditModal = ref(false)
const showContentModal = ref(false)
const editForm = ref({
  id: null,
  nickname: '',
  content: '',
  isApproved: false
})
const fullContent = ref('')

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchComments = async () => {
  isLoading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: 20
    }
    
    const response = await axios.get(`${apiBase}/api/comments`, { params })
    
    if (response.data.success) {
      comments.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    alert('获取评论数据失败')
  } finally {
    isLoading.value = false
  }
}





const changePage = (page) => {
  pagination.value.page = page
  fetchComments()
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

const handleEditComment = (comment) => {
  editForm.value = {
    id: comment.id,
    nickname: comment.nickname,
    content: comment.content,
    isApproved: comment.is_approved
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    id: null,
    nickname: '',
    content: '',
    isApproved: false
  }
}

const saveEditComment = async () => {
  try {
    const response = await axios.put(`${apiBase}/api/comments/${editForm.value.id}`, {
      nickname: editForm.value.nickname,
      content: editForm.value.content,
      isApproved: editForm.value.isApproved
    })
    
    if (response.data.success) {
      alert('评论更新成功')
      closeEditModal()
      fetchComments()
    } else {
      alert('更新失败：' + response.data.error)
    }
  } catch (error) {
    console.error('Failed to update comment:', error)
    alert('更新评论失败')
  }
}

const handleApproveComment = async (id) => {
  try {
    const response = await axios.put(`${apiBase}/api/comments/${id}`, {
      isApproved: true
    })
    
    if (response.data.success) {
      alert('评论审核通过')
      fetchComments()
    } else {
      alert('操作失败：' + response.data.error)
    }
  } catch (error) {
    console.error('Failed to approve comment:', error)
    alert('审核评论失败')
  }
}

const handleDeleteComment = async (id) => {
  if (!confirm('确定要删除这个评论吗？此操作不可恢复。')) {
    return
  }
  
  try {
    const response = await axios.delete(`${apiBase}/api/comments/${id}`)
    
    if (response.data.success) {
      alert('评论删除成功')
      fetchComments()
    } else {
      alert('删除失败：' + response.data.error)
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    alert('删除评论失败')
  }
}

const showFullContent = (content) => {
  fullContent.value = content
  showContentModal.value = true
}

const closeContentModal = () => {
  showContentModal.value = false
  fullContent.value = ''
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

const getContentPreview = (content) => {
  return content.length > 50 ? content.substring(0, 50) + '...' : content
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-management {
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





.comments-list {
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

.comments-table {
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


.comment-content-cell {
  max-width: 300px;
}

.content-preview {
  display: block;
  margin-bottom: 4px;
}

.view-more-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
}

.reply-info {
  color: #666;
  font-size: 0.9rem;
}

.main-comment {
  color: #28a745;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.action-btn.edit {
  background: #ffc107;
  color: #212529;
}

.action-btn.approve {
  background: #28a745;
  color: white;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
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

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  color: #666;
  font-size: 0.8rem;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.full-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}
</style>
