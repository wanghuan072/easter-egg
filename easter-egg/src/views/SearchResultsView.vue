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
            Search Results for "<span class="highlight">{{ searchQuery }}</span>"
          </h1>
          <p class="search-subtitle">
            Found {{ totalResults }} results
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading('search')" class="loading-section">
          <div class="loading-spinner"></div>
          <p>Searching for easter eggs...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError('search')" class="error-section">
          <p>⚠️ {{ hasError('search') }}</p>
          <button @click="retrySearch" class="retry-button">Retry Search</button>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchResults.length > 0" class="search-results">
          <!-- Filters -->
          <div class="search-filters">
            <div class="filter-group">
              <label>Media Type:</label>
              <select v-model="selectedMediaType" @change="applyFilters">
                <option value="">All Types</option>
                <option value="game">Games</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
                <option value="news">News</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Sort By:</label>
              <select v-model="sortBy" @change="applyFilters">
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

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
                      v-for="tag in item.classify.slice(0, 3)" 
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
              Previous
            </button>
            
            <span class="page-info">
              Page {{ pagination.page }} of {{ pagination.pages }}
            </span>
            
            <button 
              :disabled="pagination.page >= pagination.pages"
              @click="changePage(pagination.page + 1)"
              class="page-button"
            >
              Next
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <div class="no-results-icon">🔍</div>
          <h2>No results found</h2>
          <p>Try adjusting your search terms or browse our categories:</p>
          <div class="suggested-categories">
            <router-link to="/games" class="category-link">🎮 Games</router-link>
            <router-link to="/movies" class="category-link">🎬 Movies</router-link>
            <router-link to="/tv" class="category-link">📺 TV Shows</router-link>
            <router-link to="/news" class="category-link">📰 News</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'

// 使用路由
const route = useRoute()
const router = useRouter()

// 使用状态管理
const store = useEasterEggsStore()

// 响应式数据
const selectedMediaType = ref('')
const sortBy = ref('relevance')

// 计算属性
const searchQuery = computed(() => route.query.q || '')
const searchResults = computed(() => store.getSearchResults)
const pagination = computed(() => store.getSearchResults?.pagination)
const totalResults = computed(() => pagination.value?.total || 0)
const isLoading = computed(() => store.isLoading)
const hasError = computed(() => store.hasError)

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 获取媒体类型（安全处理）
const getMediaType = (item) => {
  // 如果item有mediaType字段，直接返回
  if (item.mediaType) {
    return item.mediaType
  }
  
  // 根据label字段推断媒体类型
  if (item.label) {
    switch (item.label.toUpperCase()) {
      case 'GAME':
        return 'game'
      case 'MOVIE':
        return 'movie'
      case 'TV':
        return 'tv'
      case 'NEWS':
        return 'news'
      default:
        return 'unknown'
    }
  }
  
  // 默认返回unknown
  return 'unknown'
}

// 应用过滤器
const applyFilters = async () => {
  if (!searchQuery.value) return
  
  const params = {}
  if (selectedMediaType.value) {
    params.mediaType = selectedMediaType.value
  }
  if (sortBy.value !== 'relevance') {
    params.sort = sortBy.value
  }
  
  await store.search(searchQuery.value, params)
}

// 重试搜索
const retrySearch = async () => {
  store.clearError('search')
  await performSearch()
}

// 执行搜索
const performSearch = async () => {
  if (!searchQuery.value) return
  
  try {
    await store.search(searchQuery.value)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

// 切换页面
const changePage = async (page) => {
  if (!searchQuery.value) return
  
  const params = { page }
  if (selectedMediaType.value) {
    params.mediaType = selectedMediaType.value
  }
  if (sortBy.value !== 'relevance') {
    params.sort = sortBy.value
  }
  
  await store.search(searchQuery.value, params)
  
  // 更新URL参数
  router.push({
    query: { ...route.query, page }
  })
}

// 跳转到详情页
const goToDetail = (item) => {
  const mediaType = getMediaType(item)
  const routeName = `${mediaType}-detail`
  const addressBar = item.addressBar
  
  router.push({
    name: routeName,
    params: { addressBar }
  })
}

// 监听搜索查询变化
watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== store.search.query) {
    performSearch()
  }
})

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
  padding: 60px 0 40px;
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

/* Search Filters */
.search-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #d1d5db;
}

.filter-group select {
  padding: 8px 16px;
  border: 1px solid #374151;
  border-radius: 6px;
  background: #1f2937;
  color: #f5f5f5;
  font-size: 14px;
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #f5f5f5;
}

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

/* Responsive Design */
@media (max-width: 768px) {
  .search-title {
    font-size: 32px;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .search-filters {
    flex-direction: column;
    align-items: center;
  }
  
  .suggested-categories {
    flex-direction: column;
    align-items: center;
  }
}
</style>
