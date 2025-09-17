<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="/images/logo.png" alt="EasterEggVault" class="logo-image" />
              <div class="logo-text">EasterEggVault</div>
            </div>
            <p class="footer-description">
              The ultimate guide to easter eggs, hidden details, and secrets in video games,
              movies, and TV shows. Join our community of secret hunters and never miss another
              hidden gem.
            </p>
            <div class="footer-social">
              <a href="#twitter" class="social-link" target="_blank">
                <svg t="1757054287175" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2580" width="200" height="200"><path d="M761.759375 122h132.320625L605 452.4003125 945.08 902H678.8L470.24 629.3196875 231.599375 902H99.2l309.1996875-353.4L82.16 122h273.0403125l188.52 249.24z m-46.4390625 700.8h73.32L315.359375 197.0403125h-78.680625z" fill="#2c2c2c" p-id="2581"></path></svg>
              </a>
              <a href="#youtube" class="social-link" target="_blank">
                <svg t="1757054321480" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3753" width="200" height="200"><path d="M426.666667 682.666667V384l256 149.845333L426.666667 682.666667z m587.093333-355.541334s-10.026667-71.04-40.704-102.357333c-38.954667-41.088-82.602667-41.258667-102.613333-43.648C727.168 170.666667 512.213333 170.666667 512.213333 170.666667h-0.426666s-214.954667 0-358.229334 10.453333c-20.053333 2.389333-63.658667 2.56-102.656 43.648-30.677333 31.317333-40.661333 102.4-40.661333 102.4S0 410.538667 0 493.952v78.293333c0 83.456 10.24 166.912 10.24 166.912s9.984 71.04 40.661333 102.357334c38.997333 41.088 90.154667 39.765333 112.938667 44.074666C245.76 893.568 512 896 512 896s215.168-0.341333 358.442667-10.752c20.053333-2.432 63.658667-2.602667 102.613333-43.690667 30.72-31.317333 40.704-102.4 40.704-102.4s10.24-83.413333 10.24-166.869333v-78.250667c0-83.456-10.24-166.912-10.24-166.912z" fill="#FF0000" p-id="3754"></path></svg>
              </a>
              <a href="#facebook" class="social-link" target="_blank">
                <svg t="1757054421030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7352" width="200" height="200"><path d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m173.292308 291.446154h-63.015385c-15.753846-3.938462-35.446154 3.938462-47.261538 15.753846-7.876923 11.815385-11.815385 27.569231-11.815385 43.323077v74.830769h118.153846l-15.753846 118.153846h-102.4v303.261539h-122.092308v-303.261539H338.707692v-118.153846h102.4V334.769231c-3.938462-43.323077 11.815385-82.707692 43.323077-114.215385 31.507692-27.569231 70.892308-43.323077 110.276923-39.384615 27.569231-3.938462 59.076923 0 90.584616 3.938461v106.338462z" fill="#080405" p-id="7353"></path></svg>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-link-group">
              <h3 class="footer-link-title">QUICK LINKS</h3>
              <ul class="footer-link-list">
                <li><a href="/">Home</a></li>
                <li><a href="/games">Video Games</a></li>
                <li><a href="/movies">Movies</a></li>
                <li><a href="/tv">TV Shows</a></li>
                <li><a href="/news">Latest News</a></li>
              </ul>
            </div>

            <div class="footer-link-group">
              <h3 class="footer-link-title">Popular</h3>
              <ul class="footer-link-list">
                <li v-if="!isLatestDiscoveriesLoaded" class="footer-loading">Loading...</li>
                <li v-else-if="latestDiscoveries.length === 0" class="footer-empty">No content available</li>
                <li v-else v-for="item in latestDiscoveries.slice(0, 4)" :key="item.id">
                  <a :href="getDetailRoute(item)" class="footer-popular-link">
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>

            <div class="footer-link-group">
              <h3 class="footer-link-title">Legal</h3>
              <ul class="footer-link-list">
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Use</a></li>
                <li><a href="/copyright">Copyright</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2025 eastereggvault.com. All rights reserved.</p>
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
    await store.fetchLatestDiscoveries() // 获取所有Latest Discoveries数据
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
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo .logo-image {
  width: 40px;
  height: 40px;
}

.footer-logo .logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  color: #a0a0a0;
  text-decoration: none;
  font-size: 20px;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: scale(1.1);
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
  justify-content: center;
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



/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .footer {
    padding: 40px 0 20px;
  }
  
  .footer-main {
    gap: 40px;
    margin-bottom: 25px;
  }
  
  .footer-links {
    gap: 25px;
  }
  
  .footer-brand .footer-logo {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .footer-description {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .footer-link-title {
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .footer-link-list a {
    font-size: 16px;
  }
  
  .footer-bottom {
    font-size: 16px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .footer {
    padding: 20px 0 10px;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    font-size: 12px;
  }
  
  .footer-brand .footer-logo {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .footer-description {
    font-size: 12px;
    margin-bottom: 20px;
  }
  
  .footer-social {
    gap: 10px;
  }
  
  .social-link {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .footer-link-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .footer-link-list {
    margin-bottom: 10px;
  }
  
  .footer-link-list li {
    margin-bottom: 6px;
  }
  
  .footer-link-list a {
    font-size: 12px;
  }
  
  .footer-legal {
    gap: 20px;
  }
  
  .footer-legal a {
    font-size: 12px;
  }
}
</style>
