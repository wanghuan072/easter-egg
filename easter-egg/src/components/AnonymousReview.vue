<template>
  <div class="review-section">
    <div class="review-header">
      <h3>Rate & Comment</h3>
      <div class="rating-stats">
        <div class="average-rating">
          <span class="rating-value">{{ ratingStats.averageRating.toFixed(1) }}</span>
          <div class="stars">
            <span v-for="i in 5" :key="i" :class="['star', { 'filled': i <= Math.round(ratingStats.averageRating) }]">
              {{ i <= Math.round(ratingStats.averageRating) ? '★' : '☆' }} </span>
          </div>
        </div>
        <div class="total-reviews">
          {{ ratingStats.totalRatings }} reviews
        </div>
      </div>
    </div>

    <!-- 用户评价表单 -->
    <div class="review-form">
      <h4>Write Your Review</h4>

      <!-- 昵称输入 -->
      <div class="form-group">
        <label for="nickname">Nickname *</label>
        <input v-model="reviewForm.nickname" type="text" id="nickname" placeholder="Enter your nickname" required
          class="form-input" />
      </div>

      <!-- 评分选择 -->
      <div class="form-group">
        <label>Rating *</label>
        <div class="star-input">
          <span v-for="i in 5" :key="i" :class="['star', { 'filled': i <= (hoverRating || reviewForm.rating) }]"
            @click="setRating(i)" @mouseenter="hoverRating = i" @mouseleave="hoverRating = 0">
            {{ i <= (hoverRating || reviewForm.rating) ? '★' : '☆' }} </span>
        </div>
        <div class="rating-note" v-if="reviewForm.rating > 0">
          You selected {{ reviewForm.rating }} star{{ reviewForm.rating > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- 评论内容 -->
      <div class="form-group">
        <label for="comment">Comment *</label>
        <textarea v-model="reviewForm.comment" id="comment" placeholder="Share your thoughts about this content..."
          required rows="4" class="form-textarea"></textarea>
        <div class="char-count">
          {{ reviewForm.comment.length }}/1000
        </div>
      </div>

      <!-- 提交按钮 -->
      <button @click="submitReview" :disabled="!canSubmit || isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>

      <!-- 冷却时间警告 -->
      <div v-if="cooldownWarning" class="cooldown-note">
        ⏰ {{ cooldownWarning }}
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="reviews-list">
      <h4>All Reviews ({{ reviews.length }})</h4>

      <div v-if="reviews.length === 0" class="no-reviews">
        <p>No reviews yet. Be the first to share your thoughts!</p>
      </div>

      <div v-else class="review-items">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              <span class="nickname">{{ review.nickname }}</span>
              <div class="stars">
                <span v-for="i in 5" :key="i" :class="['star', { 'filled': i <= review.rating }]">
                  {{ i <= review.rating ? '★' : '☆' }} </span>
              </div>
            </div>
            <span class="review-date">{{ formatDate(review.created_at) }}</span>
          </div>

          <div class="review-content">
            {{ review.comment_text }}
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { showErrorMessage } from '@/utils/errorHandler.js'

const props = defineProps({
  contentType: String,
  contentId: Number
})

// 响应式数据
const reviewForm = ref({
  nickname: '',
  rating: 0,
  comment: ''
})

const hoverRating = ref(0)
const isSubmitting = ref(false)
const lastReviewTime = ref(0)
const cooldownWarning = ref('')

const reviews = ref([])
const ratingStats = ref({
  averageRating: 0,
  totalRatings: 0
})

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 计算属性
const canSubmit = computed(() => {
  return reviewForm.value.nickname.trim() &&
    reviewForm.value.rating > 0 &&
    reviewForm.value.comment.trim() &&
    reviewForm.value.comment.length <= 1000
})

// 设置评分
const setRating = (rating) => {
  reviewForm.value.rating = rating
}

// 提交评价
const submitReview = async () => {
  if (!canSubmit.value) return

  // 检查冷却时间
  const now = Date.now()
  const oneMinute = 60 * 1000
  const timeSinceLastReview = now - lastReviewTime.value

  if (timeSinceLastReview < oneMinute) {
    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastReview) / 1000)
    cooldownWarning.value = `Please wait ${remainingSeconds} seconds before submitting another review`
    return
  }

  isSubmitting.value = true

  try {
    // 验证必要的props
    if (!props.contentId || !props.contentType) {
      console.error('❌ Missing props:', { contentId: props.contentId, contentType: props.contentType })
      throw new Error('Missing required content information')
    }

    const reviewData = {
      content_id: parseInt(props.contentId),
      content_type: props.contentType,
      rating: parseInt(reviewForm.value.rating),
      nickname: reviewForm.value.nickname.trim(),
      comment_text: reviewForm.value.comment.trim()
    }

    console.log('🔍 提交评价数据:', reviewData)
    console.log('🌐 API地址:', `${apiBase}/api/reviews`)

    const response = await axios.post(`${apiBase}/api/reviews`, reviewData, {
      timeout: 10000, // 10秒超时
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('📥 服务器响应:', response)

    if (response.data && response.data.success) {
      // 重置表单
      reviewForm.value = {
        nickname: '',
        rating: 0,
        comment: ''
      }
      hoverRating.value = 0
      lastReviewTime.value = now
      cooldownWarning.value = ''

      // 刷新数据
      await Promise.all([
        fetchReviews(),
        fetchRatingStats()
      ])
      alert('Review submitted successfully!')
    } else {
      console.error('❌ 评价提交失败:', response.data)
      throw new Error(response.data?.message || 'Server returned unsuccessful response')
    }
  } catch (error) {
    console.error('❌ 评价提交错误:', error)
    
    // 详细的错误日志
    if (error.response) {
      console.error('错误响应状态:', error.response.status)
      console.error('错误响应数据:', error.response.data)
      console.error('错误响应头:', error.response.headers)
    } else if (error.request) {
      console.error('请求未收到响应:', error.request)
    } else {
      console.error('请求配置错误:', error.message)
    }
    
    showErrorMessage(error, '提交评价')
  } finally {
    isSubmitting.value = false
  }
}

// 显示回复表单
const showReplyForm = (reviewId) => {
  activeReplyForm.value = reviewId
  replyForm.value = {
    nickname: '',
    comment: ''
  }
}



// 获取评价列表
const fetchReviews = async () => {
  try {
    const response = await axios.get(`${apiBase}/api/reviews`, {
      params: {
        content_id: props.contentId,
        content_type: props.contentType
      }
    })

    if (response.data.success) {
      reviews.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  }
}

// 获取评分统计
const fetchRatingStats = async () => {
  try {
    const response = await axios.get(`${apiBase}/api/reviews/stats`, {
      params: {
        content_id: props.contentId,
        content_type: props.contentType
      }
    })

    if (response.data.success) {
      ratingStats.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch rating stats:', error)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 检查API连接
const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${apiBase}/health`)
    console.log('API connection check:', response.data)
    return true
  } catch (error) {
    console.error('API connection failed:', error)
    return false
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  console.log('AnonymousReview mounted with props:', {
    contentId: props.contentId,
    contentType: props.contentType,
    apiBase
  })

  // 检查API连接
  const isApiConnected = await checkApiConnection()
  if (!isApiConnected) {
    console.warn('API connection failed. Reviews may not work properly.')
  }

  if (props.contentId && props.contentType) {
    Promise.all([
      fetchReviews(),
      fetchRatingStats()
    ]).catch(error => {
      console.error('Failed to load initial data:', error)
    })
  } else {
    console.warn('Missing required props for AnonymousReview component')
  }
})
</script>

<style scoped>
.review-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  margin-bottom: 30px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.review-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.rating-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-value {
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 16px;
  color: #ddd;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffd700;
}

.total-reviews {
  color: #a0a0a0;
  font-size: 14px;
}

/* 评价表单 */
.review-form {
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.review-form h4 {
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.8);
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #a0a0a0;
  margin-top: 5px;
}

.star-input {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.star-input .star {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-input .star:hover {
  transform: scale(1.1);
}

.rating-note {
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cooldown-note {
  margin-top: 15px;
  padding: 12px 16px;
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

/* 评价列表 */
.reviews-list h4 {
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.no-reviews {
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 20px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.review-item .review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nickname {
  font-weight: 600;
  color: #8b5cf6;
  font-size: 14px;
}

.review-date {
  color: #a0a0a0;
  font-size: 12px;
}

.review-content {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 15px;
}

.reply-btn {
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reply-btn:hover {
  background: rgba(139, 92, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .rating-stats {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .review-item .review-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .replies {
    padding-left: 15px;
  }
}
</style>
