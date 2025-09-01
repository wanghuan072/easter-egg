<template>
  <div class="privacy-policy-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Privacy Policy</h1>
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
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, submit content, or contact us. This may include your name, email address, and any other information you choose to provide.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new features and services.</p>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our website and to analyze how our services are used.</p>

            <h2>6. Third-Party Services</h2>
            <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.</p>

            <h2>7. Children's Privacy</h2>
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at: <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>
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
