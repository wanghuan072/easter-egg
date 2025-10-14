<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="nav-logo">
          <img src="/images/logo.png" alt="EasterEggVault" class="logo-image" />
          <div class="logo-text">EasterEggVault</div>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="nav-menu desktop-nav">
          <ul class="nav-list">
            <li><a :href="getLocalizedPath('/')" class="nav-item">{{ $t('nav.home') }}</a></li>
            <li><a :href="getLocalizedPath('/games')" class="nav-item">{{ $t('nav.videoGames') }}</a></li>
            <li><a :href="getLocalizedPath('/movies')" class="nav-item">{{ $t('nav.movies') }}</a></li>
            <li><a :href="getLocalizedPath('/tv')" class="nav-item">{{ $t('nav.tvShows') }}</a></li>
            <li><a :href="getLocalizedPath('/news')" class="nav-item">{{ $t('nav.news') }}</a></li>
          </ul>
        </nav>

        <!-- 语言切换器 -->
        <div class="language-switcher">
          <select v-model="currentLocale" @change="changeLocale" class="locale-select">
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-button" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- 移动端弹出菜单 -->
      <div class="mobile-menu-overlay" :class="{ 'active': isMobileMenuOpen }" @click="closeMobileMenu"></div>
      <nav class="mobile-nav" :class="{ 'active': isMobileMenuOpen }">
        <ul class="mobile-nav-list">
          <li><a :href="getLocalizedPath('/')" class="mobile-nav-item" @click="closeMobileMenu">{{ $t('nav.home') }}</a></li>
          <li><a :href="getLocalizedPath('/games')" class="mobile-nav-item" @click="closeMobileMenu">{{ $t('nav.videoGames') }}</a></li>
          <li><a :href="getLocalizedPath('/movies')" class="mobile-nav-item" @click="closeMobileMenu">{{ $t('nav.movies') }}</a></li>
          <li><a :href="getLocalizedPath('/tv')" class="mobile-nav-item" @click="closeMobileMenu">{{ $t('nav.tvShows') }}</a></li>
          <li><a :href="getLocalizedPath('/news')" class="mobile-nav-item" @click="closeMobileMenu">{{ $t('nav.news') }}</a></li>
        </ul>
      </nav>
    </div>
  </header>



  
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { supportedLanguages } from '@/router/index.js'

const { locale } = useI18n()
const route = useRoute()
const currentLocale = ref(locale.value)

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 获取本地化路径的辅助函数
const getLocalizedPath = (path) => {
  const lang = locale.value
  return lang === 'en' ? path : `/${lang}${path}`
}

// 切换语言
const changeLocale = () => {
  const newLang = currentLocale.value
  
  // ⚠️ 关键：在跳转前先更新 localStorage 和 i18n，确保页面重新加载后使用正确的语言
  localStorage.setItem('locale', newLang)
  locale.value = newLang
  
  // 获取当前路由的基础路径（移除所有语言前缀）
  const currentPath = route.path
  let basePath = currentPath
  
  // 移除所有支持的语言前缀
  supportedLanguages.forEach(lang => {
    if (lang !== 'en') {
      basePath = basePath.replace(new RegExp(`^/${lang}`), '')
    }
  })
  
  // 确保基础路径不为空
  basePath = basePath || '/'
  
  // 根据目标语言构建新路径
  let targetPath
  if (newLang === 'en') {
    targetPath = basePath
  } else {
    targetPath = basePath === '/' ? `/${newLang}` : `/${newLang}${basePath}`
  }
  
  // 使用window.location进行页面跳转
  window.location.href = targetPath
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(16, 14, 25, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1e293b;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.nav-menu {
  display: flex;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 32px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-logo .logo-image {
  width: 40px;
  height: 40px;
}

.nav-logo .logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}



.nav-item {
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  display: block;
}

.nav-item:hover {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

/* Router link specific styles */
.nav-item.router-link-active {
  color: #8b5cf6;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

/* 移动端菜单按钮 */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: #f5f5f5;
  margin: 3px 0;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-button.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端菜单覆盖层 */
.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
}

/* 移动端导航菜单 */
.mobile-nav {
  display: none;
  position: fixed;
  top: 0;
  right: -300px;
  width: 280px;
  height: 100vh;
  background-color: rgba(16, 14, 25, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid #334155;
  z-index: 1000;
  transition: right 0.3s ease;
  padding-top: 80px;
}

.mobile-nav.active {
  right: 0;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 20px 0;
}

.mobile-nav-list li {
  margin: 0;
}

.mobile-nav-item {
  display: block;
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  padding: 16px 24px;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
}

.mobile-nav-item:hover {
  color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

.mobile-nav-item.router-link-active {
  color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.2);
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .nav-logo .logo-text {
    font-size: 20px;
  }
  
  .nav-list {
    gap: 24px;
  }
  
  .nav-item {
    font-size: 16px;
  }
  
  .header-content {
    padding: 12px 0;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .header {
    position: fixed;
  }
  
  .header-content {
    justify-content: space-between;
    padding: 10px 0;
  }
  
  .nav-logo .logo-text {
    font-size: 24px;
  }
  
  /* 隐藏桌面端导航 */
  .desktop-nav {
    display: none;
  }
  
  /* 显示移动端菜单按钮 */
  .mobile-menu-button {
    display: flex;
  }
  
  /* 显示移动端菜单 */
  .mobile-menu-overlay {
    display: block;
  }
  
  .mobile-nav {
    display: block;
  }
  
  .mobile-nav-item {
    font-size: 12px;
    padding: 12px 20px;
  }
}

/* 语言切换器样式 */
.language-switcher {
  margin-left: 20px;
}

.locale-select {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
}

.locale-select:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
}

.locale-select:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.locale-select option {
  background: #1a1625;
  color: #e2e8f0;
}

/* 语言切换器响应式 */
@media (max-width: 1024px) {
  .language-switcher {
    margin-left: 16px;
  }
  
  .locale-select {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .language-switcher {
    margin-left: auto;
    margin-right: 10px;
  }
  
  .locale-select {
    padding: 6px 8px;
    font-size: 12px;
  }
}

</style>
