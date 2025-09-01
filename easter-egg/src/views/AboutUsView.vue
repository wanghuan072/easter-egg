<template>
  <div class="about-us-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">About Us</h1>
          <p class="hero-description">
            Learn more about EasterEggVault and our mission
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-body">
            <h2>Our Mission</h2>
            <p>EasterEggVault is dedicated to uncovering and documenting the hidden secrets, easter eggs, and fascinating details that creators embed in video games, movies, and TV shows. We believe these hidden gems add depth and wonder to the entertainment experience.</p>

            <h2>What We Do</h2>
            <p>Our platform serves as a comprehensive database and community hub for easter egg enthusiasts. We research, document, and share discoveries from across the entertainment industry, making it easy for fans to find and appreciate these hidden treasures.</p>

            <h2>Our Community</h2>
            <p>We're proud to host a vibrant community of secret hunters, gaming enthusiasts, movie buffs, and TV show fans. Our users contribute discoveries, share insights, and help us maintain the most comprehensive easter egg database on the web.</p>

            <h2>Content Categories</h2>
            <p>Our platform covers a wide range of content:</p>
            <ul>
              <li><strong>Video Games:</strong> Hidden levels, secret characters, developer jokes, and more</li>
              <li><strong>Movies:</strong> Hidden references, background details, and director's secrets</li>
              <li><strong>TV Shows:</strong> Callbacks, hidden messages, and production easter eggs</li>
              <li><strong>News:</strong> Latest discoveries and updates from the entertainment world</li>
            </ul>

            <h2>Our Values</h2>
            <p>We are committed to:</p>
            <ul>
              <li>Accuracy and thorough research</li>
              <li>Respect for intellectual property rights</li>
              <li>Community engagement and collaboration</li>
              <li>Continuous improvement and expansion</li>
            </ul>

            <h2>Contact Information</h2>
            <p>Have questions, suggestions, or want to contribute? We'd love to hear from you!</p>
            <p>Email: <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>

            <h2>Last Updated</h2>
            <p>September 1, 2025</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.about-us-view {
  min-height: 100vh;
  background-color: #0f172a;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 80px 0 60px;
  position: relative;
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.125rem;
  color: #a0a0a0;
}

/* Content Section */
.content-section {
  padding: 60px 0;
  background-color: #0f172a;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.content-body {
  background-color: #1e293b;
  padding: 48px;
  border-radius: 12px;
  border: 1px solid #334155;
}

.content-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 32px 0 16px 0;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

.content-body h2:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.content-body p {
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.7;
  margin-bottom: 16px;
}

.content-body ul {
  margin: 16px 0;
  padding-left: 24px;
}

.content-body li {
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.7;
  margin-bottom: 8px;
}

.content-body strong {
  color: #f8fafc;
  font-weight: 600;
}

.content-body a {
  color: #8b5cf6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.content-body a:hover {
  color: #06b6d4;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}

/* Container utility */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .content-body {
    padding: 32px 24px;
  }
  
  .content-body h2 {
    font-size: 1.25rem;
  }
}
</style>
