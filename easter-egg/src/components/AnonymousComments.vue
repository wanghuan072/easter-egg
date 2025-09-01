<template>
  <div class="anonymous-comments">
    <h3>User Comments ({{ comments.length }})</h3>
    
    <!-- Comment Form -->
    <div class="comment-form">
      <div class="form-row">
        <input 
          v-model="newComment.nickname"
          type="text"
          placeholder="Your nickname"
          maxlength="50"
          class="nickname-input"
        />
        <button 
          @click="submitComment"
          :disabled="!canSubmit || isSubmitting"
          class="submit-btn"
        >
          {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>
      <textarea 
        v-model="newComment.content"
        placeholder="Share your thoughts..."
        rows="3"
        maxlength="1000"
        class="content-input"
      ></textarea>
      <div class="char-count">
        {{ newComment.content.length }}/1000
      </div>
      <!-- 动态显示冷却时间警告，只在需要时显示 -->
      <div v-if="commentCooldownWarning" class="cooldown-note">
        ⏰ {{ commentCooldownWarning }}
      </div>
    </div>
    
    <!-- Comments List -->
    <div class="comments-list">
      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-header">
          <span class="nickname">{{ comment.nickname }}</span>
          <span class="time">{{ formatTime(comment.created_at) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        
        <!-- Reply Button -->
        <div class="comment-actions">
          <button 
            @click="showReplyForm(comment.id)"
            class="reply-btn"
          >
            Reply
          </button>
        </div>
        
        <!-- Reply Form -->
        <div v-if="activeReplyForm === comment.id" class="reply-form">
          <div class="form-row">
            <input 
              v-model="replyForm.nickname"
              type="text"
              placeholder="Your nickname"
              maxlength="50"
              class="nickname-input"
            />
            <button 
              @click="submitReply(comment.id)"
              :disabled="!canSubmitReply || isSubmittingReply"
              class="submit-btn"
            >
              {{ isSubmittingReply ? 'Replying...' : 'Reply' }}
            </button>
          </div>
          <textarea 
            v-model="replyForm.content"
            placeholder="Write your reply..."
            rows="2"
            maxlength="500"
            class="content-input"
          ></textarea>
          <!-- 动态显示冷却时间警告，只在需要时显示 -->
          <div v-if="replyCooldownWarning" class="cooldown-note">
            {{ replyCooldownWarning }}
          </div>
        </div>
        
        <!-- Replies List -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies">
          <div 
            v-for="reply in comment.replies" 
            :key="reply.id"
            class="reply-item"
          >
            <div class="reply-header">
              <span class="nickname">{{ reply.nickname }}</span>
              <span class="time">{{ formatTime(reply.created_at) }}</span>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="pagination.pages > 1" class="pagination">
      <button 
        v-for="page in pagination.pages" 
        :key="page"
        :class="['page-btn', { 'active': page === pagination.page }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
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

const comments = ref([])
const pagination = ref({ page: 1, pages: 1, total: 0 })
const isSubmitting = ref(false)
const isSubmittingReply = ref(false)
const activeReplyForm = ref(null)
const lastCommentTime = ref(0) // 记录上次评论时间
const lastReplyTime = ref(0) // 记录上次回复时间
const commentCooldownWarning = ref('') // 评论冷却时间警告
const replyCooldownWarning = ref('') // 回复冷却时间警告

const newComment = ref({
  nickname: '',
  content: ''
})

const replyForm = ref({
  nickname: '',
  content: ''
})

const canSubmit = computed(() => {
  return newComment.value.nickname.trim() && 
         newComment.value.content.trim() && 
         !isSubmitting.value
})

const canSubmitReply = computed(() => {
  return replyForm.value.nickname.trim() && 
         replyForm.value.content.trim() && 
         !isSubmittingReply.value
})

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const fetchComments = async (page = 1) => {
  // 检查必要的props
  if (!props.contentType || !props.contentId) {
    console.warn('Missing required props for comments component:', { 
      contentType: props.contentType, 
      contentId: props.contentId 
    })
    return
  }
  
  try {
    const response = await axios.get(
      `${apiBase}/api/comments/${props.contentType}/${props.contentId}`,
      { params: { page, limit: 10 } }
    )
    
    if (response.data.success) {
      comments.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
}

const submitComment = async () => {
  if (!canSubmit.value) return
  
  // 检查必要的props
  if (!props.contentType || !props.contentId) {
    alert('Missing required parameters, cannot submit comment')
    return
  }
  
  // 检查评论间隔限制
  const now = Date.now()
  const timeSinceLastComment = now - lastCommentTime.value
  const oneMinute = 60 * 1000 // 1分钟 = 60秒 * 1000毫秒
  
  if (timeSinceLastComment < oneMinute) {
    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastComment) / 1000)
    commentCooldownWarning.value = `Please wait ${remainingSeconds} seconds before posting another comment`
    return
  }
  
  isSubmitting.value = true
  try {
    const response = await axios.post(
      `${apiBase}/api/comments/${props.contentType}/${props.contentId}`,
      newComment.value
    )
    
    if (response.data.success) {
      // 记录评论时间
      lastCommentTime.value = now
      // 清空表单
      newComment.value = { nickname: '', content: '' }
      commentCooldownWarning.value = '' // 清除警告
      // 重新获取评论
      await fetchComments(1)
      alert('Comment posted successfully!')
    }
  } catch (error) {
    console.error('Failed to submit comment:', error)
    alert('Failed to post comment, please try again later')
  } finally {
    isSubmitting.value = false
  }
}

const showReplyForm = (commentId) => {
  activeReplyForm.value = activeReplyForm.value === commentId ? null : commentId
  if (activeReplyForm.value === commentId) {
    replyForm.value = { nickname: '', content: '' }
  }
}

const submitReply = async (commentId) => {
  if (!canSubmitReply.value) return
  
  // 检查必要的props
  if (!props.contentType || !props.contentId) {
    alert('Missing required parameters, cannot submit reply')
    return
  }
  
  // 检查回复间隔限制
  const now = Date.now()
  const timeSinceLastReply = now - lastReplyTime.value
  const oneMinute = 60 * 1000 // 1分钟 = 60秒 * 1000毫秒
  
  if (timeSinceLastReply < oneMinute) {
    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastReply) / 1000)
    replyCooldownWarning.value = `Please wait ${remainingSeconds} seconds before posting another reply`
    return
  }
  
  isSubmittingReply.value = true
  try {
    const response = await axios.post(
      `${apiBase}/api/comments/${props.contentType}/${props.contentId}`,
      {
        ...replyForm.value,
        parentId: commentId
      }
    )
    
    if (response.data.success) {
      // 记录回复时间
      lastReplyTime.value = now
      // 清空表单并隐藏
      replyForm.value = { nickname: '', content: '' }
      activeReplyForm.value = null
      replyCooldownWarning.value = '' // 清除警告
      // 重新获取评论
      await fetchComments(pagination.value.page)
      alert('Reply posted successfully!')
    }
  } catch (error) {
    console.error('Failed to submit reply:', error)
    alert('Failed to post reply, please try again later')
  } finally {
    isSubmittingReply.value = false
  }
}

const changePage = (page) => {
  fetchComments(page)
}

const getCommentCooldown = () => {
  const now = Date.now()
  const timeSinceLastComment = now - lastCommentTime.value
  const oneMinute = 60 * 1000
  const remaining = Math.ceil((oneMinute - timeSinceLastComment) / 1000)
  return remaining > 0 ? remaining : 0
}

const getReplyCooldown = () => {
  const now = Date.now()
  const timeSinceLastReply = now - lastReplyTime.value
  const oneMinute = 60 * 1000
  const remaining = Math.ceil((oneMinute - timeSinceLastReply) / 1000)
  return remaining > 0 ? remaining : 0
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.anonymous-comments {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
}

.anonymous-comments h3 {
  margin: 0 0 20px 0;
  color: #fff;
}

.comment-form {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.nickname-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2a2a2a;
  color: white;
}

.content-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2a2a2a;
  color: white;
  resize: vertical;
}

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.char-count {
  text-align: right;
  color: #888;
  font-size: 0.9rem;
  margin-top: 4px;
}

.comment-item {
  border-bottom: 1px solid #333;
  padding: 16px 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.nickname {
  font-weight: bold;
  color: #007bff;
}

.time {
  color: #888;
  font-size: 0.9rem;
}

.comment-content {
  line-height: 1.6;
  margin-bottom: 12px;
  color: #ccc;
}

.reply-btn {
  background: none;
  border: 1px solid #666;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.reply-form {
  margin: 12px 0;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 6px;
}

.replies {
  margin-left: 20px;
  margin-top: 12px;
}

.reply-item {
  padding: 8px 0;
  border-bottom: 1px solid #444;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.reply-content {
  font-size: 0.9rem;
  color: #ccc;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  background: #333;
  border: 1px solid #555;
  color: #ccc;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

.cooldown-note {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 8px;
  font-weight: 500;
  text-align: center;
  padding: 8px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}
</style>
