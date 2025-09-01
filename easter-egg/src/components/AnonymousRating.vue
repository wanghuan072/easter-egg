<template>
  <div class="anonymous-rating">
    <div class="rating-header">
      <h3>User Ratings</h3>
      <div class="rating-summary">
        <span class="average-rating">{{ ratingStats.averageRating }}</span>
        <div class="stars">
          <span 
            v-for="i in 5" 
            :key="i"
            :class="['star', { 'filled': i <= Math.round(ratingStats.averageRating) }]"
          >
            {{ i <= Math.round(ratingStats.averageRating) ? '★' : '☆' }}
          </span>
        </div>
        <span class="total-ratings">({{ ratingStats.totalRatings }} ratings)</span>
      </div>
    </div>
    
    <!-- Rating Distribution -->
    <div class="rating-distribution">
      <div 
        v-for="(count, stars) in ratingStats.ratingDistribution" 
        :key="stars"
        class="rating-bar"
      >
        <span class="stars-label">{{ getStarsLabel(stars) }}</span>
        <div class="bar-container">
          <div 
            class="bar-fill"
            :style="{ width: getBarWidth(count) }"
          ></div>
        </div>
        <span class="count">{{ count }}</span>
      </div>
    </div>
    
    <!-- User Rating -->
    <div class="user-rating">
      <h4>Rate this content</h4>
      <div class="star-input">
        <span 
          v-for="i in 5" 
          :key="i"
          :class="['star', { 'filled': i <= (hoverRating || userRating) }]"
          @click="setRating(i)"
          @mouseenter="hoverRating = i"
          @mouseleave="hoverRating = 0"
        >
          {{ i <= (hoverRating || userRating) ? '★' : '☆' }}
        </span>
      </div>
      <button 
        v-if="userRating > 0" 
        @click="submitRating"
        :disabled="isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Rating' }}
      </button>
      <p v-if="userRating > 0" class="rating-note">
        You selected {{ userRating }} star{{ userRating > 1 ? 's' : '' }}
      </p>
      <!-- 动态显示冷却时间警告，只在需要时显示 -->
      <div v-if="ratingCooldownWarning" class="cooldown-note">
        ⏰ {{ ratingCooldownWarning }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  contentType: String,
  contentId: Number
})

const userRating = ref(0)
const hoverRating = ref(0)
const isSubmitting = ref(false)
const lastRatingTime = ref(0) // 记录上次评分时间
const ratingCooldownWarning = ref('') // 评分冷却时间警告
const ratingStats = ref({
  averageRating: 0,
  totalRatings: 0,
  ratingDistribution: {
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  }
})

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchRatingStats = async () => {
  // 检查必要的props
  if (!props.contentType || !props.contentId) {
    console.warn('Missing required props for rating component:', { 
      contentType: props.contentType, 
      contentId: props.contentId 
    })
    return
  }
  
  try {
    const response = await axios.get(
      `${apiBase}/api/ratings/${props.contentType}/${props.contentId}`
    )
    if (response.data.success) {
      ratingStats.value = response.data.data
      userRating.value = response.data.data.userRating || 0
    }
  } catch (error) {
    console.error('Failed to fetch rating stats:', error)
  }
}

const setRating = (rating) => {
  userRating.value = rating
}

const submitRating = async () => {
  if (!userRating.value) return
  
  // 检查必要的props
  if (!props.contentType || !props.contentId) {
    alert('Missing required parameters, cannot submit rating')
    return
  }
  
  // 检查评分间隔限制
  const now = Date.now()
  const timeSinceLastRating = now - lastRatingTime.value
  const oneMinute = 60 * 1000 // 1分钟 = 60秒 * 1000毫秒
  
  if (timeSinceLastRating < oneMinute) {
    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastRating) / 1000)
    ratingCooldownWarning.value = `Please wait ${remainingSeconds} seconds before submitting another rating`
    return
  }
  
  isSubmitting.value = true
  try {
    const response = await axios.post(
      `${apiBase}/api/ratings/${props.contentType}/${props.contentId}`,
      { rating: userRating.value }
    )
    
    if (response.data.success) {
      // 记录评分时间
      lastRatingTime.value = now
      // 清除警告
      ratingCooldownWarning.value = ''
      // 重新获取评分统计
      await fetchRatingStats()
      // 显示成功提示
      alert('Rating submitted successfully!')
    }
  } catch (error) {
    console.error('Failed to submit rating:', error)
    alert('Failed to submit rating, please try again later')
  } finally {
    isSubmitting.value = false
  }
}

const getStarsLabel = (stars) => {
  const labels = {
    fiveStar: '5★',
    fourStar: '4★',
    threeStar: '3★',
    twoStar: '2★',
    oneStar: '1★'
  }
  return labels[stars] || stars
}

const getBarWidth = (count) => {
  if (ratingStats.value.totalRatings === 0) return '0%'
  return `${(count / ratingStats.value.totalRatings) * 100}%`
}

const getRatingCooldown = () => {
  const now = Date.now()
  const timeSinceLastRating = now - lastRatingTime.value
  const oneMinute = 60 * 1000
  const remaining = Math.ceil((oneMinute - timeSinceLastRating) / 1000)
  return remaining > 0 ? remaining : 0
}

onMounted(fetchRatingStats)
</script>

<style scoped>
.anonymous-rating {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.rating-header h3 {
  margin: 0;
  color: #fff;
}

.average-rating {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffd700;
  margin-right: 12px;
}

.stars {
  display: inline-block;
}

.star {
  font-size: 1.2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.total-ratings {
  color: #888;
  font-size: 0.9rem;
  margin-left: 8px;
}

.rating-distribution {
  margin: 20px 0;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.stars-label {
  width: 40px;
  color: #ccc;
  font-size: 0.9rem;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 4px;
  margin: 0 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #ffd700;
  transition: width 0.3s;
}

.count {
  width: 30px;
  text-align: right;
  color: #888;
  font-size: 0.9rem;
}

.user-rating {
  border-top: 1px solid #333;
  padding-top: 20px;
  margin-top: 20px;
}

.user-rating h4 {
  margin: 0 0 16px 0;
  color: #fff;
}

.star-input {
  margin: 16px 0;
}

.star-input .star {
  font-size: 1.5rem;
  margin-right: 8px;
}

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.rating-note {
  color: #888;
  font-size: 0.9rem;
  margin-top: 8px;
}

.cooldown-note {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 8px;
  font-weight: 500;
}
</style>

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .anonymous-rating {
    padding: 20px;
    margin: 16px 0;
  }
  
  .rating-header {
    margin-bottom: 16px;
  }
  
  .rating-header h3 {
    font-size: 18px;
  }
  
  .average-rating {
    font-size: 2rem;
    margin-right: 10px;
  }
  
  .star {
    font-size: 1.1rem;
  }
  
  .total-ratings {
    font-size: 16px;
    margin-left: 6px;
  }
  
  .rating-distribution {
    margin: 16px 0;
  }
  
  .rating-bar {
    margin: 6px 0;
  }
  
  .stars-label {
    width: 36px;
    font-size: 16px;
  }
  
  .bar-container {
    margin: 0 10px;
  }
  
  .count {
    width: 28px;
    font-size: 16px;
  }
  
  .user-rating {
    padding-top: 16px;
    margin-top: 16px;
  }
  
  .user-rating h4 {
    margin-bottom: 14px;
    font-size: 16px;
  }
  
  .star-input {
    margin: 14px 0;
  }
  
  .star-input .star {
    font-size: 1.3rem;
    margin-right: 6px;
  }
  
  .submit-btn {
    padding: 7px 14px;
    font-size: 16px;
  }
  
  .rating-note {
    font-size: 16px;
    margin-top: 6px;
  }
  
  .cooldown-note {
    font-size: 16px;
    margin-top: 6px;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .anonymous-rating {
    padding: 16px;
    margin: 10px 0;
  }
  
  .rating-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
  }
  
  .rating-header h3 {
    font-size: 16px;
    margin: 0;
  }
  
  .rating-summary {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .average-rating {
    font-size: 24px;
    margin-right: 8px;
  }
  
  .star {
    font-size: 12px;
  }
  
  .total-ratings {
    font-size: 12px;
    margin-left: 4px;
  }
  
  .rating-distribution {
    margin: 12px 0;
  }
  
  .rating-bar {
    margin: 4px 0;
  }
  
  .stars-label {
    width: 32px;
    font-size: 12px;
  }
  
  .bar-container {
    height: 6px;
    margin: 0 8px;
  }
  
  .count {
    width: 24px;
    font-size: 12px;
  }
  
  .user-rating {
    padding-top: 12px;
    margin-top: 12px;
  }
  
  .user-rating h4 {
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  .star-input {
    margin: 10px 0;
  }
  
  .star-input .star {
    font-size: 20px;
    margin-right: 4px;
  }
  
  .submit-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .rating-note {
    font-size: 12px;
    margin-top: 6px;
  }
  
  .cooldown-note {
    font-size: 12px;
    margin-top: 6px;
  }
}