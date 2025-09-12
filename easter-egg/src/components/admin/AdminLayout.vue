<template>
  <div class="admin-layout">
    <div class="admin-main">
      <!-- 左侧导航栏 -->
      <AdminSidebar 
        :activeModule="activeModule" 
        @change-module="handleModuleChange"
      />
      
      <!-- 右侧内容区域 -->
      <div class="admin-content">
        <!-- 主要内容区域 -->
        <div v-if="activeModule !== 'reviews' && activeModule !== 'categories'" class="main-content-area">
          <component 
            :is="currentComponent" 
            :content-type="activeModule"
            @edit-content="handleEditContent"
            @delete-content="handleDeleteContent"
          />
        </div>

        <!-- 分类管理区域 -->
        <div v-if="activeModule === 'categories'" class="rating-comments-section">
          <CategoriesManagement />
        </div>

        <!-- 评价管理区域 -->
        <div v-if="activeModule === 'reviews'" class="rating-comments-section">
          <ReviewsManagement />
        </div>
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <ContentForm 
      v-if="showForm"
      :content-type="formContentType"
      :edit-data="editData"
      :is-submitting="isFormSubmitting"
      @close="closeForm"
      @save="handleSaveContent"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getApiUrl } from '@/config/env.js'
import AdminSidebar from './AdminSidebar.vue'
import ContentForm from './ContentForm.vue'
import UnifiedContentManagement from '@/views/admin/UnifiedContentManagement.vue'
import CategoriesManagement from '@/views/admin/CategoriesManagement.vue'
import ReviewsManagement from '@/views/admin/ReviewsManagement.vue'

const router = useRouter()

// 当前激活的模块 - 默认显示游戏管理
const activeModule = ref('games')

// 弹窗控制
const showForm = ref(false)
const formContentType = ref('')
const editData = ref(null)
const isFormSubmitting = ref(false)



// 组件映射 - 使用统一的组件
const componentMap = {
  games: UnifiedContentManagement,
  movies: UnifiedContentManagement,
  tv: UnifiedContentManagement,
  news: UnifiedContentManagement
}

// 当前显示的组件 - 根据模块动态选择
const currentComponent = computed(() => {
  return componentMap[activeModule.value] || UnifiedContentManagement
})

// 处理模块切换
const handleModuleChange = (module) => {
  activeModule.value = module
}

// 处理编辑内容
const handleEditContent = (data) => {
  if (data === null) {
    // 添加模式
    editData.value = null
    formContentType.value = activeModule.value // 直接使用activeModule，不需要移除复数形式
    showForm.value = true
  } else {
    // 编辑模式
    editData.value = data
    formContentType.value = activeModule.value // 直接使用activeModule，不需要移除复数形式
    showForm.value = true
  }
}

// 处理删除内容
const handleDeleteContent = async (id) => {
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      alert('请先登录')
      return
    }

    const contentType = activeModule.value // 直接使用activeModule，不需要移除复数形式
    const apiUrl = `${getApiUrl('')}/api/${activeModule.value}/${id}`
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      alert('删除成功')
      // 刷新数据
      handleRefresh()
    } else {
      const errorData = await response.json()
      alert(`删除失败: ${errorData.message || response.statusText}`)
    }
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请重试')
  }
}

// 处理保存内容
const handleSaveContent = async (data) => {
  isFormSubmitting.value = true
  try {
    const token = localStorage.getItem('admin_token')

    if (!token) {
      alert('请先登录')
      return
    }

    let apiUrl, method

    if (editData.value) {
      // 编辑模式
      apiUrl = `${getApiUrl('')}/api/${activeModule.value}/${editData.value.id}`
      method = 'PUT'
    } else {
      // 添加模式
      apiUrl = `${getApiUrl('')}/api/${activeModule.value}`
      method = 'POST'
    }



    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      alert('保存成功！')
      closeForm()
      // 自动刷新数据
      window.dispatchEvent(new CustomEvent('refresh-data'))
      
      // 触发站点地图更新
      await updateSitemap()
    } else {
      // 检查是否是认证错误
      if (response.status === 401) {
        handleAuthTimeout()
        return
      }
      
      const errorText = await response.text()
      console.error('保存失败:', errorText)
      alert(`保存失败: ${errorText}`)
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert(`保存失败: ${error.message}`)
  } finally {
    isFormSubmitting.value = false
  }
}

// 关闭表单
const closeForm = () => {
  showForm.value = false
  editData.value = null
  formContentType.value = ''
  isFormSubmitting.value = false
}

// 刷新数据
const handleRefresh = () => {
  // 触发全局刷新事件
  window.dispatchEvent(new CustomEvent('refresh-data'))
}

// 处理认证超时
const handleAuthTimeout = () => {
  // 清除认证信息
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  
  // 显示提示并跳转到登录页面
  alert('登录已超时，请重新登录')
  router.push('/admin/login')
}

// 更新站点地图
const updateSitemap = async () => {
  try {
    console.log('🔄 触发站点地图更新...')
    
    // 调用后端API更新站点地图
    const response = await fetch(`${getApiUrl('')}/api/sitemap/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 站点地图更新成功:', result)
    } else {
      console.warn('⚠️ 站点地图更新失败:', response.status)
    }
  } catch (error) {
    console.warn('⚠️ 站点地图更新出错:', error)
    // 不显示错误给用户，因为这不是关键功能
  }
}

// 检查认证状态
onMounted(() => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
}

.admin-main {
  display: flex;
  min-height: calc(100vh - 80px); /* 减去顶部操作栏高度 */
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 主要内容区域样式 */
.main-content-area {
  width: 100%;
}

/* 评分评论管理区域样式 */
.rating-comments-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-top: 20px;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .admin-main {
    flex-direction: column;
  }
  
  .admin-content {
    padding: 10px;
  }
}
</style>
