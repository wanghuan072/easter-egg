<template>
  <div class="detail-page">
    <Header />
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background" :style="{ backgroundImage: `url(${itemData?.imageUrl})` }">
        <div class="hero-overlay"></div>
        <div class="hero-grid"></div>
      </div>
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-section">
          <div class="loading-text">Loading...</div>
        </div>

        <!-- 数据加载完成后的内容 -->
        <div v-else-if="itemData" class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">{{ Array.isArray(itemData?.label) ? itemData.label[0] : itemData?.label }}</span>
          </div>
          <h1 class="hero-title">{{ itemData?.title }}</h1>
          <p class="hero-description">{{ itemData?.description }}</p>
          <div class="hero-meta">
            <span class="publish-date">{{ formatDate(itemData?.publishDate) }}</span>
            <div class="categories">
              <span 
                v-for="category in itemData?.classify" 
                :key="category" 
                class="category-tag"
              >
                {{ category }}
              </span>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else class="error-section">
          <div class="error-text">Failed to load content</div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section v-if="!isLoading && itemData" class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <!-- 详情内容 -->
          <div class="details-content">
            <!-- iframe 展示区域 -->
            <div class="iframe-container">
              <!-- 预览图片和播放按钮 -->
              <div v-if="!isIframeLoaded" class="iframe-preview" @click="loadIframe">
                <img 
                  :src="itemData?.imageUrl" 
                  :alt="itemData?.title"
                  class="preview-image"
                />
                <div class="preview-overlay">
                  <div class="play-button">
                    <div class="play-icon">▶</div>
                  </div>
                </div>
              </div>
              
              <!-- iframe 内容 -->
              <iframe 
                v-if="isIframeLoaded"
                :src="itemData?.iframeUrl" 
                frameborder="0"
                class="content-iframe"
                title="Content Display"
              ></iframe>
            </div>
            
            <div class="content-header">
              <h2>Content Details</h2>
            </div>
            <div class="content-body" v-html="itemData?.detailsHtml"></div>
          </div>

          <!-- 侧边栏 -->
          <aside class="sidebar">
            <!-- 相关信息 -->
            <div class="info-card">
              <h3>Related Information</h3>
              <div class="info-item">
                <span class="info-label">Publish Date:</span>
                <span class="info-value">{{ formatDate(itemData?.publishDate) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Categories:</span>
                <div class="info-tags">
                  <span 
                    v-for="category in itemData?.classify" 
                    :key="category" 
                    class="info-tag"
                  >
                    {{ category }}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-label">Labels:</span>
                <div class="info-tags">
                  <template v-if="Array.isArray(itemData?.label) && itemData.label.length > 0">
                    <span 
                      v-for="label in itemData.label" 
                      :key="label" 
                      class="info-tag"
                    >
                      {{ label }}
                    </span>
                  </template>
                  <span v-else-if="itemData?.label && !Array.isArray(itemData.label)" class="info-tag">
                    {{ itemData.label }}
                  </span>
                  <span v-else class="info-tag no-labels">No tags yet</span>
                </div>
              </div>
            </div>

            <!-- 评分评论系统 - 新闻不显示 -->
            <AnonymousReview 
              v-if="itemData?.id && contentType !== 'news'"
              :content-type="contentType"
              :content-id="itemData.id"
            />

          </aside>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>


import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { formatRelativeTime } from '../utils/dateUtils'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AnonymousReview from '../components/AnonymousReview.vue'
import { setPageTDK, resetPageTDK } from '@/seo/tdkManager.js'

const route = useRoute()

const props = defineProps({
  addressBar: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  }
})

// 从路由中获取内容类型
const contentType = computed(() => {
  // 优先使用props中的type
  if (props.type) {
    return props.type
  }
  
  // 如果没有props.type，则从路由推断
  const path = route.path
  if (path.startsWith('/games/')) return 'games'
  if (path.startsWith('/movies/')) return 'movies'
  if (path.startsWith('/tv/')) return 'tv'
  if (path.startsWith('/news/')) return 'news'
  return null
})

const itemData = ref(null)
const isLoading = ref(false)
const isIframeLoaded = ref(false)
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 加载iframe
const loadIframe = () => {
  isIframeLoaded.value = true
}

const fetchData = async () => {
  try {
    isLoading.value = true
    isIframeLoaded.value = false
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const type = contentType.value
    
    if (!type || !props.addressBar) {
      console.error('Missing required parameters:', { type, addressBar: props.addressBar })
      return
    }
    
    const apiUrl = `${apiBase}/api/${type}/${props.addressBar}`
    console.log('Fetching data from:', apiUrl)
    
    const res = await axios.get(apiUrl)
    
    if (!res.data) {
      throw new Error('Empty response')
    }
    
    const rawData = res.data.data || res.data
    console.log('Received data:', rawData)
    
    // Ensure label field is array format
    if (!rawData.label) {
      rawData.label = []
    } else if (!Array.isArray(rawData.label)) {
      // If still string (backward compatibility), convert to array
      rawData.label = [rawData.label]
    }
    
    itemData.value = rawData
    
    // Set page TDK with enhanced SEO - 不使用默认内容，直接使用后台数据
    setPageTDK({
      title: rawData.seoTitle || rawData.title,
      description: rawData.seoDescription || rawData.description,
      keywords: rawData.seoKeywords || rawData.classify?.join(', ') || '',
      imageUrl: rawData.imageUrl
    }, null, false)
  } catch (error) {
    console.error('Failed to fetch item details:', error)
    console.error('Error details:', {
      type: contentType.value,
      addressBar: props.addressBar,
      apiUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/${contentType.value}/${props.addressBar}`,
      errorMessage: error.message,
      errorResponse: error.response?.data,
      errorStatus: error.response?.status,
      errorStatusText: error.response?.statusText,
      errorConfig: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    })
    itemData.value = null
    
    // Reset page TDK
    resetPageTDK()
  } finally {
    isLoading.value = false
  }
}

// 监听路由参数变化，重新获取数据
watch(() => [props.addressBar], fetchData)

// 组件挂载时获取数据
onMounted(fetchData)

// Reset TDK when component unmounts
onUnmounted(() => {
  resetPageTDK()
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 60vh;
  padding-top: 80px;
  overflow: hidden;
  background-color: #100e19;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 14, 25, 0.7);
}

.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.6;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 120px 0 80px;
}

.hero-badge {
  margin-bottom: 24px;
}

.badge-text {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #ffffff, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  color: #a0a0a0;
  margin-bottom: 32px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.publish-date {
  color: #8b5cf6;
  font-weight: 600;
}

.categories {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-tag {
  padding: 6px 12px;
  background-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

/* Content Section */
.content-section {
  padding: 80px 0;
  background-color: #0f172a;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  align-items: start;
}

.details-content {
  background-color: #1e293b;
  border-radius: 16px;
  padding: 40px;
  border: 1px solid #334155;
}

.content-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #ffffff;
  border-bottom: 2px solid #8b5cf6;
  padding-bottom: 16px;
}

.content-body {
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  line-height: 1.7;
  color: #e2e8f0;
}

/* Content Body 内部标签样式 */
.content-body :deep(h2) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 32px 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #8b5cf6;
}

.content-body :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #8b5cf6;
  margin: 28px 0 14px 0;
}

.content-body :deep(h4) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin: 24px 0 12px 0;
}

.content-body :deep(h5) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #a78bfa;
  margin: 20px 0 10px 0;
  padding: 6px 10px;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 4px;
  border-left: 3px solid #a78bfa;
}

.content-body :deep(p) {
  font-size: 1rem;
  color: #e2e8f0;
  margin: 16px 0;
  line-height: 1.7;
  text-align: justify;
}

.content-body :deep(span) {
  color: inherit;
  font-size: inherit;
}

.content-body :deep(strong) {
  font-weight: 700;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.content-body :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
  color: #e2e8f0;
}

.content-body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
  color: #e2e8f0;
}

.content-body :deep(li) {
  margin: 8px 0;
  color: #e2e8f0;
}

.content-body :deep(a) {
  color: #06b6d4;
  text-decoration: none;
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
  padding: 2px 4px;
  border-radius: 3px;
}

.content-body :deep(a:hover) {
  color: #8b5cf6;
  border-bottom-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #334155;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.content-body :deep(img:hover) {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}

/* 代码块样式 */
.content-body :deep(pre) {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  color: #e2e8f0;
}

.content-body :deep(code) {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.content-body :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  color: #e2e8f0;
}

/* 引用块样式 */
.content-body :deep(blockquote) {
  border-left: 4px solid #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
  margin: 20px 0;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #a0a0a0;
  position: relative;
}

.content-body :deep(blockquote::before) {
  content: "";
  font-size: 3rem;
  color: #8b5cf6;
  position: absolute;
  top: -10px;
  left: 10px;
  opacity: 0.3;
}

/* 表格样式 */
.content-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
}

.content-body :deep(th),
.content-body :deep(td) {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #334155;
}

.content-body :deep(th) {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.5px;
}

.content-body :deep(td) {
  color: #e2e8f0;
}

.content-body :deep(tr:hover) {
  background: rgba(139, 92, 246, 0.05);
}

/* 分割线样式 */
.content-body :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  margin: 32px 0;
  border-radius: 1px;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .content-body :deep(h2) {
    font-size: 1.5rem;
    margin: 28px 0 14px 0;
    padding-bottom: 10px;
  }
  
  .content-body :deep(h3) {
    font-size: 1.3rem;
    margin: 24px 0 12px 0;
  }
  
  .content-body :deep(h4) {
    font-size: 1.1rem;
    margin: 20px 0 10px 0;
  }
  
  .content-body :deep(h5) {
    font-size: 1rem;
    margin: 18px 0 8px 0;
  }
  
  .content-body :deep(p) {
    font-size: 0.95rem;
    margin: 14px 0;
  }
  
  .content-body :deep(li) {
    margin: 6px 0;
  }
  
  .content-body :deep(ul),
  .content-body :deep(ol) {
    margin: 14px 0;
  }
  
  .content-body :deep(img) {
    margin: 16px 0;
  }
  
  .content-body :deep(pre) {
    padding: 12px;
    margin: 16px 0;
  }
  
  .content-body :deep(blockquote) {
    margin: 16px 0;
    padding: 12px 16px;
  }
  
  .content-body :deep(table) {
    margin: 16px 0;
  }
  
  .content-body :deep(th),
  .content-body :deep(td) {
    padding: 10px 12px;
  }
  
  .content-body :deep(hr) {
    margin: 24px 0;
  }
}

@media (max-width: 768px) {
  .content-body :deep(h2) {
    font-size: 20px;
    margin: 10px 0;
    padding-bottom: 8px;
  }
  
  .content-body :deep(h3) {
    font-size: 18px;
    margin: 10px 0;
  }
  
  .content-body :deep(h4) {
    font-size: 16px;
    margin: 10px 0;
  }
  
  .content-body :deep(h5) {
    font-size: 16px;
    margin: 10px 0;
  }
  
  .content-body :deep(p) {
    font-size: 12px;
    margin: 10px 0;
    line-height: 1.6;
  }
  
  .content-body :deep(li) {
    margin: 10px 0;
    font-size: 12px;
  }
  
  .content-body :deep(ul),
  .content-body :deep(ol) {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .content-body :deep(a) {
    font-size: 12px;
    padding: 1px 3px;
  }
  
  .content-body :deep(img) {
    margin: 10px 0;
    border-radius: 6px;
  }
  
  .content-body :deep(pre) {
    padding: 8px;
    margin: 10px 0;
    font-size: 10px;
  }
  
  .content-body :deep(code) {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .content-body :deep(blockquote) {
    margin: 10px 0;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .content-body :deep(blockquote::before) {
    font-size: 2rem;
    top: -8px;
    left: 8px;
  }
  
  .content-body :deep(table) {
    margin: 10px 0;
    font-size: 10px;
  }
  
  .content-body :deep(th),
  .content-body :deep(td) {
    padding: 6px 8px;
  }
  
  .content-body :deep(hr) {
    margin: 10px 0;
  }
}


/* iframe 样式 */
.iframe-container {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #334155;
  background-color: #0f172a;
}

.content-iframe {
  width: 100%;
  height: 500px;
  border: none;
  display: block;
}

/* 预览图片和播放按钮样式 */
.iframe-preview {
  position: relative;
  width: 100%;
  height: 500px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.9);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
}

.play-icon {
  font-size: 24px;
  color: #ffffff;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* 只有播放按钮的悬停效果 */
.play-button:hover {
  transform: scale(1.1);
  background: rgba(139, 92, 246, 1);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.6);
}

/* Loading and Error States */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 80px 0;
}

.loading-text {
  font-size: 24px;
  color: #8b5cf6;
  font-weight: 600;
  text-align: center;
}

.error-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 80px 0;
}

.error-text {
  font-size: 24px;
  color: #ef4444;
  font-weight: 600;
  text-align: center;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 32px;
}



.info-card {
  background-color: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #334155;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
  border-bottom: 1px solid #334155;
  padding-bottom: 12px;
}

.info-item {
  margin-bottom: 20px;
}

.info-label {
  display: block;
  font-weight: 600;
  color: #8b5cf6;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-value {
  color: #e2e8f0;
  font-size: 16px;
}

.info-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-tag {
  padding: 4px 8px;
  background-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}



/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .hero-section {
    min-height: 50vh;
    padding-top: 60px;
  }
  
  .hero-content {
    padding: 100px 0 60px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
    margin-bottom: 28px;
  }
  
  .hero-meta {
    gap: 28px;
  }
  
  .badge-text {
    font-size: 16px;
    padding: 6px 14px;
  }
  
  .category-tag {
    font-size: 16px;
    padding: 5px 10px;
  }
  
  .publish-date {
    font-size: 16px;
  }
  
  .content-section {
    padding: 60px 0;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .details-content {
    padding: 32px;
  }
  
  .content-header h2 {
    font-size: 1.75rem;
    margin-bottom: 28px;
    padding-bottom: 14px;
  }
  
  .iframe-container {
    margin-bottom: 32px;
  }
  
  .content-iframe {
    height: 400px;
  }
  
  .iframe-preview {
    height: 400px;
  }
  
  .play-button {
    width: 70px;
    height: 70px;
  }
  
  .play-icon {
    font-size: 20px;
  }
  
  .sidebar {
    gap: 28px;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .info-card h3 {
    font-size: 1.1rem;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
  
  .info-item {
    margin-bottom: 16px;
  }
  
  .info-label {
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .info-value {
    font-size: 16px;
  }
  
  .info-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .loading-text {
    font-size: 20px;
  }
  
  .error-text {
    font-size: 20px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .hero-section {
    min-height: 40vh;
    padding-top: 20px;
  }
  
  .hero-content {
    padding: 60px 0 40px;
  }
  
  .hero-badge {
    margin-bottom: 10px;
  }
  
  .badge-text {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .hero-title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .hero-description {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .hero-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .publish-date {
    font-size: 12px;
  }
  
  .categories {
    gap: 8px;
    justify-content: center;
  }
  
  .category-tag {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  .content-section {
    padding: 20px 0;
  }
  
  .content-wrapper {
    gap: 20px;
  }
  
  .details-content {
    padding: 20px;
  }
  
  .content-header h2 {
    font-size: 16px;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  
  .iframe-container {
    margin-bottom: 20px;
  }
  
  .content-iframe {
    height: 300px;
  }
  
  .iframe-preview {
    height: 300px;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
  
  .play-icon {
    font-size: 18px;
  }
  
  .sidebar {
    gap: 20px;
  }
  
  .info-card {
    padding: 16px;
  }
  
  .info-card h3 {
    font-size: 16px;
    margin-bottom: 12px;
    padding-bottom: 8px;
  }
  
  .info-item {
    margin-bottom: 12px;
  }
  
  .info-label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .info-value {
    font-size: 12px;
  }
  
  .info-tags {
    gap: 6px;
  }
  
  .info-tag {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .loading-section {
    min-height: 40vh;
    padding: 40px 0;
  }
  
  .loading-text {
    font-size: 12px;
  }
  
  .error-section {
    min-height: 40vh;
    padding: 40px 0;
  }
  
  .error-text {
    font-size: 12px;
  }
}
</style>
