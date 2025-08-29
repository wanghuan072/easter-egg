<template>
  <div class="dashboard-view">
    <!-- 使用AdminLayout组件 -->
    <AdminLayout />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const router = useRouter()
const store = useEasterEggsStore()

onMounted(() => {
  // 检查认证状态
  store.checkAuth()
  
  // 如果没有认证，跳转到登录页
  if (!store.auth.isAuthenticated) {
    router.push('/admin/login')
  }
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
}
</style>
