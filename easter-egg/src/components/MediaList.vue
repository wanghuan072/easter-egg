<template>
  <section class="media-section">
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
            <div class="media-categories">
              <span 
                v-for="tag in getValidClassifyTags(item)" 
                :key="tag" 
                class="media-category-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="media-content">
            <h3 class="media-title">{{ item.title }}</h3>
            <p class="media-description">
              {{ item.description }}
            </p>
            <div class="media-meta">
              <span class="media-date">{{ formatDate(item.publishDate) }}</span>
              <!-- <span class="media-author">The Vault Team</span> -->
            </div>
          </div>
        </article>
      </div>

      <!-- More按钮 - 只在需要时显示 -->
      <div v-if="showMoreButton" class="more-button-container">
        <a :href="moreButtonLink" class="more-button">
          <span>More {{ typeLabel }}</span>
          <span class="arrow">→</span>
        </a>
      </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatRelativeTime } from '@/utils/dateUtils.js'
import { dataUtils, DATA_STRUCTURE } from '@/config/dataStructure.js'

const router = useRouter()
const { locale } = useI18n()

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
  const $t = window.$t || ((key) => key) // 回退函数
  switch (props.type) {
    case DATA_STRUCTURE.MEDIA_TYPES.GAMES:
      return $t('nav.videoGames')
    case DATA_STRUCTURE.MEDIA_TYPES.MOVIES:
      return $t('nav.movies')
    case DATA_STRUCTURE.MEDIA_TYPES.TV:
      return $t('nav.tvShows')
    case DATA_STRUCTURE.MEDIA_TYPES.NEWS:
      return $t('nav.news')
    case 'latest':
      return $t('HomePage.section1.title2')
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
  return [props.type.toUpperCase()]
}

// 智能推断媒体类型
const getSmartMediaType = (item) => {
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
    'actor', 'actress', 'oscar', 'award', 'premiere', 'release', 'saw', 'horror'
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
  
  // 默认返回传入的type或games
  return props.type || 'games'
}

// 跳转到详情页
const goToDetail = (item) => {
  // 使用统一的数据工具函数
  const addressBar = dataUtils.getAddressBar(item)
  
  // 检查传入的type是否为有效的媒体类型
  const validMediaTypes = ['games', 'movies', 'tv', 'news']
  const isTypeValid = props.type && validMediaTypes.includes(props.type)
  
  let baseRouteName
  
  if (isTypeValid) {
    // 如果传入的type是有效的媒体类型，直接使用
    switch (props.type) {
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
    }
  } else {
    // 如果传入的type不是有效的媒体类型（如"latest"），使用智能推断
    const smartType = getSmartMediaType(item)
    switch (smartType) {
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
  }
  
  // 根据当前语言构建路由名称
  const currentLang = locale.value
  const routeName = currentLang === 'en' 
    ? baseRouteName 
    : `${baseRouteName}${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`
  
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
  gap: 20px;
  margin-bottom: 40px;
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
  overflow: hidden;
  aspect-ratio: 4/3;
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

.media-categories {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  z-index: 2;
}

.media-category-tag {
  padding: 6px 12px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
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
    margin-bottom: 30px;
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
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .media-image {
    height: 140px;
  }
  
  .media-content {
    padding: 10px;
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

  .media-categories{
    top: 5px;
    left: 5px;
  }

  .media-category-tag{
    padding: 5px 10px;
    font-size: 0.5rem;
  }
}
</style>
