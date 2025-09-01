<template>
  <div class="contact-us-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Contact Us</h1>
          <p class="hero-description">
            Get in touch with the EasterEggVault team
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-body">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Whether you have questions, suggestions, want to report an issue, or just want to say hello, feel free to reach out to us.</p>

            <h2>Email Contact</h2>
            <p>For general inquiries, content suggestions, or technical support:</p>
            <p><strong>Email:</strong> <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>

            <h2>What We Can Help With</h2>
            <ul>
              <li><strong>Content Submissions:</strong> Found a new easter egg? Let us know!</li>
              <li><strong>Bug Reports:</strong> Experiencing issues with our website?</li>
              <li><strong>Feature Requests:</strong> Have ideas for improving EasterEggVault?</li>
              <li><strong>Partnership Inquiries:</strong> Interested in collaborating?</li>
              <li><strong>General Questions:</strong> Anything else on your mind?</li>
            </ul>

            <h2>Response Time</h2>
            <p>We typically respond to emails within 24-48 hours during business days. For urgent matters, please include "URGENT" in your subject line.</p>

            <h2>Before You Contact Us</h2>
            <p>To help us provide the best possible assistance, please consider including:</p>
            <ul>
              <li>Your name (optional but appreciated)</li>
              <li>A clear description of your inquiry or issue</li>
              <li>Relevant details about the content or problem</li>
              <li>Your browser and device information (for technical issues)</li>
            </ul>

            <h2>Community Guidelines</h2>
            <p>We maintain a respectful and inclusive community. When contacting us, please:</p>
            <ul>
              <li>Be respectful and courteous</li>
              <li>Provide constructive feedback</li>
              <li>Include relevant details</li>
              <li>Be patient with our response time</li>
            </ul>

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
.contact-us-view {
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
