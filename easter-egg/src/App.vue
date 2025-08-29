<template>
  <div id="app">
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'

const store = useEasterEggsStore()

onMounted(async () => {
  try {
    // 检查认证状态
    store.checkAuth()
    
    // 预加载数据以提高性能
    console.log('开始预加载数据...')
    await store.preloadData()
  } catch (error) {
    console.error('预加载数据失败，但应用将继续运行:', error)
    // 即使预加载失败，也不阻止应用继续运行
    // 用户可以在需要时手动触发数据加载
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container{
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
