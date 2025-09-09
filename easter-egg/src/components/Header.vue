<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="nav-logo">
          <div class="logo-text">EasterEggVault</div>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="nav-menu desktop-nav">
          <ul class="nav-list">
            <li><a href="/" class="nav-item">Home</a></li>
            <li><a href="/games" class="nav-item">Video Games</a></li>
            <li><a href="/movies" class="nav-item">Movies</a></li>
            <li><a href="/tv" class="nav-item">TV Shows</a></li>
            <li><a href="/news" class="nav-item">News</a></li>
          </ul>
        </nav>

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
          <li><a href="/" class="mobile-nav-item" @click="closeMobileMenu">Home</a></li>
          <li><a href="/games" class="mobile-nav-item" @click="closeMobileMenu">Video Games</a></li>
          <li><a href="/movies" class="mobile-nav-item" @click="closeMobileMenu">Movies</a></li>
          <li><a href="/tv" class="mobile-nav-item" @click="closeMobileMenu">TV Shows</a></li>
          <li><a href="/news" class="mobile-nav-item" @click="closeMobileMenu">News</a></li>
        </ul>
      </nav>
    </div>
  </header>



  
</template>

<script setup>
import { ref } from 'vue'

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

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

</style>
