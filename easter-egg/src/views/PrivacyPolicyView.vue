<template>
  <div class="privacy-policy-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('PrivacyPolicyPage.title') }} {{ $t('PrivacyPolicyPage.titleGradient') }}</h1>
          <p class="hero-description">
            {{ $t('PrivacyPolicyPage.lastUpdated') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-body">
            <h2>{{ $t('PrivacyPolicyPage.h1') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p1') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h2') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p2') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h3') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p3') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h4') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p4') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h5') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p5') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h6') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p6') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h7') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p7') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h8') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p8') }}</p>

            <h2>{{ $t('PrivacyPolicyPage.h9') }}</h2>
            <p>{{ $t('PrivacyPolicyPage.p9') }} <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>
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
.privacy-policy-view {
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
