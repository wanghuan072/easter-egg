// 多语言路由辅助函数

import i18n from '@/i18n'
import { supportedLanguages } from '@/router/index.js'

/**
 * 获取本地化路径
 * @param {string} path - 基础路径
 * @param {string} lang - 语言代码（可选，默认使用当前语言）
 * @returns {string} - 本地化后的路径
 */
export function getLocalizedPath(path, lang = null) {
  const currentLang = lang || i18n.global.locale.value
  return currentLang === 'en' ? path : `/${currentLang}${path}`
}

/**
 * 从路径中提取基础路径（移除语言前缀）
 * @param {string} path - 完整路径
 * @returns {string} - 基础路径
 */
export function getBasePath(path) {
  let basePath = path
  
  // 移除所有支持的语言前缀
  supportedLanguages.forEach(lang => {
    if (lang !== 'en') {
      basePath = basePath.replace(new RegExp(`^/${lang}`), '')
    }
  })
  
  return basePath || '/'
}

/**
 * 切换路径语言
 * @param {string} currentPath - 当前路径
 * @param {string} targetLang - 目标语言
 * @returns {string} - 新语言的路径
 */
export function switchPathLanguage(currentPath, targetLang) {
  const basePath = getBasePath(currentPath)
  
  if (targetLang === 'en') {
    return basePath
  } else {
    return basePath === '/' ? `/${targetLang}` : `/${targetLang}${basePath}`
  }
}

/**
 * 自动本地化页面上的所有内部链接
 * （可选功能，用于非 Vue 路由的情况）
 */
export function localizeAllLinks() {
  const currentLang = i18n.global.locale.value || 'en'
  
  // 查找所有内部链接
  const links = document.querySelectorAll('a[href^="/"]')
  
  links.forEach(link => {
    const href = link.getAttribute('href')
    
    // 跳过已经有语言前缀的链接
    if (currentLang !== 'en' && href.startsWith(`/${currentLang}`)) {
      return
    }
    
    // 跳过外部链接、锚点链接等
    if (href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.startsWith('javascript:')) {
      return
    }
    
    // 为链接添加语言前缀
    if (currentLang !== 'en') {
      const localizedHref = `/${currentLang}${href}`
      link.setAttribute('href', localizedHref)
    }
  })
}

/**
 * 监听语言变化，重新处理链接
 * （可选功能）
 */
export function watchLanguageChange() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        // 当DOM发生变化时，重新处理链接
        setTimeout(localizeAllLinks, 100)
      }
    })
  })
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  return observer
}

