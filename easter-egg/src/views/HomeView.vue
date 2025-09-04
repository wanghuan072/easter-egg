<template>
  <div class="home-view">
    <!-- Header Component -->
    <Header />

    <!-- Error State -->
    <div v-if="store.errors.home" class="error-banner">
      <p>⚠️ {{ store.errors.home }}</p>
      <button @click="retryFetch" class="retry-button">重试</button>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Tech Background Elements -->
      <!-- 简化的背景装饰元素 -->
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
              <span class="hero-title-part-1">Unlock the</span>
              <br />
              <span class="hero-title-part-2">Secrets</span>
            </h1>

            <p class="hero-description">
              The ultimate guide to easter eggs, hidden details, and secrets in video games, movies,
              and TV shows.
            </p>

            <div class="hero-search">
              <div class="hero-search-container">
                <div class="hero-search-icon">🔍</div>
                <input
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                  type="text"
                  placeholder="Find a secret in... (e.g., 'Cyberpunk 2077', 'The Avengers')"
                  class="hero-search-input"
                />
              </div>
              <button @click="performSearch" class="hero-search-button">
                <span v-if="isSearching">Searching...</span>
                <span v-else>Search Vault</span>
              </button>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-dot stat-dot-purple"></div>
                <span>1000+ Secrets</span>
              </div>
              <div class="stat-item">
                <div class="stat-dot stat-dot-cyan"></div>
                <span>Daily Updates</span>
              </div>
              <div class="stat-item">
                <div class="stat-dot stat-dot-purple"></div>
                <span>Expert Guides</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator positioned outside hero-content -->
        <div class="scroll-indicator">
          <div class="scroll-arrow">
            <div class="scroll-dot"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Discoveries Section -->
    <section class="latest-discoveries-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title"><span class="gradient-text">Latest</span> Discoveries</h2>
          <p class="section-description">
            Fresh secrets, hidden details, and easter eggs discovered by our community of hunters.
          </p>
        </div>
        <div v-if="!isLatestDiscoveriesLoaded" class="loading-section">
          <div class="loading-text">Loading...</div>
        </div>
        
        <MediaList 
          v-else
          type="latest"
          :data="latestDiscoveries"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Video Games Section -->
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🎮 <span class="gradient-text">Video Games</span></h2>
          <p class="section-description">
            Discover hidden easter eggs, secret levels, and developer jokes in your favorite games.
          </p>
        </div>
          <div v-if="!isGamesLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>Loading games...</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">重试</button>
        </div>
        
        <MediaList 
          v-else
          type="games"
          :data="games"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Movies Section -->
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🎬 <span class="gradient-text">Movies</span></h2>
          <p class="section-description">
            Uncover movie easter eggs, hidden details, and director's subtle references.
          </p>
        </div>
        <div v-if="!isMoviesLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">重试</button>
        </div>
        
        <MediaList 
          v-else
          type="movies"
          :data="movies"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- TV Shows Section -->
    <section class="category-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">📺 <span class="gradient-text">TV Shows</span></h2>
          <p class="section-description">
            Find hidden references, callbacks, and easter eggs across television series.
          </p>
        </div>
        <div v-if="!isTVLoaded" class="loading-section">
          <div class="loading-spinner"></div>
          <p>Loading TV shows...</p>
        </div>
        
        <div v-else-if="store.errors.home" class="error-section">
          <p>⚠️ {{ store.errors.home }}</p>
          <button @click="retryFetch" class="retry-button">重试</button>
        </div>
        
        <MediaList 
          v-else
          type="tv"
          :data="tvShows"
          :show-more-button="true"
        />
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="introduction-section">
      <div class="container">
        <div class="introduction-content">
          <div class="section-header">
            <h2 class="section-title">About <span class="gradient-text">EasterEggVault</span></h2>
            <p class="section-description">
              Your ultimate destination for discovering hidden secrets, easter eggs, and fascinating
              details in entertainment media.
            </p>
          </div>

          <div class="introduction-grid">
            <div class="intro-card">
              <div class="intro-icon">🔍</div>
              <h3 class="intro-title">Comprehensive Discovery</h3>
              <p class="intro-description">
                Explore thousands of carefully documented easter eggs, hidden references, and secret
                details from video games, movies, and TV shows.
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">🎯</div>
              <h3 class="intro-title">Expert Curation</h3>
              <p class="intro-description">
                Our team of dedicated hunters and entertainment experts verify and document every
                discovery with accuracy and detail.
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">🚀</div>
              <h3 class="intro-title">Always Updated</h3>
              <p class="intro-description">
                Stay current with the latest discoveries and updates as new content is constantly
                being added to our vault.
              </p>
            </div>

            <div class="intro-card">
              <div class="intro-icon">🤝</div>
              <h3 class="intro-title">Community Driven</h3>
              <p class="intro-description">
                Join our community of passionate hunters who share discoveries and help expand our
                knowledge base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="faq-content">
          <div class="section-header">
            <h2 class="section-title">
              Frequently Asked <span class="gradient-text">Questions</span>
            </h2>
            <p class="section-description">
              Find answers to common questions about our platform and how to use it effectively.
            </p>
          </div>

          <div class="faq-grid">
            <div class="faq-item">
              <h3 class="faq-title">What is an easter egg?</h3>
              <p class="faq-answer">
                An easter egg is a hidden message, feature, or reference intentionally placed in
                media content by creators. These can include secret levels in games, hidden
                messages in movies, or subtle references that reward attentive viewers.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">How often is new content added?</h3>
              <p class="faq-answer">
                We add new discoveries daily! Our team works around the clock to document new
                easter eggs and hidden details as they're discovered by our community and
                researchers.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">Can I submit my own discoveries?</h3>
              <p class="faq-answer">
                Absolutely! We welcome submissions from our community. If you've found something
                interesting, you can submit it through our submission form, and our team will
                review and verify it.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">How do I search for specific content?</h3>
              <p class="faq-answer">
                Use our search bar to find specific games, movies, TV shows, or easter egg types.
                You can search by title, genre, or even specific details you remember seeing.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">Are all easter eggs verified?</h3>
              <p class="faq-answer">
                Yes, every easter egg in our vault has been personally verified by our team. We
                ensure accuracy and provide detailed explanations with evidence to support each
                discovery.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">How can I become a contributor?</h3>
              <p class="faq-answer">
                We're always looking for passionate easter egg hunters to join our team. If you have a keen eye for details, 
                love researching hidden secrets, and want to share your discoveries with the world, contact us through our community section.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">Do you cover international media?</h3>
              <p class="faq-answer">
                Yes! Our vault includes easter eggs from media around the world, including international films, anime, 
                foreign TV shows, and games from different regions. We believe great secrets can be found everywhere.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-title">Are there easter eggs in the vault itself?</h3>
              <p class="faq-answer">
                Maybe! 🕵️‍♂️ We love easter eggs as much as you do, so we've hidden a few surprises throughout the website. 
                Keep your eyes peeled for hidden messages, secret animations, and other fun discoveries as you explore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MediaList from '@/components/MediaList.vue'


import { useEasterEggsStore } from '@/stores/easterEggs.js'

// 使用路由
const router = useRouter()

const store = useEasterEggsStore()
const searchQuery = ref('')
const isSearching = ref(false)

// 使用store中的数据
const games = computed(() => store.games)
const movies = computed(() => store.movies)
const tvShows = computed(() => store.tvShows)
const latestDiscoveries = computed(() => store.latestDiscoveries)
const isLoading = computed(() => store.isLoading.home)

// 数据加载状态计算属性
const isLatestDiscoveriesLoaded = computed(() => store.isDataLoaded('latestDiscoveries'))
const isGamesLoaded = computed(() => store.isDataLoaded('games'))
const isMoviesLoaded = computed(() => store.isDataLoaded('movies'))
const isTVLoaded = computed(() => store.isDataLoaded('tv'))

// 搜索功能
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  try {
    // 直接跳转到搜索结果页面，数据由 SearchResultsView.vue 负责获取
    router.push({
      name: 'search-results',
      query: { q: searchQuery.value.trim() }
    })
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

// 重试获取数据
const retryFetch = async () => {
  await store.fetchHomeData()
}

// 重试获取最新发现
const retryLatestFetch = async () => {
  await store.fetchLatestDiscoveries()
}

onMounted(async () => {
  // 等待数据预加载完成
  const waitForData = () => {
    if (store.areDataTypesLoaded(['games', 'movies', 'tv'])) {
      // 数据已加载，获取最新发现
      store.fetchLatestDiscoveries(4)
    } else {
      // 使用更短的轮询间隔，提高响应速度
      setTimeout(waitForData, 50)
    }
  }
  
  waitForData()
})
</script>

<style scoped>
.home-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #100e19;
}

/* 通用样式 */
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

.gradient-text {
  background: linear-gradient(90deg, #a855f7, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.action-button {
  padding: 12px 32px;
  background-color: #374151;
  color: #e5e7eb;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #4b5563;
  transform: scale(1.05);
}


/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-image: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 背景遮罩层 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 14, 25, 0.7);
  z-index: 0;
}

/* 网格图案层 */
.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.6;
  z-index: 1;
}

/* 简化的装饰元素容器 */
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

/* 移除不再需要的网格和线条样式 */



/* 移除不再需要的扫描动画 */

/* 移除重复的背景层级 */

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fade-in 0.8s ease-out;
  width: 100%;
}

.hero-title {
  font-size: 96px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.1;
}

.hero-title-part-1 {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.4));
}

.hero-title-part-2 {
  color: #f5f5f5;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.5));
}

/* Removed hero-subtitle as it's replaced by hero-title-part-2 */

.hero-description {
  font-size: 24px;
  color: #a0a0a0;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 48px;
  animation: fade-in 1s ease-out 0.2s both;
}

@media (min-width: 640px) {
  .hero-search {
    flex-direction: row;
    align-items: stretch;
  }

  .hero-search-container {
    flex: 1;
    margin-bottom: 0;
  }

  .hero-search-button {
    flex-shrink: 0;
  }
}

.hero-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 8px;
}

.hero-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 20px;
}

.hero-search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background-color: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f5f5f5;
  font-size: 18px;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.hero-search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  transform: scale(1.02);
}

.hero-search-button {
  padding: 16px 32px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  animation: glow-pulse 2s ease-in-out infinite;
}

.hero-search-button:hover {
  background: linear-gradient(90deg, #7c3aed, #0891b2);
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  font-size: 14px;
  color: #a0a0a0;
  animation: fade-in 1.2s ease-out 0.4s both;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hero-stats {
    gap: 16px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(8px);
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot-purple {
  background-color: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

.stat-dot-cyan {
  background-color: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  animation: float 3s ease-in-out infinite;
  z-index: 10;
  pointer-events: none;
}

@media (max-width: 768px) {
  .scroll-indicator {
    bottom: 20px;
  }
}

@media (max-width: 480px) {
  .scroll-indicator {
    bottom: 16px;
  }

  .scroll-arrow {
    width: 20px;
    height: 32px;
  }

  .scroll-dot {
    width: 3px;
    height: 10px;
  }
}

.scroll-arrow {
  width: 24px;
  height: 40px;
  border: 2px solid #8b5cf6;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  background-color: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.scroll-arrow:hover {
  border-color: #06b6d4;
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
  transform: scale(1.1);
}

.scroll-dot {
  width: 4px;
  height: 12px;
  background-color: #8b5cf6;
  border-radius: 2px;
  animation: scroll-pulse 2s infinite;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
}

@keyframes scroll-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}





/* Latest Discoveries Section */
.latest-discoveries-section {
  padding: 80px 0;
  background-color: #0f172a;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.article-card {
  background-color: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #334155;
}

.article-card:hover {
  transform: scale(1.02);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.article-category {
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

.article-content {
  padding: 24px;
}

.article-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.article-card:hover .article-title {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.article-excerpt {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.section-action {
  text-align: center;
}

/* Category Sections */
.category-section {
  padding: 80px 0;
}

.category-section:nth-child(odd) {
  background-color: #100e19;
}

.category-section:nth-child(even) {
  background-color: #0f172a;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.category-article-card {
  background-color: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #334155;
}

.category-article-card:hover {
  transform: scale(1.02);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.category-article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.category-article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-article-card:hover .category-article-image img {
  transform: scale(1.1);
}

.category-article-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.category-article-category {
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

.category-article-content {
  padding: 24px;
}

.category-article-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.category-article-card:hover .category-article-title {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.category-article-excerpt {
  color: #a0a0a0;
  margin-bottom: 16px;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}



/* Introduction Section */
.introduction-section {
  padding: 80px 0;
  background-color: #100e19;
}

.introduction-content {
  text-align: center;
}

.introduction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  }
}

.intro-card {
  background-color: #1e293b;
  border-radius: 16px;
  padding: 32px 24px;
  border: 1px solid #334155;
  transition: all 0.3s ease;
  cursor: pointer;
}

.intro-card:hover {
  transform: translateY(-8px);
  border-color: #8b5cf6;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.intro-icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.intro-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #f5f5f5;
}

.intro-description {
  color: #a0a0a0;
  line-height: 1.6;
  font-size: 16px;
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
  background-color: #0f172a;
}

.faq-content {
  max-width: 100%;
  margin: 0 auto;
}

.faq-grid {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

.faq-item {
  background-color: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  padding: 24px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

.faq-title {
  font-size: 18px;
  font-weight: 600;
  color: #f5f5f5;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.faq-answer {
  color: #a0a0a0;
  line-height: 1.6;
  margin: 0;
}

/* Loading and Error States */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 14, 25, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

.error-banner {
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: white;
  padding: 16px 24px;
  margin: 20px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
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
  .section-title {
    font-size: 40px;
  }
  
  .section-description {
    font-size: 18px;
  }
  
  .hero-title {
    font-size: 72px;
  }
  
  .hero-description {
    font-size: 20px;
    margin-bottom: 28px;
  }
  
  .hero-search-input {
    font-size: 16px;
    padding: 14px 14px 14px 44px;
  }
  
  .hero-search-button {
    font-size: 16px;
    padding: 14px 28px;
  }
  
  .hero-stats {
    font-size: 16px;
    gap: 28px;
  }
  
  .latest-discoveries-section,
  .category-section,
  .introduction-section,
  .faq-section {
    padding: 60px 0;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  
  .articles-grid,
  .category-grid {
    gap: 28px;
    margin-bottom: 40px;
  }
  
  .introduction-grid {
    gap: 28px;
    margin-top: 40px;
  }
  
  .faq-grid {
    margin-top: 40px;
    gap: 20px;
  }
  
  .intro-card {
    padding: 28px 20px;
  }
  
  .intro-icon {
    font-size: 40px;
    margin-bottom: 16px;
  }
  
  .intro-title {
    font-size: 18px;
    margin-bottom: 14px;
  }
  
  .intro-description {
    font-size: 16px;
  }
  
  .faq-item {
    padding: 20px;
  }
  
  .faq-title {
    font-size: 16px;
    margin-bottom: 14px;
  }
  
  .faq-answer {
    font-size: 16px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 20px 0;
  }
  
  .hero-content {
    padding: 0 10px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-description {
    font-size: 12px;
  }
  
  .hero-title {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .hero-description {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .hero-search {
    margin-bottom: 20px;
  }
  
  .hero-search-input {
    font-size: 12px;
    padding: 10px 10px 10px 36px;
  }
  
  .hero-search-icon {
    font-size: 16px;
    left: 12px;
  }
  
  .hero-search-button {
    font-size: 12px;
    padding: 10px 20px;
  }
  
  .hero-stats {
    font-size: 12px;
    gap: 10px;
  }
  
  .stat-item {
    padding: 6px 12px;
    gap: 6px;
  }
  
  .latest-discoveries-section,
  .category-section,
  .introduction-section,
  .faq-section {
    padding: 20px 0;
  }
  
  .section-header {
    margin-bottom: 20px;
  }
  
  .section-title {
    margin-bottom: 10px;
  }
  
  .section-description {
    margin-bottom: 10px;
  }
  
  .articles-grid,
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .article-card,
  .category-article-card {
    margin-bottom: 10px;
  }
  
  .article-content,
  .category-article-content {
    padding: 20px;
  }
  
  .article-title,
  .category-article-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .article-excerpt,
  .category-article-excerpt {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .article-meta,
  .category-article-meta {
    font-size: 12px;
  }
  
  .article-category,
  .category-article-category {
    font-size: 10px;
    padding: 3px 8px;
    top: 12px;
    left: 12px;
  }
  
  .introduction-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  
  .intro-card {
    padding: 20px 16px;
  }
  
  .intro-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }
  
  .intro-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .intro-description {
    font-size: 12px;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
    margin-top: 20px;
    gap: 20px;
  }
  
  .faq-item {
    padding: 20px;
  }
  
  .faq-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .faq-answer {
    font-size: 12px;
  }
  
  .loading-section {
    padding: 20px 10px;
    margin: 10px 0;
  }
  
  .loading-text {
    font-size: 12px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    margin-bottom: 15px;
  }
  
  .error-banner {
    padding: 12px 20px;
    margin: 10px 0;
  }
  
  .error-section {
    padding: 15px;
    margin: 10px 0;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .action-button {
    padding: 10px 24px;
    font-size: 12px;
  }
  
  .tech-circle-1 {
    width: 300px;
    height: 300px;
  }
  
  .tech-circle-2 {
    width: 200px;
    height: 200px;
  }
  
  .tech-circle-3 {
    width: 150px;
    height: 150px;
  }
}

</style>