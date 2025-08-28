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
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">{{ itemData?.label }}</span>
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
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <!-- 详情内容 -->
          <div class="details-content">
            <!-- iframe 展示区域 -->
            <div class="iframe-container">
              <iframe 
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
                <span class="info-label">Label:</span>
                <span class="info-value">{{ itemData?.label }}</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { gamesData } from '@/data/gamesVideo.js'
import { moviesData } from '@/data/moviesVideo.js'
import { tvData } from '@/data/tvVideo.js'
import { formatRelativeTime } from '@/utils/dateUtils.js'

const router = useRouter()

// 格式化日期函数
const formatDate = formatRelativeTime

// 接收路由传递的props参数
const props = defineProps({
  type: {
    type: String,
    required: true
  },
  addressBar: {
    type: String,
    required: true
  }
})

// 根据props获取数据类型和addressBar
const dataType = computed(() => props.type)
const addressBar = computed(() => props.addressBar)

// 根据数据类型获取对应的数据源
const dataSource = computed(() => {
  switch (dataType.value) {
    case 'games':
      return gamesData
    case 'movies':
      return moviesData
    case 'tv':
      return tvData
    default:
      return []
  }
})

// 获取当前项目数据
const itemData = computed(() => {
  return dataSource.value.find(item => item.addressBar === addressBar.value)
})

// 设置页面标题和SEO
const setPageSEO = () => {
  if (itemData.value?.seo) {
    document.title = itemData.value.seo.title
    // 设置meta描述
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = itemData.value.seo.description
    
    // 设置meta关键词
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.content = itemData.value.seo.keywords
  }
}

// 监听数据变化，设置SEO
watch(itemData, () => {
  setPageSEO()
}, { immediate: true })

// 组件挂载时设置SEO
onMounted(() => {
  setPageSEO()
  
  // 如果找不到数据，重定向到首页
  if (!itemData.value) {
    router.push('/')
  }
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
  text-transform: uppercase;
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
  line-height: 1.8;
  color: #e2e8f0;
}

.content-body h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 32px 0 16px;
  color: #ffffff;
}

.content-body h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #f1f5f9;
}

.content-body p {
  margin-bottom: 16px;
  font-size: 1.1rem;
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



/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 80px 0 60px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-meta {
    flex-direction: column;
    gap: 20px;
  }
  
  .details-content {
    padding: 24px;
  }
  
  .content-header h2 {
    font-size: 1.5rem;
  }
}
</style>
