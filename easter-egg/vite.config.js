import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { robots } from 'vite-plugin-robots'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    robots({
      UserAgent: '*',
      Allow: '/',
      Disallow: ['/admin/', '/api/', '/_nuxt/', '/node_modules/', '/.git/', '/src/'],
      Sitemap: 'https://easter-egg-sandy.vercel.app/sitemap.xml',
      'Crawl-delay': 1,
      Host: 'https://easter-egg-sandy.vercel.app'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    minify: 'terser'
  }
})
