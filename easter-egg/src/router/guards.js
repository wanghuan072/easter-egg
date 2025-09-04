// 路由守卫配置
import { nextTick } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import { setPageTDK, resetPageTDK, setCanonicalUrl } from '@/seo/tdkManager.js'

// 需要登录才能访问的路由
const protectedRoutes = ['/admin/dashboard']

// 全局前置守卫
export const globalBeforeEach = (to, from, next) => {
  // 统一设置canonical URL（参考Fish-Games的实现）
  const canonicalUrl = `https://eastereggvault.com${to.path}`
  setCanonicalUrl(canonicalUrl)

  // 设置SEO信息
  if (to.meta.dynamic) {
    // 动态页面：TDK将通过API数据在组件中设置
    resetPageTDK()
  } else if (to.meta.title) {
    // 静态页面：从路由meta中获取TDK
    setPageTDK({
      title: to.meta.title,
      description: to.meta.description,
      keywords: to.meta.keywords
    })
  } else {
    // 默认页面：重置为默认TDK
    resetPageTDK()
  }

  // 检查是否需要登录
  const easterEggsStore = useEasterEggsStore()
  const isAuthenticated = easterEggsStore.isAuthenticated

  if (protectedRoutes.includes(to.path) && !isAuthenticated) {
    // 如果需要登录但未登录，重定向到登录页
    next('/admin/login')
  } else {
    // 继续导航
    next()
  }
}

// 全局后置守卫 - 处理页面滚动
export const globalAfterEach = (to, from) => {
  // 页面跳转后滚动到顶部
  if (to.path !== from.path) {
    // 使用 nextTick 确保DOM更新完成后再滚动
    nextTick(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // 平滑滚动效果
      })
    })
  }
}
