<template>
  <div class="terms-of-use-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Terms of Use</h1>
          <p class="hero-description">
            Last updated: September 1, 2025
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-body">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using EasterEggVault, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on EasterEggVault for personal, non-commercial transitory viewing only.</p>

            <h2>3. Disclaimer</h2>
            <p>The materials on EasterEggVault are provided on an 'as is' basis. EasterEggVault makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2>4. Limitations</h2>
            <p>In no event shall EasterEggVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EasterEggVault.</p>

            <h2>5. Accuracy of Materials</h2>
            <p>The materials appearing on EasterEggVault could include technical, typographical, or photographic errors. EasterEggVault does not warrant that any of the materials on its website are accurate, complete or current.</p>

            <h2>6. Links</h2>
            <p>EasterEggVault has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EasterEggVault of the site.</p>

            <h2>7. Modifications</h2>
            <p>EasterEggVault may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.</p>

            <h2>8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

            <h2>9. Contact Information</h2>
            <p>If you have any questions about these Terms of Use, please contact us at: <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>
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
.terms-of-use-view {
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
