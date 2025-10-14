<template>
  <div class="search-results-view">
    <!-- Header Component -->
    <Header />



    <!-- Search Results Section -->
    <section class="search-results-section">
      <div class="container">
        <!-- Search Header -->
        <div class="search-header">
          <h1 class="search-title">
            {{ $t('SearchResultsPage.resultsFor') }} "<span class="highlight">{{ searchQuery }}</span>"
          </h1>
          <p class="search-subtitle">
            {{ totalResults }} {{ $t('SearchResultsPage.resultsFor').toLowerCase() }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="store.isLoading.search" class="loading-section">
          <div class="loading-text">{{ $t('common.searching') }}</div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="error-section">
          <p>⚠️ {{ hasError }}</p>
          <button @click="retrySearch" class="retry-button">{{ $t('common.retry') }}</button>
        </div>

  <!-- Search Results -->
  <div v-else-if="Array.isArray(searchResults) ? searchResults.length > 0 : searchResults && searchResults.value && searchResults.value.length > 0" class="search-results">


          <!-- Results Grid -->
          <div class="results-grid">
            <div 
              v-for="item in searchResults" 
              :key="`${getMediaType(item)}-${item.id}`"
              class="result-card"
              @click="goToDetail(item)"
            >
              <div class="result-image">
                <img :src="item.imageUrl" :alt="item.imageAlt" />
                <div class="media-type-badge">{{ getMediaType(item).toUpperCase() }}</div>
              </div>
              
              <div class="result-content">
                <h3 class="result-title">{{ item.title }}</h3>
                <p class="result-description">{{ item.description }}</p>
                
                <div class="result-meta">
                  <span class="result-date">{{ formatDate(item.publishDate) }}</span>
                  <div class="result-tags">
                    <span 
                      v-for="tag in getValidTags(item.classify)" 
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.pages > 1" class="pagination">
            <button 
              :disabled="pagination.page <= 1"
              @click="changePage(pagination.page - 1)"
              class="page-button"
            >
              {{ $t('common.viewAll') }}
            </button>
            
            <span class="page-info">
              {{ pagination.page }} / {{ pagination.pages }}
            </span>
            
            <button 
              :disabled="pagination.page >= pagination.pages"
              @click="changePage(pagination.page + 1)"
              class="page-button"
            >
              {{ $t('common.loadMore') }}
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <div class="no-results-icon">🔍</div>
          <h2>{{ $t('SearchResultsPage.noResults') }}</h2>
          <p>{{ $t('SearchResultsPage.tryDifferent') }}</p>
          <div class="suggested-categories">
            <a href="/games" class="category-link">🎮 {{ $t('nav.videoGames') }}</a>
            <a href="/movies" class="category-link">🎬 {{ $t('nav.movies') }}</a>
            <a href="/tv" class="category-link">📺 {{ $t('nav.tvShows') }}</a>
            <!-- News 相关链接已移除 -->
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import { dataUtils } from '@/config/dataStructure.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'


// 日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 使用路由
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

// 使用状态管理
const store = useEasterEggsStore()



// 计算属性 - 从store获取
const searchQuery = computed(() => route.query.q || '')
const searchResults = computed(() => store.searchResults)
const pagination = computed(() => store.pagination.search)
const totalResults = computed(() => searchResults.value.length)
const isLoading = computed(() => store.isLoading.search)
const hasError = computed(() => store.errors.search)

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value) return
  await store.performSearch(searchQuery.value, {})
}



// 获取有效的标签
const getValidTags = (classify) => {
  if (!classify || !Array.isArray(classify)) return []
  return classify.filter(tag => tag && tag.trim() !== '').slice(0, 3)
}

// 获取媒体类型 - 根据搜索结果的实际来源判断
const getMediaType = (item) => {
  // 优先使用 media_type 字段
  if (item.mediaType) {
    switch (item.mediaType.toLowerCase()) {
      case 'games':
      case 'game':
        return 'games'
      case 'movies':
      case 'movie':
        return 'movies'
      case 'tv':
      case 'tvshow':
        return 'tv'
      case 'news':
        return 'news'
    }
  }
  
  // 其次使用 label 字段
  if (item.label) {
    let labelValue = item.label
    if (Array.isArray(labelValue)) {
      labelValue = labelValue[0]
    }
    if (typeof labelValue === 'string') {
      switch (labelValue.toUpperCase()) {
        case 'GAME':
          return 'games'
        case 'MOVIE':
          return 'movies'
        case 'TV':
          return 'tv'
        case 'NEWS':
          return 'news'
      }
    }
  }
  
  // 根据标题内容推断类型
  const title = item.title?.toLowerCase() || ''
  
  // 电视剧关键词
  const tvKeywords = [
    'breaking bad', 'bridgerton', 'stranger things', 'sopranos', 'black mirror',
    'season', 'episode', 'series', 'show', 'tv', 'television', 'netflix', 'hbo',
    'amazon prime', 'disney+', 'hulu', 'streaming', 'drama', 'comedy', 'thriller'
  ]
  
  // 游戏关键词
  const gameKeywords = [
    'game', 'play', 'level', 'player', 'gaming', 'console', 'pc', 'xbox', 'playstation',
    'nintendo', 'steam', 'mobile game', 'rpg', 'fps', 'strategy', 'puzzle'
  ]
  
  // 电影关键词
  const movieKeywords = [
    'movie', 'film', 'cinema', 'theater', 'blockbuster', 'hollywood', 'director',
    'actor', 'actress', 'oscar', 'award', 'premiere', 'release'
  ]
  
  // 新闻关键词
  const newsKeywords = [
    'news', 'update', 'announcement', 'report', 'breaking', 'latest', 'trending'
  ]
  
  // 检查电视剧关键词
  if (tvKeywords.some(keyword => title.includes(keyword))) {
    return 'tv'
  }
  
  // 检查游戏关键词
  if (gameKeywords.some(keyword => title.includes(keyword))) {
    return 'games'
  }
  
  // 检查电影关键词
  if (movieKeywords.some(keyword => title.includes(keyword))) {
    return 'movies'
  }
  
  // 检查新闻关键词
  if (newsKeywords.some(keyword => title.includes(keyword))) {
    return 'news'
  }
  
  // 默认返回 games
  return 'games'
}

// 重试搜索
const retrySearch = async () => {
  store.clearError('search')
  await performSearch()
}

// 切换页面
const changePage = async (page) => {
  if (!searchQuery.value) return
  
  const params = { page }
  await store.performSearch(searchQuery.value, params)
  
  // 更新URL参数
  router.push({
    query: { ...route.query, page }
  })
}

// 跳转到详情页
const goToDetail = (item) => {
  try {
    // 获取媒体类型
    const type = getMediaType(item)
    
    // 获取 addressBar - 优先使用现有的addressBar字段
    let addressBar = item.addressBar || item.address_bar
    
    // 如果没有addressBar，尝试从title生成
    if (!addressBar && item.title) {
      addressBar = item.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, '') // 移除特殊字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/^-+|-+$/g, '') // 移除首尾连字符
    }
    
    // 如果还是没有，使用ID
    if (!addressBar && item.id) {
      addressBar = item.id.toString()
    }
    
    if (!addressBar) {
      console.error('No valid addressBar available:', item)
      return
    }
    
    // 根据类型确定基础路由名称
    let baseRouteName
    switch (type) {
      case 'games':
        baseRouteName = 'GameDetail'
        break
      case 'movies':
        baseRouteName = 'MovieDetail'
        break
      case 'tv':
        baseRouteName = 'TVDetail'
        break
      case 'news':
        baseRouteName = 'NewsDetail'
        break
      default:
        baseRouteName = 'GameDetail'
    }
    
    // 根据当前语言构建路由名称
    const currentLang = locale.value
    const routeName = currentLang === 'en' 
      ? baseRouteName 
      : `${baseRouteName}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`
    
    console.log('Navigating to:', routeName, 'with addressBar:', addressBar)
    
    // 使用命名路由导航
    router.push({
      name: routeName,
      params: {
        addressBar
      }
    })
  } catch (error) {
    console.error('Navigation error:', error, 'for item:', item)
  }
}

// 监听搜索查询变化
watch(
  () => route.query.q,
  async (newQuery) => {
    try {
      if (newQuery && newQuery !== store.searchState.query) {
        await performSearch()
      }
    } catch (error) {
      console.error('Error in search query watcher:', error)
    }
  }
)

// 组件挂载时执行搜索
onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
})
</script>

<style scoped>
.search-results-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #100e19;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Search Header */
.search-header {
  text-align: center;
  padding: 100px 0 40px;
}

.search-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-subtitle {
  font-size: 20px;
  color: #a0a0a0;
}



/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.result-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-4px);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.result-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.result-card:hover .result-image img {
  transform: scale(1.05);
}

.media-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.result-content {
  padding: 20px;
}

.result-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  color: #f5f5f5;
}

.result-description {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 回退方案 */
  max-height: 4.8em; /* line-height * 3 lines */
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.result-date {
  color: #6b7280;
}

.result-tags {
  display: flex;
  gap: 6px;
}

.tag {
  background: #374151;
  color: #d1d5db;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-button {
  background: #374151;
  color: #f5f5f5;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.page-button:hover:not(:disabled) {
  background: #4b5563;
  transform: scale(1.05);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #a0a0a0;
  font-weight: 600;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.no-results h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #f5f5f5;
}

.no-results p {
  color: #a0a0a0;
  margin-bottom: 32px;
  font-size: 18px;
}

.suggested-categories {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-link {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.category-link:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

/* Loading and Error States */


.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #334155;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.error-section {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #fca5a5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 20px 0;
}

.retry-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #b91c1c;
  transform: scale(1.05);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .search-header {
    padding: 50px 0 32px;
  }
  
  .search-title {
    font-size: 40px;
    margin-bottom: 14px;
  }
  
  .search-subtitle {
    font-size: 18px;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .result-image {
    height: 180px;
  }
  
  .media-type-badge {
    top: 10px;
    right: 10px;
    padding: 3px 6px;
    font-size: 16px;
  }
  
  .result-content {
    padding: 16px;
  }
  
  .result-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .result-description {
    font-size: 16px;
    margin-bottom: 14px;
    max-height: 4.2em;
  }
  
  .result-meta {
    font-size: 16px;
  }
  
  .result-tags {
    gap: 5px;
  }
  
  .tag {
    padding: 2px 6px;
    font-size: 10px;
  }
  
  .pagination {
    gap: 16px;
    margin-top: 32px;
  }
  
  .page-button {
    padding: 8px 16px;
    font-size: 16px;
  }
  
  .page-info {
    font-size: 16px;
  }
  
  .no-results {
    padding: 60px 16px;
  }
  
  .no-results-icon {
    font-size: 56px;
    margin-bottom: 20px;
  }
  
  .no-results h2 {
    font-size: 28px;
    margin-bottom: 14px;
  }
  
  .no-results p {
    font-size: 16px;
    margin-bottom: 28px;
  }
  
  .suggested-categories {
    gap: 14px;
  }
  
  .category-link {
    padding: 10px 20px;
    font-size: 16px;
  }
  
  .error-section {
    padding: 16px;
    margin: 16px 0;
    font-size: 16px;
  }
  
  .retry-button {
    padding: 6px 14px;
    font-size: 16px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .search-header {
    padding: 40px 0 20px;
  }
  
  .search-title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .search-subtitle {
    font-size: 12px;
  }
  
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .result-image {
    height: 160px;
  }
  
  .media-type-badge {
    top: 8px;
    right: 8px;
    padding: 3px 6px;
    font-size: 12px;
  }
  
  .result-content {
    padding: 20px;
  }
  
  .result-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .result-description {
    font-size: 12px;
    margin-bottom: 16px;
    max-height: 3.6em;
  }
  
  .result-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
  }
  
  .result-tags {
    gap: 4px;
  }
  
  .tag {
    padding: 2px 6px;
    font-size: 10px;
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
  
  .page-info {
    font-size: 12px;
  }
  
  .no-results {
    padding: 40px 10px;
  }
  
  .no-results-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .no-results h2 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .no-results p {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .suggested-categories {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .category-link {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .error-section {
    padding: 12px;
    margin: 10px 0;
    font-size: 12px;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
