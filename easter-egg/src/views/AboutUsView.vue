<template>
  <div class="about-us-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('AboutUsPage.title') }} {{ $t('AboutUsPage.titleGradient') }}</h1>
          <p class="hero-description">
            {{ $t('AboutUsPage.desc') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-body">
            <h2>{{ $t('AboutUsPage.h1') }}</h2>
            <p>{{ $t('AboutUsPage.p1') }}</p>

            <h2>{{ $t('AboutUsPage.h2') }}</h2>
            <p>{{ $t('AboutUsPage.p2') }}</p>

            <h2>{{ $t('AboutUsPage.h3') }}</h2>
            <p>{{ $t('AboutUsPage.p3') }}</p>

            <h2>{{ $t('AboutUsPage.h4') }}</h2>
            <p>{{ $t('AboutUsPage.p4') }}</p>
            <ul>
              <li><strong>{{ $t('AboutUsPage.cat1') }}</strong> {{ $t('AboutUsPage.cat1Desc') }}</li>
              <li><strong>{{ $t('AboutUsPage.cat2') }}</strong> {{ $t('AboutUsPage.cat2Desc') }}</li>
              <li><strong>{{ $t('AboutUsPage.cat3') }}</strong> {{ $t('AboutUsPage.cat3Desc') }}</li>
              <li><strong>{{ $t('AboutUsPage.cat4') }}</strong> {{ $t('AboutUsPage.cat4Desc') }}</li>
            </ul>

            <h2>{{ $t('AboutUsPage.h5') }}</h2>
            <p>{{ $t('AboutUsPage.p5') }}</p>
            <ul>
              <li>{{ $t('AboutUsPage.val1') }}</li>
              <li>{{ $t('AboutUsPage.val2') }}</li>
              <li>{{ $t('AboutUsPage.val3') }}</li>
              <li>{{ $t('AboutUsPage.val4') }}</li>
            </ul>

            <h2>{{ $t('AboutUsPage.h6') }}</h2>
            <p>{{ $t('AboutUsPage.p6') }}</p>
            <p>{{ $t('AboutUsPage.email') }} <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>

            <h2>{{ $t('AboutUsPage.h7') }}</h2>
            <p>{{ $t('AboutUsPage.date') }}</p>
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
