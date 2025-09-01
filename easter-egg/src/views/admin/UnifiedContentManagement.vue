<template>
  <div class="unified-content-management">
    <div class="page-header">
      <h1>{{ pageConfig.icon }} {{ pageConfig.title }}</h1>
      <p class="page-description">{{ pageConfig.description }}</p>
    </div>
    
    <div class="content-container">

      
      <!-- 内容列表 -->
      <div class="content-list">
        <div class="list-header">
          <h2>{{ pageConfig.contentName }}列表</h2>
          <div class="list-actions">
            <button class="add-btn" @click="handleAddContent">
              {{ pageConfig.icon }} 添加{{ pageConfig.contentName }}
            </button>
            <span class="total-count">共 {{ contentList.length }} 条记录</span>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载{{ pageConfig.contentName }}数据...</p>
        </div>
        
        <div v-else-if="contentList.length === 0" class="empty-state">
          <div class="empty-icon">{{ pageConfig.icon }}</div>
          <h3>暂无{{ pageConfig.contentName }}数据</h3>
          <p>点击顶部"添加{{ pageConfig.contentName }}"按钮开始创建第一个{{ pageConfig.contentName }}</p>
        </div>
        
        <div v-else class="content-table">
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
              <tr v-for="item in contentList" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ formatDate(item.publishDate) }}</td>
                <td>
                  <span v-if="pageConfig.supportsLatest && item.isLatest" class="status-badge latest">最新</span>
                  <span v-if="item.isHome" class="status-badge home">首页</span>
                </td>
                <td>
                  <button 
                    class="action-btn edit"
                    @click="$emit('edit-content', transformDataForForm(item))"
                    :title="`编辑${pageConfig.contentName}`"
                  >
                    ✏️ 编辑
                  </button>
                  <button 
                    class="action-btn delete"
                    @click="handleDeleteContent(item.id)"
                    :title="`删除${pageConfig.contentName}`"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getApiUrl } from '@/config/env.js'

// 定义props
const props = defineProps({
  contentType: {
    type: String,
    required: true,
    validator: (value) => ['games', 'movies', 'tv', 'news'].includes(value)
  }
})

const emit = defineEmits(['edit-content', 'delete-content', 'refresh'])

// 页面配置映射
const pageConfigs = {
  games: {
    title: '游戏管理',
    contentName: '游戏',
    description: '管理所有游戏内容，包括添加、编辑和删除操作',
    icon: '🎮',
    supportsLatest: true,
    apiEndpoint: '/api/games'
  },
  movies: {
    title: '电影管理',
    contentName: '电影',
    description: '管理所有电影内容，包括添加、编辑和删除操作',
    icon: '🎬',
    supportsLatest: true,
    apiEndpoint: '/api/movies'
  },
  tv: {
    title: '电视管理',
    contentName: '电视节目',
    description: '管理所有电视节目内容，包括添加、编辑和删除操作',
    icon: '📺',
    supportsLatest: true,
    apiEndpoint: '/api/tv'
  },
  news: {
    title: '新闻管理',
    contentName: '新闻',
    description: '管理所有新闻内容，包括添加、编辑和删除操作',
    icon: '📰',
    supportsLatest: true,
    apiEndpoint: '/api/news'
  }
}

// 计算当前页面配置
const pageConfig = computed(() => {
  if (!props.contentType) {
    return pageConfigs.games
  }
  
  const config = pageConfigs[props.contentType]
  if (!config) {
    return pageConfigs.games
  }
  
  return config
})

// 状态数据
const contentList = ref([])
const isLoading = ref(false)


// 数据转换函数 - 将后端驼峰命名转换为表单下划线命名
const transformDataForForm = (item) => {
  
  // 日期格式转换：处理各种日期格式
  let publishDate = ''
  if (item.publishDate) {
    try {
      let date
      
      // 检查是否为PostgreSQL date类型返回的字符串格式
      if (typeof item.publishDate === 'string' && item.publishDate.includes('GMT')) {
        // PostgreSQL date类型返回的格式，直接提取日期部分
        const match = item.publishDate.match(/(\w{3})\s+(\w{3})\s+(\d{1,2})\s+(\d{4})/)
        if (match) {
          const [, , month, day, year] = match
          const monthNames = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          }
          const monthNum = monthNames[month]
          if (monthNum) {
            publishDate = `${year}-${monthNum}-${day.padStart(2, '0')}`
          }
        }
      }
      
      // 如果上面的方法失败，尝试标准日期解析
      if (!publishDate) {
        date = new Date(item.publishDate)
        if (!isNaN(date.getTime())) {
          publishDate = date.toISOString().split('T')[0]
        }
      }
      

      
    } catch (error) {
      console.warn('日期转换失败:', error)
    }
  }
  
  const transformed = {
    id: item.id,
    title: item.title,
    description: item.description,
    publish_date: publishDate,
    is_latest: item.isLatest || false,
    is_home: item.isHome || false,
    label: item.label || '',
    classify: item.classify || [],
    image_url: item.imageUrl || '',
    image_alt: item.imageAlt || '',
    address_bar: item.addressBar || '',
    iframe_url: item.iframeUrl || '',
    seo_title: item.seoTitle || '',
    seo_description: item.seoDescription || '',
    seo_keywords: item.seoKeywords || '',
    details_html: item.detailsHtml || ''
  }
  

  
  return transformed
}

// 加载内容数据
const loadContent = async () => {
  
  try {
    isLoading.value = true
    
    const token = localStorage.getItem('admin_token')
    const response = await fetch(getApiUrl(pageConfig.value.apiEndpoint), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      contentList.value = data.data || []
      

      

    } else {
      console.error(`加载${pageConfig.value.contentName}失败:`, response.statusText)
    }
  } catch (error) {
    console.error(`加载${pageConfig.value.contentName}错误:`, error)
  } finally {
    isLoading.value = false
  }
}

// 添加内容
const handleAddContent = () => {
  emit('edit-content', null) // 传递null表示添加模式
}

// 删除内容
const handleDeleteContent = async (contentId) => {
  if (!confirm(`确定要删除这个${pageConfig.value.contentName}吗？此操作不可恢复。`)) {
    return
  }
  
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(getApiUrl(`${pageConfig.value.apiEndpoint}/${contentId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      // 从列表中移除
      contentList.value = contentList.value.filter(item => item.id !== contentId)
      
      // 重新计算统计
      stats.value = {
        total: contentList.value.length,
        home: contentList.value.filter(item => item.isHome).length,
        latest: pageConfig.value.supportsLatest 
          ? contentList.value.filter(item => item.isLatest).length 
          : 0
      }
      
      // 发送刷新事件
      emit('refresh')
    } else {
      alert('删除失败，请重试')
    }
  } catch (error) {
    console.error(`删除${pageConfig.value.contentName}错误:`, error)
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

// 监听contentType变化，重新加载数据
watch(() => props.contentType, () => {
  loadContent()
})

// 组件挂载时加载数据
onMounted(() => {
  loadContent()
  
  // 监听刷新事件
  window.addEventListener('refresh-data', loadContent)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('refresh-data', loadContent)
})
</script>

<style scoped>
.unified-content-management {
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

/* 统计卡片 */




/* 内容列表 */
.content-list {
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

.list-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.total-count {
  color: #666;
  font-size: 0.9rem;
}

/* 加载状态 */
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

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* 表格样式 */
.content-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 操作按钮 */
.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
}

.action-btn.edit {
  background: #17a2b8;
  color: white;
}

.action-btn.edit:hover {
  background: #138496;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.delete:hover {
  background: #c82333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unified-content-management {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  

  
  .list-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .add-btn {
    width: 100%;
  }
}
</style>
