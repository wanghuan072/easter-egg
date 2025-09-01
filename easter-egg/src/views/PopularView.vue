<template>
  <div class="popular-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Popular</span> Discoveries
          </h1>
          <p class="hero-description">
            The most popular and trending easter eggs, hidden secrets, and discoveries from our community.
          </p>
        </div>
      </div>
    </section>

    <!-- Popular Content Section -->
    <section class="popular-content-section">
      <div class="container">
        <div v-if="!isLatestDiscoveriesLoaded" class="loading-section">
          <div class="loading-text">Loading popular content...</div>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">Retry</button>
        </div>
        
        <div v-else>
          <div class="section-header">
            <h2 class="section-title">Most <span class="gradient-text">Popular</span> Content</h2>
            <p class="section-description">
              Discover the most popular easter eggs and hidden secrets that our community loves.
            </p>
          </div>
          
          <MediaList 
            type="popular"
            :data="latestDiscoveries"
            :show-more-button="false"
          />
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MediaList from '@/components/MediaList.vue'

const store = useEasterEggsStore()

// 计算属性
const latestDiscoveries = computed(() => store.latestDiscoveries)
const isLatestDiscoveriesLoaded = computed(() => store.isDataLoaded('latestDiscoveries'))

// 方法
const retryFetch = async () => {
  await store.fetchLatestDiscoveries(8) // 获取更多内容用于Popular页面
}

// 生命周期
onMounted(async () => {
  if (!isLatestDiscoveriesLoaded.value) {
    await store.fetchLatestDiscoveries(8) // 获取更多内容用于Popular页面
  }
})
</script>

<style scoped>
.popular-view {
  min-height: 100vh;
  background-color: #0f172a;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23334155" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.1;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 24px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
}

.hero-description {
  font-size: 1.25rem;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

/* Popular Content Section */
.popular-content-section {
  padding: 60px 0;
  background-color: #0f172a;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
}

.section-description {
  font-size: 1.125rem;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Loading and Error States */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin: 20px 0;
}

.loading-text {
  font-size: 18px;
  color: #888;
  font-weight: 500;
}

.error-section {
  text-align: center;
  padding: 40px 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  margin: 20px 0;
}

.error-section p {
  color: #ef4444;
  margin-bottom: 16px;
  font-size: 16px;
}

.retry-button {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

/* Container utility */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .hero-description,
  .section-description {
    font-size: 1rem;
  }
}
</style>
