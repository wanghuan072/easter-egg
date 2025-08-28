<template>
  <div class="news-view">
    <!-- Header Component -->
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="hero-title-part-1">📰</span>
              <br />
              <span class="hero-title-part-2">News</span>
            </h1>
            <p class="hero-description">
              Stay updated with the latest easter egg discoveries and vault updates.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Coming Soon Section -->
    <section class="coming-soon-section">
      <div class="container">
        <div class="coming-soon-content">
          <div class="coming-soon-icon">🚧</div>
          <h2 class="coming-soon-title">Coming Soon</h2>
          <p class="coming-soon-description">
            We're working hard to bring you the latest news and updates from the Easter Egg Vault.
            <br />
            This section will feature breaking discoveries, community highlights, and vault announcements.
          </p>
          <div class="coming-soon-features">
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span class="feature-text">Latest Discoveries</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">👥</span>
              <span class="feature-text">Community Updates</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📢</span>
              <span class="feature-text">Vault Announcements</span>
            </div>
          </div>
          <div class="back-home">
            <a href="/" class="back-home-btn">← Back to Home</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.news-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #100e19;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #100e19 0%, #0f172a 50%, #100e19 100%);
  margin-top: 80px;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 72px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.1;
}

.hero-title-part-1 {
  font-size: 96px;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
}

.hero-title-part-2 {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.5));
}

.hero-description {
  font-size: 24px;
  color: #a0a0a0;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Coming Soon Section */
.coming-soon-section {
  padding: 120px 0;
  background-color: #0f172a;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.coming-soon-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.coming-soon-icon {
  font-size: 120px;
  margin-bottom: 32px;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
}

.coming-soon-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
}

.coming-soon-description {
  font-size: 20px;
  color: #a0a0a0;
  margin-bottom: 48px;
  line-height: 1.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.coming-soon-features {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background-color: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  transition: all 0.3s ease;
  min-width: 160px;
}

.feature-item:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.4));
}

.feature-text {
  font-size: 16px;
  font-weight: 600;
  color: #f5f5f5;
}

.back-home {
  margin-top: 48px;
}

.back-home-btn {
  display: inline-block;
  padding: 16px 32px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
}

.back-home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }
  
  .hero-title-part-1 {
    font-size: 64px;
  }
  
  .coming-soon-title {
    font-size: 36px;
  }
  
  .coming-soon-features {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .feature-item {
    min-width: 200px;
  }
}
</style>
