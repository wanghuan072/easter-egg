<template>
  <div class="movies-view">
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
              <span class="hero-title-part-1">Discover</span>
              <br />
              <span class="hero-title-part-2">Movie Magic</span>
            </h1>
            <p class="hero-description">
              Uncover movie easter eggs, hidden details, and director's subtle references in every frame.
              From blockbuster hits to indie gems, every viewing becomes a treasure hunt for hidden secrets.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- All Movies Section -->
    <section class="movies-section">
      <div class="container">
        <!-- Loading State - 等待所有数据加载完成 -->
        <div v-if="!isDataReady" class="loading-section">
          <div class="loading-text">Loading...</div>
        </div>

        <!-- 数据加载完成后的内容 -->
        <div v-else>
          <!-- 分类Tab -->
          <div class="category-tabs">
            <button v-for="category in categories" :key="category.id" class="tab-button"
              :class="{ active: activeCategory === category.name }" @click="setActiveCategory(category.name)">
              {{ category.display_name }}
            </button>
          </div>

          <div v-if="filteredMovies.length === 0" class="empty-state">
            <h3>No Content Available</h3>
            <p>No movies found in category "{{ getCategoryDisplayName(activeCategory) }}"</p>
          </div>

          <MediaList v-else type="movies" :data="filteredMovies" :show-more-button="false" />
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MediaList from '@/components/MediaList.vue'

import { useEasterEggsStore } from '@/stores/easterEggs.js'

const store = useEasterEggsStore()
const activeCategory = ref('')

// 使用store中的数据
const moviesList = computed(() => store.movies)
const categories = computed(() => store.classifications.movies)

const filteredMovies = computed(() => {
  if (!activeCategory.value) return moviesList.value
  return moviesList.value.filter(movie => movie.classify && movie.classify.includes(activeCategory.value))
})

const setActiveCategory = (category) => {
  activeCategory.value = category
}

// 获取分类显示名称
const getCategoryDisplayName = (categoryName) => {
  if (!categoryName) return ''
  const category = categories.value.find(cat => cat.name === categoryName)
  return category ? category.display_name : categoryName
}

// 检查数据是否准备就绪
const isDataReady = computed(() => {
  return store.areDataTypesLoaded(['movies', 'categories'])
})

onMounted(async () => {
  // 等待数据预加载完成
  const waitForData = () => {
    if (store.areDataTypesLoaded(['movies', 'categories'])) {
      // 数据已加载，设置第一个分类为默认选中
      if (categories.value.length > 0) {
        activeCategory.value = categories.value[0].name
      }
    } else {
      // 使用更短的轮询间隔，提高响应速度
      setTimeout(waitForData, 50)
    }
  }

  waitForData()
})
</script>

<style scoped>
.movies-view {
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

/* Movies Section */
.movies-section {
  padding: 80px 0;
  background-color: #0f172a;
}

/* 分类Tab样式 */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.empty-state h3 {
  margin-bottom: 16px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #a0a0a0;
}

.tab-button {
  padding: 12px 24px;
  background-color: #1e293b;
  color: #a0a0a0;
  border: 1px solid #334155;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #334155;
  color: #f5f5f5;
  border-color: #8b5cf6;
}

.tab-button.active {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section-title .gradient-text {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
}

.section-description {
  font-size: 20px;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.movie-card {
  background-color: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #334155;
}

.movie-card:hover {
  transform: scale(1.02);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.movie-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.movie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .movie-image img {
  transform: scale(1.1);
}

.movie-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.movie-category {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 4px 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
}

.movie-content {
  padding: 24px;
}

.movie-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.movie-card:hover .movie-title {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.movie-description {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
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

  .movies-section {
    padding: 60px 0;
  }

  .category-tabs {
    gap: 14px;
    margin-bottom: 40px;
  }

  .tab-button {
    padding: 10px 20px;
    font-size: 16px;
  }

  .empty-state {
    padding: 50px 16px;
  }

  .empty-state h3 {
    font-size: 18px;
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

  .movies-section {
    padding: 20px 0;
  }

  .category-tabs {
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab-button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .empty-state {
    padding: 40px 10px;
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
