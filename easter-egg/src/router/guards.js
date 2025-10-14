// 路由守卫配置
import { nextTick } from 'vue'
import { useEasterEggsStore } from '@/stores/easterEggs.js'
import { setPageTDK, resetPageTDK, setCanonicalUrl } from '@/seo/tdkManager.js'
import i18n from '@/i18n'
import { seoTranslations } from '@/i18n/seo.js'
import { detectLanguageFromPath } from './index.js'

// 需要登录才能访问的路由
const protectedRoutes = ['/admin/dashboard']

// 全局前置守卫
export const globalBeforeEach = (to, from, next) => {
  // 从URL路径中检测语言
  const detectedLanguage = detectLanguageFromPath(to.path)
  
  // 自动设置语言
  i18n.global.locale.value = detectedLanguage
  localStorage.setItem('locale', detectedLanguage)
  
  // 设置HTML的lang属性
  if (typeof document !== 'undefined') {
    document.documentElement.lang = detectedLanguage
  }
  
  // 统一设置canonical URL（参考Fish-Games的实现）
  const canonicalUrl = `https://eastereggvault.com${to.path}`
  setCanonicalUrl(canonicalUrl)

  // 获取当前语言
  const currentLocale = detectedLanguage
  const seoData = seoTranslations[currentLocale]

  // 设置SEO信息
  if (to.meta.dynamic) {
    // 动态页面：TDK将通过API数据在组件中设置
    resetPageTDK()
  } else if (to.meta.title) {
    // 静态页面：使用多语言 SEO 数据
    let pageSeo = null
    
    // 提取基础路由名称（移除语言后缀，如 HomeRu -> Home）
    const routeName = to.name || ''
    const baseRouteName = routeName.replace(/(Ru|Es|Fr|De|Ja|Ko)$/, '').toLowerCase()
    
    // 根据路由名称获取对应的 SEO 数据
    const seoKeyMap = {
      'home': seoData.home,
      'games': seoData.games,
      'movies': seoData.movies,
      'tv': seoData.tv,
      'news': seoData.news,
      'search': seoData.search,
      'popular': seoData.popular,
      'privacy': seoData.privacy,
      'terms': seoData.terms,
      'copyright': seoData.copyright,
      'about': seoData.about,
      'contact': seoData.contact,
      'admin-login': seoData.adminLogin,
      'admin-dashboard': seoData.adminDashboard
    }
    
    pageSeo = seoKeyMap[baseRouteName] || {
      title: to.meta.title,
      description: to.meta.description,
      keywords: to.meta.keywords
    }
    
    if (pageSeo && pageSeo.title) {
      setPageTDK({
        title: pageSeo.title,
        description: pageSeo.description,
        keywords: pageSeo.keywords
      })
    } else {
      // 使用路由 meta 中的默认英文 TDK
      setPageTDK({
        title: to.meta.title,
        description: to.meta.description,
        keywords: to.meta.keywords
      })
    }
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
