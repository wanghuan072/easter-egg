<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-logo">EasterEggVault</div>
            <p class="footer-description">
              The ultimate guide to easter eggs, hidden details, and secrets in video games,
              movies, and TV shows. Join our community of secret hunters and never miss another
              hidden gem.
            </p>
            <div class="footer-social">
              <a href="#twitter" class="social-link">🐦</a>
              <a href="#youtube" class="social-link">📺</a>
              <a href="#github" class="social-link">💻</a>
              <a href="#discord" class="social-link">🎮</a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-link-group">
              <h3 class="footer-link-title">QUICK LINKS</h3>
              <ul class="footer-link-list">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/games">Video Games</router-link></li>
                <li><router-link to="/movies">Movies</router-link></li>
                <li><router-link to="/tv">TV Shows</router-link></li>
                <li><router-link to="/news">Latest News</router-link></li>
              </ul>
            </div>

            <div class="footer-link-group">
              <h3 class="footer-link-title">Popular</h3>
              <ul class="footer-link-list">
                <li v-if="!isLatestDiscoveriesLoaded" class="footer-loading">Loading...</li>
                <li v-else-if="latestDiscoveries.length === 0" class="footer-empty">No content available</li>
                <li v-else v-for="item in latestDiscoveries.slice(0, 4)" :key="item.id">
                  <router-link :to="getDetailRoute(item)" class="footer-popular-link">
                    {{ item.title }}
                  </router-link>
                </li>
              </ul>
            </div>

            <div class="footer-link-group">
              <h3 class="footer-link-title">Legal</h3>
              <ul class="footer-link-list">
                <li><router-link to="/privacy">Privacy Policy</router-link></li>
                <li><router-link to="/terms">Terms of Use</router-link></li>
                <li><router-link to="/copyright">Copyright</router-link></li>
                <li><router-link to="/about">About Us</router-link></li>
                <li><router-link to="/contact">Contact Us</router-link></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2025 EasterEggVault. All rights reserved.</p>
          </div>
          <div class="footer-legal">
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
            <router-link to="/copyright">Copyright</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import { dataUtils } from '@/config/dataStructure.js'

const store = useEasterEggsStore()

// 计算属性
const latestDiscoveries = computed(() => store.latestDiscoveries)
const isLatestDiscoveriesLoaded = computed(() => store.isDataLoaded('latestDiscoveries'))

// 获取详情页路由
const getDetailRoute = (item) => {
  const mediaType = dataUtils.getMediaType(item)
  const addressBar = dataUtils.getAddressBar(item)
  
  switch (mediaType) {
    case 'games':
      return `/games/${addressBar}`
    case 'movies':
      return `/movies/${addressBar}`
    case 'tv':
      return `/tv/${addressBar}`
    case 'news':
      return `/news/${addressBar}`
    default:
      return `/games/${addressBar}`
  }
}

// 生命周期
onMounted(async () => {
  if (!isLatestDiscoveriesLoaded.value) {
    await store.fetchLatestDiscoveries(4) // 只获取4个用于footer显示
  }
})
</script>

<style scoped>
/* Footer */
.footer {
  background-color: #0f172a;
  border-top: 1px solid #334155;
  padding: 48px 0 24px;
}

.footer-content {
  display: flex;
  flex-direction: column;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 48px;
  margin-bottom: 32px;
}

.footer-brand .footer-logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.footer-description {
  color: #a0a0a0;
  margin-bottom: 24px;
  max-width: 400px;
  line-height: 1.6;
}

.footer-social {
  display: flex;
  gap: 16px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #374151;
  border-radius: 8px;
  color: #a0a0a0;
  text-decoration: none;
  font-size: 20px;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-link-title {
  font-weight: 600;
  color: #f5f5f5;
  margin-bottom: 16px;
}

.footer-link-list {
  list-style: none;
}

.footer-link-list li {
  margin-bottom: 8px;
}

.footer-link-list a {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link-list a:hover {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

.footer-loading,
.footer-empty {
  color: #666;
  font-style: italic;
  font-size: 14px;
}

.footer-popular-link {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #374151;
  font-size: 14px;
  color: #a0a0a0;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal a {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-legal a:hover {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

/* Container utility */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
