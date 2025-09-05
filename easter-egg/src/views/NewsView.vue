<template>
  <div class="news-view">
    <!-- Header Component -->
    <Header />



    <!-- Hero Section -->
    <section class="hero-section">
      <!-- 背景装饰元素 -->
      <div class="hero-decorations">
        <div class="tech-circle tech-circle-1"></div>
        <div class="tech-circle tech-circle-2"></div>
        <div class="tech-circle tech-circle-3"></div>
      </div>

      <!-- Main Content -->
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-title-part-1">📰</span>
              <br />
              <span class="hero-title-part-2">Latest News</span>
            </h1>
            <p class="hero-description">
              Stay updated with the latest easter egg discoveries, community highlights, and vault announcements.
              From breaking discoveries to expert insights, get the scoop on everything happening in the world of hidden secrets.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- All News Section -->
    <section class="news-section">
      <div class="container">
        <!-- Loading State -->
        <div v-if="!isDataReady" class="loading-section">
          <div class="loading-text">Loading...</div>
        </div>

        <!-- 数据加载完成后的内容 -->
        <div v-else>
          <!-- 新闻列表 -->
          <div class="news-list">
            <div 
              v-for="newsItem in filteredNews" 
              :key="newsItem.id"
              class="news-item"
              @click="goToDetail(newsItem)"
            >
              <!-- 左侧图片 -->
              <div class="news-image">
                <img 
                  :src="newsItem.imageUrl" 
                  :alt="newsItem.title"
                  class="news-img"
                />
                <!-- <div class="news-categories">
                  <span 
                    v-for="tag in getValidClassifyTags(newsItem)" 
                    :key="tag" 
                    class="news-category-badge"
                  >
                    {{ tag }}
                  </span>
                </div> -->
              </div>
              
              <!-- 右侧内容 -->
              <div class="news-content">
                <h3 class="news-title">{{ newsItem.title }}</h3>
                <p class="news-description">{{ newsItem.description }}</p>
                
                <div class="news-meta">
                  <span class="news-date">{{ formatDate(newsItem.publishDate) }}</span>
                  <div class="news-tags">
                    <span 
                      v-for="tag in newsItem.classify.slice(0, 3)" 
                      :key="tag"
                      class="news-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                
                <div class="news-actions">
                  <button class="read-more-btn">Read More →</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="store.pagination.news && store.pagination.news.pages > 1" class="pagination">
            <button 
              :disabled="store.pagination.news.page <= 1"
              @click="changePage(store.pagination.news.page - 1)"
              class="page-button"
            >
              ← Previous
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in store.pagination.news.pages" 
                :key="page"
                :class="['page-number', { 'active': page === store.pagination.news.page }]"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              :disabled="store.pagination.news.page >= store.pagination.news.pages"
              @click="changePage(store.pagination.news.page + 1)"
              class="page-button"
            >
              Next →
            </button>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredNews.length === 0 && isDataReady" class="empty-state">
            <div class="empty-icon">📰</div>
            <h3>No News Found</h3>
            <p>There are no news articles available.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'

const router = useRouter()
const store = useEasterEggsStore()
// 使用store中的数据
const newsList = computed(() => store.news)

const filteredNews = computed(() => newsList.value)

const goToDetail = (newsItem) => {
  if (newsItem.addressBar) {
    router.push(`/news/${newsItem.addressBar}`)
  }
}

const changePage = (page) => {
  store.fetchNews({ page })
}

// 获取有效的分类标签数组
const getValidClassifyTags = (item) => {
  // 显示classify字段的所有有效标签
  if (item.classify && Array.isArray(item.classify)) {
    const validTags = item.classify.filter(tag => tag && tag.trim() !== '')
    if (validTags.length > 0) {
      return validTags
    }
  }
  
  // 如果没有有效的classify，则显示label字段
  if (item.label) {
    const labelValue = Array.isArray(item.label) ? item.label[0] : item.label
    return labelValue ? [labelValue] : []
  }
  
  // 默认显示媒体类型
  return ['NEWS']
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const isDataReady = computed(() => store.isDataLoaded('news'))

onMounted(async () => {
  // 等待数据预加载完成
  const waitForData = () => {
    if (isDataReady.value) {
    } else {
      // 使用更短的轮询间隔，提高响应速度
      setTimeout(waitForData, 50)
    }
  }
  
  waitForData()
})
</script>

<style scoped>
.news-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #100e19;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #100e19;
  background: linear-gradient(135deg, #100e19 0%, #0f172a 50%, #100e19 100%);
  margin-top: 0;
  padding-top: 80px;
}

/* 背景网格和渐变 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    /* 网格图案 */
    linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px),
    /* 径向渐变 */
    radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 0%, transparent 50%);
  background-size: 50px 50px, 50px 50px, auto, auto;
  background-position: 0 0, 0 0, 0 0, 0 0;
  opacity: 0.8;
  z-index: 0;
}

/* 装饰元素容器 */
.hero-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.tech-circle-1 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.1);
}

.tech-circle-2 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(6, 182, 212, 0.2);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
}

.tech-circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 72px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.1;
}

.hero-title-part-1 {
  font-size: 96px;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
}

.hero-title-part-2 {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.5));
}

.hero-description {
  font-size: 24px;
  color: #a0a0a0;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* News Section */
.news-section {
  padding: 80px 0;
  background-color: #0f172a;
}



/* News List */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 48px;
}

.news-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  border: 1px solid #334155;
  transition: all 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
  transform: translateY(-4px);
}

/* 左侧图片 */
.news-image {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-item:hover .news-img {
  transform: scale(1.05);
}

.news-category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  background: rgba(139, 92, 246, 0.9);
  color: #000;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 右侧内容 */
.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.3;
  color: #f5f5f5;
}

.news-description {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
  flex: 1;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.news-date {
  color: #64748b;
  font-size: 14px;
}

.news-tags {
  display: flex;
  gap: 8px;
}

.news-tag {
  padding: 4px 8px;
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.news-actions {
  display: flex;
  justify-content: flex-end;
}

.read-more-btn {
  padding: 10px 20px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
}

.page-button {
  padding: 12px 20px;
  background: transparent;
  border: 2px solid #334155;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.page-button:hover:not(:disabled) {
  border-color: #8b5cf6;
  color: #f5f5f5;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid #334155;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.page-number:hover {
  border-color: #8b5cf6;
  color: #f5f5f5;
}

.page-number.active {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  border-color: transparent;
  color: #000;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #f5f5f5;
}

.empty-state p {
  font-size: 16px;
  color: #64748b;
}

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .hero-section {
    min-height: 50vh;
    padding-top: 60px;
  }
  
  .hero-title {
    font-size: 60px;
  }
  
  .hero-title-part-1 {
    font-size: 80px;
  }
  
  .hero-description {
    font-size: 20px;
    margin-bottom: 28px;
  }
  
  .news-section {
    padding: 60px 0;
  }
  
  .news-list {
    gap: 28px;
    margin-bottom: 40px;
  }
  
  .news-item {
    gap: 28px;
    padding: 28px;
  }
  
  .news-image {
    width: 240px;
    height: 180px;
  }
  
  .news-title {
    font-size: 24px;
    margin-bottom: 14px;
  }
  
  .news-description {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .news-meta {
    margin-bottom: 16px;
  }
  
  .news-date {
    font-size: 16px;
  }
  
  .news-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .read-more-btn {
    padding: 8px 16px;
    font-size: 16px;
  }
  
  .pagination {
    margin-top: 40px;
    gap: 14px;
  }
  
  .page-button {
    padding: 10px 16px;
    font-size: 16px;
  }
  
  .page-number {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .empty-state {
    padding: 60px 16px;
  }
  
  .empty-icon {
    font-size: 56px;
    margin-bottom: 20px;
  }
  
  .empty-state h3 {
    font-size: 20px;
    margin-bottom: 14px;
  }
  
  .empty-state p {
    font-size: 16px;
  }
  
  .tech-circle-1 {
    width: 300px;
    height: 300px;
  }
  
  .tech-circle-2 {
    width: 250px;
    height: 250px;
  }
  
  .tech-circle-3 {
    width: 180px;
    height: 180px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .hero-section {
    min-height: 40vh;
    padding-top: 20px;
  }
  
  .hero-title {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .hero-title-part-1 {
    font-size: 24px;
  }
  
  .hero-description {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .news-section {
    padding: 20px 0;
  }
  
  .news-list {
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .news-item {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  
  .news-image {
    width: 100%;
    height: 160px;
  }
  
  .news-category-badge {
    font-size: 10px;
    padding: 4px 8px;
    top: 12px;
    left: 12px;
  }
  
  .news-title {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .news-description {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .news-meta {
    margin-bottom: 10px;
  }
  
  .news-date {
    font-size: 12px;
  }
  
  .news-tags {
    gap: 6px;
  }
  
  .news-tag {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .read-more-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  .page-button {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .page-numbers {
    gap: 6px;
  }
  
  .page-number {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .empty-state {
    padding: 40px 10px;
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .empty-state h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .empty-state p {
    font-size: 12px;
  }
  
  .tech-circle-1 {
    width: 200px;
    height: 200px;
  }
  
  .tech-circle-2 {
    width: 150px;
    height: 150px;
  }
  
  .tech-circle-3 {
    width: 120px;
    height: 120px;
  }
}
</style>