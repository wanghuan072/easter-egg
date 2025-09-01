<template>
  <div class="copyright-view">
    <Header />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Copyright</h1>
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
            <h2>Copyright Notice</h2>
            <p>© 2025 EasterEggVault. All rights reserved.</p>

            <h2>1. Copyright Protection</h2>
            <p>All content on EasterEggVault, including but not limited to text, graphics, images, logos, and software, is the property of EasterEggVault or its content suppliers and is protected by international copyright laws.</p>

            <h2>2. Fair Use</h2>
            <p>This website may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We are making such material available in our efforts to advance understanding of easter eggs and hidden secrets in entertainment media.</p>

            <h2>3. Third-Party Content</h2>
            <p>Some content on this website may be sourced from third parties. We respect the intellectual property rights of others and expect our users to do the same. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us.</p>

            <h2>4. User-Generated Content</h2>
            <p>Users may submit content to our platform. By submitting content, users grant EasterEggVault a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content.</p>

            <h2>5. Trademarks</h2>
            <p>All trademarks, service marks, and trade names used on this website are the property of their respective owners. EasterEggVault does not claim ownership of any third-party trademarks.</p>

            <h2>6. DMCA Compliance</h2>
            <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide us with the following information:</p>
            <ul>
              <li>A description of the copyrighted work that you claim has been infringed</li>
              <li>A description of where the material is located on our website</li>
              <li>Your contact information</li>
              <li>A statement that you have a good faith belief that the use is not authorized</li>
              <li>A statement that the information is accurate and that you are authorized to act on behalf of the copyright owner</li>
            </ul>

            <h2>7. Contact Information</h2>
            <p>For copyright-related inquiries, please contact us at: <a href="mailto:kadiyamobi89@gmail.com">kadiyamobi89@gmail.com</a></p>
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
.copyright-view {
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
