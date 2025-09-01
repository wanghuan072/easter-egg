<template>
  <div class="categories-management">
    <div class="page-header">
      <h1>🏷️ 分类标签管理</h1>
      <p class="page-description">管理游戏、电影、电视等内容的分类标签，支持添加、编辑、删除和排序操作</p>
    </div>
    
    <div class="content-container">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="filter-section">
          <label class="filter-label">媒体类型筛选：</label>
          <select v-model="selectedMediaType" @change="filterCategories" class="filter-select">
            <option value="">全部类型</option>
            <option value="games">🎮 游戏</option>
            <option value="movies">🎬 电影</option>
            <option value="tv">📺 电视</option>
          </select>
        </div>
        
        <button class="add-btn" @click="showCreateModal = true">
          🏷️ 添加分类标签
        </button>
      </div>
      
      <!-- 分类列表 -->
      <div class="content-list">
        <div class="list-header">
          <h2>分类标签列表</h2>
          <div class="list-actions">
            <span class="total-count">共 {{ filteredCategories.length }} 条记录</span>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载分类数据...</p>
        </div>
        
        <div v-else-if="filteredCategories.length === 0" class="empty-state">
          <div class="empty-icon">🏷️</div>
          <h3>暂无分类标签数据</h3>
          <p>点击顶部"添加分类标签"按钮开始创建第一个分类标签</p>
        </div>
        
        <div v-else class="content-table">
          <table class="content-table">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th width="200">分类名称</th>
                <th width="120">媒体类型</th>
                <th width="120">创建时间</th>
                <th width="150">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filteredCategories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                  <span class="media-type-badge" :class="category.media_type">
                    {{ getMediaTypeLabel(category.media_type) }}
                  </span>
                </td>
                <td>{{ formatDate(category.created_at) }}</td>
                <td>
                  <button 
                    class="action-btn edit"
                    @click="editCategory(category)"
                    title="编辑分类标签"
                  >
                    ✏️ 编辑
                  </button>
                  <button 
                    class="action-btn delete"
                    @click="deleteCategory(category.id)"
                    title="删除分类标签"
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

    <!-- 新增/编辑分类弹窗 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '✏️ 编辑分类标签' : '🏷️ 新增分类标签' }}</h3>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label>分类名称 *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              placeholder="请输入分类名称（如：射击类、动作类）"
              required
              class="form-input"
            />
            <small class="form-help">分类名称将同时用于系统内部标识和前端显示</small>
          </div>
          
          <div class="form-group">
            <label>媒体类型 *</label>
            <select v-model="formData.media_type" required class="form-select">
              <option value="">请选择媒体类型</option>
              <option value="games">🎮 游戏</option>
              <option value="movies">🎬 电影</option>
              <option value="tv">📺 电视</option>
            </select>
            <small class="form-help">选择此分类适用的内容类型</small>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              取消
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? '上传中...' : (showEditModal ? '更新分类' : '创建分类') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categoriesApi } from '@/services/api.js'

// 响应式数据
const categories = ref([])
const selectedMediaType = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(false)
const editingCategory = ref(null)

// 表单数据
const formData = ref({
  name: '',
  media_type: ''
})

// 计算属性
const filteredCategories = computed(() => {
  if (!selectedMediaType.value) return categories.value
  return categories.value.filter(cat => cat.media_type === selectedMediaType.value)
})

// 获取分类列表
const fetchCategories = async () => {
  isLoading.value = true
  try {
    const response = await categoriesApi.getAll()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
}

// 筛选分类
const filterCategories = () => {
  // 筛选逻辑已在computed中实现
}

// 显示新增弹窗
const showCreateForm = () => {
  formData.value = {
    name: '',
    media_type: ''
  }
  showCreateModal.value = true
}

// 编辑分类
const editCategory = (category) => {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    media_type: category.media_type
  }
  showEditModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    media_type: ''
  }
}

// 提交表单
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // 准备提交数据，设置默认值
    const submitData = {
      ...formData.value,
      display_name: formData.value.name, // 显示名称与分类名称相同
      sort_order: 0, // 默认排序
      is_active: true // 默认启用
    }
    
    let response
    if (showEditModal.value) {
      // 更新分类
      response = await categoriesApi.update(editingCategory.value.id, submitData)
    } else {
      // 创建分类
      response = await categoriesApi.create(submitData)
    }
    
    if (response.success) {
      alert(showEditModal.value ? '分类更新成功' : '分类创建成功')
      // 刷新数据
      await fetchCategories()
      closeModal()
    } else {
      alert(`操作失败: ${response.message || response.error}`)
    }
  } catch (error) {
    console.error('Failed to submit form:', error)
    if (error.message.includes('401')) {
      alert('操作失败：请重新登录')
    } else {
      alert('操作失败，请重试')
    }
  } finally {
    isSubmitting.value = false
  }
}

// 删除分类
const deleteCategory = async (id) => {
  if (!confirm('确定要删除这个分类标签吗？删除后相关内容的分类信息可能会丢失。')) return
  
  try {
    const response = await categoriesApi.delete(id)
    if (response.success) {
      alert('分类删除成功')
      await fetchCategories()
    } else {
      alert(`删除失败: ${response.message || response.error}`)
    }
  } catch (error) {
    console.error('Failed to delete category:', error)
    if (error.message.includes('401')) {
      alert('删除失败：请重新登录')
    } else {
      alert('删除失败，请重试')
    }
  }
}



// 获取媒体类型标签
const getMediaTypeLabel = (mediaType) => {
  const labels = {
    games: '游戏',
    movies: '电影',
    tv: '电视'
  }
  return labels[mediaType] || mediaType
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.categories-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.page-header h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  margin: 0;
  font-size: 16px;
  color: #a0a0a0;
  line-height: 1.6;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-label {
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.8);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.content-list {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: rgba(139, 92, 246, 0.1);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.list-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.total-count {
  font-size: 14px;
  color: #a0a0a0;
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.content-table {
  overflow-x: auto;
}

.content-table table {
  width: 100%;
  border-collapse: collapse;
}

.content-table th,
.content-table td {
  padding: 15px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.content-table th {
  background: rgba(139, 92, 246, 0.1);
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
}

.content-table td {
  font-size: 14px;
  color: #e0e0e0;
}

.media-type-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.media-type-badge.games {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.media-type-badge.movies {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.media-type-badge.tv {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}



.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.action-btn.edit:hover {
  background: rgba(245, 158, 11, 0.3);
  transform: translateY(-1px);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

/* 弹窗样式 */
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
  padding: 20px;
}

.modal-content {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
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
  font-size: 28px;
  cursor: pointer;
  color: #a0a0a0;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ffffff;
}

.modal-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
}

.form-input,
.form-select {
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
.form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.form-input::placeholder {
  color: #6b7280;
}

.form-select option {
  background: rgba(30, 41, 59, 0.95);
  color: #ffffff;
}

.form-help {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}



.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
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
  .categories-management {
    padding: 15px;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .filter-section {
    justify-content: center;
  }
  
  .list-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .content-table {
    overflow-x: auto;
  }
  
  .content-table table {
    min-width: 800px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
