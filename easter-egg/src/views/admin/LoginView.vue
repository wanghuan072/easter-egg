<template>
  <div class="login-view">
    <!-- 背景装饰 -->
    <div class="login-decorations">
      <div class="tech-circle tech-circle-1"></div>
      <div class="tech-circle tech-circle-2"></div>
      <div class="tech-circle tech-circle-3"></div>
    </div>

    <!-- 登录表单 -->
    <div class="login-container">
      <div class="login-card">
        <!-- Logo和标题 -->
        <div class="login-header">
          <div class="logo-text">EasterEggVault</div>
          <h1 class="login-title">管理员登录</h1>
          <p class="login-subtitle">请输入您的凭据以访问管理后台</p>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- 用户名输入 -->
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-container">
              <div class="input-icon">👤</div>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-container">
              <div class="input-icon">🔒</div>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="请输入密码"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="error-message">
            ⚠️ {{ errorMessage }}
          </div>

          <!-- 登录按钮 -->
          <button 
            type="submit" 
            class="login-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>

        <!-- 返回首页链接 -->
        <div class="back-to-home">
          <router-link to="/" class="back-link">
            ← 返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getApiUrl } from '@/config/env.js'

const router = useRouter()
const route = useRoute()

// 表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 状态管理
const isLoading = ref(false)
const errorMessage = ref('')

// 处理登录
const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    errorMessage.value = '请填写用户名和密码'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 调用真实登录API
    const response = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    })

    const data = await response.json()

    if (data.success) {
      // 登录成功，存储token和用户信息
      localStorage.setItem('admin_token', data.data.token)
      localStorage.setItem('admin_user', data.data.user.username)
      
      // 检查是否有重定向路径
      const redirectPath = route.query.redirect || '/admin/dashboard'
      router.push(redirectPath)
    } else {
      // 登录失败
      errorMessage.value = data.error || '登录失败，请检查用户名和密码'
    }

  } catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.tech-circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.tech-circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.tech-circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 登录容器 */
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  z-index: 10;
}

.login-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #f5f5f5;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #a0a0a0;
  font-size: 14px;
}

/* 表单样式 */
.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  color: #f5f5f5;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #8b5cf6;
  font-size: 16px;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #f5f5f5;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: rgba(51, 65, 85, 1);
}

.form-input::placeholder {
  color: #6b7280;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 错误消息 */
.error-message {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 返回首页链接 */
.back-to-home {
  text-align: center;
}

.back-link {
  color: #8b5cf6;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #06b6d4;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.6);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .logo-text {
    font-size: 24px;
  }
}
</style>
