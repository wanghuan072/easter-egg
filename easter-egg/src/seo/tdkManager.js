/**
 * TDK管理系统 - 管理页面的Title, Description, Keywords
 */

// 默认TDK设置
const DEFAULT_TDK = {
  title: 'EasterEggVault - Discover Hidden Secrets in Games, Movies & TV Shows',
  description: 'The ultimate guide to easter eggs, hidden details, and secrets in video games, movies, and TV shows. Discover comprehensive guides and latest findings.',
  keywords: 'easter eggs, hidden secrets, video games, movies, tv shows, game guides, secrets, hidden details'
}

// 默认社交媒体设置
const DEFAULT_SOCIAL = {
  siteName: 'EasterEggVault',
  type: 'website',
  image: '/images/og-image.jpg',
  imageAlt: 'EasterEggVault - Hidden Secrets Discovery',
  twitterCard: 'summary_large_image',
  twitterSite: '@eastereggvault',
  twitterCreator: '@eastereggvault'
}

/**
 * 设置页面TDK和社交媒体标签
 * @param {Object} seo - SEO对象，包含title, description, keywords
 * @param {string} canonicalUrl - 规范URL（可选）
 * @param {boolean} useDefaults - 是否使用默认值填充缺失字段，默认为true
 */
export function setPageTDK(seo = {}, canonicalUrl = null, useDefaults = true) {
  const { title, description, keywords } = useDefaults ? { ...DEFAULT_TDK, ...seo } : seo
  
  // 设置页面标题
  document.title = title
  
  // 设置meta description
  setMetaTag('description', description)
  
  // 设置meta keywords
  setMetaTag('keywords', keywords)
  
  // 设置canonical URL
  if (canonicalUrl) {
    setCanonicalUrl(canonicalUrl)
  }
  
  // 统一设置社交媒体标签
  setSocialTags(title, description, seo.imageUrl)
}

/**
 * 设置社交媒体标签
 * @param {string} title - 页面标题
 * @param {string} description - 页面描述
 * @param {string} image - 页面图片（可选）
 * @param {string} type - 内容类型，默认为website
 */
export function setSocialTags(title, description, image = null, type = 'website') {
  // Open Graph标签
  setMetaTag('og:title', title)
  setMetaTag('og:description', description)
  setMetaTag('og:type', type)
  setMetaTag('og:url', window.location.href)
  setMetaTag('og:image', image || DEFAULT_SOCIAL.image)
  setMetaTag('og:image:alt', DEFAULT_SOCIAL.imageAlt)
  setMetaTag('og:site_name', DEFAULT_SOCIAL.siteName)
  setMetaTag('og:locale', 'en_US')
  
  // Twitter Card标签
  setMetaTag('twitter:card', DEFAULT_SOCIAL.twitterCard)
  setMetaTag('twitter:site', DEFAULT_SOCIAL.twitterSite)
  setMetaTag('twitter:creator', DEFAULT_SOCIAL.twitterCreator)
  setMetaTag('twitter:title', title)
  setMetaTag('twitter:description', description)
  setMetaTag('twitter:image', image || DEFAULT_SOCIAL.image)
  setMetaTag('twitter:image:alt', DEFAULT_SOCIAL.imageAlt)
}

/**
 * 设置meta标签
 * @param {string} name - meta标签的name或property属性
 * @param {string} content - meta标签的content属性
 */
function setMetaTag(name, content) {
  // 先查找已存在的标签
  let metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
  
  if (!metaTag) {
    // 如果不存在，创建新标签
    metaTag = document.createElement('meta')
    // 判断是property还是name属性
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      metaTag.setAttribute('property', name)
    } else {
      metaTag.setAttribute('name', name)
    }
    document.head.appendChild(metaTag)
  }
  
  // 更新content属性
  metaTag.setAttribute('content', content)
}

/**
 * 设置canonical URL
 * @param {string} url - 规范URL
 */
export function setCanonicalUrl(url) {
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  
  if (!canonicalLink) {
    // 如果不存在，创建新标签
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  
  // 更新href属性
  canonicalLink.setAttribute('href', url)
}

/**
 * 重置为默认TDK设置
 */
export function resetPageTDK() {
  setPageTDK(DEFAULT_TDK)
}

/**
 * 设置结构化数据(JSON-LD)
 * @param {Object} data - 结构化数据对象
 */
export function setStructuredData(data) {
  if (!data) return
  
  // 移除已存在的结构化数据
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())
  
  // 创建新的结构化数据脚本
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// 兼容性函数，保持向后兼容
export const setCustomTDK = setPageTDK
