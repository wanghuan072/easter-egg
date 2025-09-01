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
            <div class="media-category">{{ Array.isArray(item.label) ? item.label[0] : item.label }}</div>
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
import { dataUtils, DATA_STRUCTURE } from '@/config/dataStructure.js'

const router = useRouter()

// 格式化日期函数
const formatDate = formatRelativeTime

// Props定义
const props = defineProps({
  // 数据类型：games, movies, tv, latest
  type: {
    type: String,
    required: true,
    validator: (value) => Object.values(DATA_STRUCTURE.MEDIA_TYPES).includes(value) || value === 'latest'
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
    case DATA_STRUCTURE.MEDIA_TYPES.GAMES:
      return 'Games'
    case DATA_STRUCTURE.MEDIA_TYPES.MOVIES:
      return 'Movies'
    case DATA_STRUCTURE.MEDIA_TYPES.TV:
      return 'TV Shows'
    case DATA_STRUCTURE.MEDIA_TYPES.NEWS:
      return 'News'
    case 'latest':
      return 'Latest Discoveries'
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
  // 使用统一的数据工具函数
  const addressBar = dataUtils.getAddressBar(item)
  const routeName = dataUtils.getRouteName(item)
  
  // 使用命名路由进行导航
  router.push({
    name: routeName,
    params: {
      addressBar
    }
  })
}
</script>

<style scoped>
.media-section {
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
  padding: 20px;
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

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    margin-bottom: 40px;
  }
  
  .media-content {
    padding: 18px;
  }
  
  .media-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .media-description {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .media-meta {
    font-size: 16px;
  }
  
  .media-category {
    font-size: 11px;
    padding: 5px 10px;
    top: 14px;
    left: 14px;
  }
  
  .more-button {
    padding: 14px 28px;
    font-size: 16px;
    gap: 10px;
  }
  
  .arrow {
    font-size: 18px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .media-image {
    height: 140px;
  }
  
  .media-content {
    padding: 12px;
  }
  
  .media-title {
    font-size: 14px;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  
  .media-description {
    font-size: 11px;
    margin-bottom: 12px;
    line-height: 1.4;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  .media-meta {
    font-size: 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .media-category {
    font-size: 9px;
    padding: 3px 6px;
    top: 8px;
    left: 8px;
  }
  
  .more-button {
    padding: 10px 20px;
    font-size: 12px;
    gap: 8px;
  }
  
  .arrow {
    font-size: 16px;
  }
}
</style>
