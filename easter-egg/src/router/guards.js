// 路由守卫配置
import { useEasterEggsStore } from '@/stores/easterEggs.js'

// 需要登录才能访问的路由
const protectedRoutes = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/settings'
]

// 检查用户是否已登录
const isAuthenticated = () => {
  const store = useEasterEggsStore()
  return store.auth.isAuthenticated
}

// 检查token是否有效
const hasValidToken = () => {
  const token = localStorage.getItem('admin_token')
  if (!token) return false
  
  // 检查token是否过期（1小时）
  const tokenData = JSON.parse(atob(token.split('.')[1]))
  const now = Date.now() / 1000
  
  return tokenData.exp > now
}

// 路由守卫函数
export const requireAuth = (to, from, next) => {
  // 检查是否是受保护的路由
  if (protectedRoutes.some(route => to.path.startsWith(route))) {
    // 检查是否已登录且token有效
    if (isAuthenticated() && hasValidToken()) {
      next() // 允许访问
    } else {
      // 未登录或token无效，跳转到登录页
      next({
        path: '/admin/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      })
    }
  } else {
    next() // 非受保护路由，直接通过
  }
}

// 已登录用户访问登录页时重定向到仪表板
export const redirectIfAuthenticated = (to, from, next) => {
  if (to.path === '/admin/login' && isAuthenticated() && hasValidToken()) {
    next('/admin/dashboard')
  } else {
    next()
  }
}

// 全局前置守卫
export const globalBeforeEach = (to, from, next) => {
  // 检查是否需要认证
  if (protectedRoutes.some(route => to.path.startsWith(route))) {
    requireAuth(to, from, next)
  } else if (to.path === '/admin/login') {
    redirectIfAuthenticated(to, from, next)
  } else {
    next()
  }
}
