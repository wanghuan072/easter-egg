<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="nav-logo">
          <div class="logo-text">EasterEggVault</div>
        </div>

        <nav class="nav-menu">
          <ul class="nav-list">
            <li><router-link to="/" class="nav-item">Home</router-link></li>
            <li><router-link to="/games" class="nav-item">Video Games</router-link></li>
            <li><router-link to="/movies" class="nav-item">Movies</router-link></li>
            <li><router-link to="/tv" class="nav-item">TV Shows</router-link></li>
            <li><router-link to="/news" class="nav-item">News</router-link></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
// Header component logic can be added here
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

</style>
