<template>
  <section class="media-section">
    <div class="container">
      <!-- 媒体网格 -->
      <div class="media-grid">
        <article 
          v-for="item in data" 
          :key="item.id" 
          class="media-card"
          @click="goToDetail(item)"
        >
          <div class="media-image">
            <img
              :src="item.imageUrl"
              :alt="item.imageAlt"
            />
            <div class="media-category">{{ item.label }}</div>
          </div>
          <div class="media-content">
            <h3 class="media-title">{{ item.title }}</h3>
            <p class="media-description">
              {{ item.description }}
            </p>
            <div class="media-meta">
              <span class="media-date">{{ formatDate(item.publishDate) }}</span>
              <span class="media-author">The Vault Team</span>
            </div>
          </div>
        </article>
      </div>

      <!-- More按钮 - 只在需要时显示 -->
      <div v-if="showMoreButton" class="more-button-container">
        <router-link :to="moreButtonLink" class="more-button">
          <span>More {{ typeLabel }}</span>
          <span class="arrow">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatRelativeTime } from '@/utils/dateUtils.js'

const router = useRouter()

// 格式化日期函数
const formatDate = formatRelativeTime

// Props定义
const props = defineProps({
  // 数据类型：games, movies, tv
  type: {
    type: String,
    required: true,
    validator: (value) => ['games', 'movies', 'tv', 'latest'].includes(value)
  },
  // 数据源
  data: {
    type: Array,
    required: true
  },
  // 是否显示More按钮
  showMoreButton: {
    type: Boolean,
    default: false
  }
})

// 类型标签
const typeLabel = computed(() => {
  switch (props.type) {
    case 'games':
      return 'Games'
    case 'movies':
      return 'Movies'
    case 'tv':
      return 'TV Shows'
    case 'latest':
      return 'Discoveries'
    default:
      return 'Content'
  }
})

// More按钮链接
const moreButtonLink = computed(() => {
  if (props.type === 'latest') {
    return '/'
  }
  return `/${props.type}`
})

// 跳转到详情页
const goToDetail = (item) => {
  if (props.type === 'latest') {
    // 根据item的label判断跳转路径
    const itemType = item.label.toLowerCase()
    if (itemType === 'game') {
      router.push(`/games/${item.addressBar}`)
    } else if (itemType === 'movie') {
      router.push(`/movies/${item.addressBar}`)
    } else if (itemType === 'tv') {
      router.push(`/tv/${item.addressBar}`)
    }
  } else {
    router.push(`/${props.type}/${item.addressBar}`)
  }
}
</script>

<style scoped>
.media-section {
  padding: 80px 0;
  background-color: #0f172a;
}



/* 媒体网格 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 48px;
}

.media-card {
  background-color: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #334155;
  cursor: pointer;
  transition: all 0.3s ease;
}

.media-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: #8b5cf6;
}

.media-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.media-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.media-card:hover .media-image img {
  transform: scale(1.05);
}

.media-category {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.media-content {
  padding: 24px;
}

.media-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #ffffff;
  line-height: 1.3;
}

.media-description {
  color: #a0a0a0;
  margin-bottom: 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.media-date {
  color: #8b5cf6;
  font-weight: 600;
}

.media-author {
  color: #64748b;
}

/* More按钮 */
.more-button-container {
  text-align: center;
}

.more-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
}

.more-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.more-button:hover .arrow {
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .media-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (max-width: 900px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .media-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .media-content {
    padding: 20px;
  }
  
  .media-title {
    font-size: 1.25rem;
  }
}
</style>
