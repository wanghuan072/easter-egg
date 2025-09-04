<template>
  <div id="app">
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'

const store = useEasterEggsStore()
const isInitialized = ref(false)

onMounted(async () => {
  try {
    // 检查认证状态
    store.checkAuth()

    // 预加载数据以提高性能
    await store.preloadData()

    // 标记初始化完成
    isInitialized.value = true
  } catch (error) {
    console.error('预加载数据失败，但应用将继续运行:', error)
    // 即使预加载失败，也不阻止应用继续运行
    // 用户可以在需要时手动触发数据加载
    isInitialized.value = true
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

/* 通用Loading样式 */
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 0;
}

.loading-text {
  font-size: 18px;
  color: #888;
  font-weight: 500;
}

/* 响应式设计 - 1024px 断点 */
@media (max-width: 1024px) {
  .container {
    max-width: 100%;
    padding: 0 20px;
  }

  .loading-section {
    padding: 30px 15px;
    margin: 15px 0;
  }
}

/* 响应式设计 - 768px 断点 (移动端) */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .loading-section {
    padding: 20px 10px;
    margin: 10px 0;
  }
}
</style>
