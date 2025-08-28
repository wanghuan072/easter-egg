/**
 * 日期格式化工具函数
 */

/**
 * 格式化相对时间（如：1 day ago, 2 weeks ago）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的相对时间字符串
 */
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '1 day ago'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffDays < 365) {
    const months = Math.ceil(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.ceil(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

/**
 * 格式化日期为简短格式（如：Dec 15, 2023）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * 格式化日期为长格式（如：December 15, 2023）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatLongDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * 格式化日期为ISO格式（如：2023-12-15）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的ISO日期字符串
 */
export const formatISODate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

/**
 * 格式化时间（如：14:30）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
}

/**
 * 格式化日期时间（如：Dec 15, 2023 at 14:30）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const dateStr = formatShortDate(date)
  const timeStr = formatTime(date)
  return `${dateStr} at ${timeStr}`
}

/**
 * 检查日期是否为今天
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {boolean} 是否为今天
 */
export const isToday = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * 检查日期是否为昨天
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {boolean} 是否为昨天
 */
export const isYesterday = (dateString) => {
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

/**
 * 获取日期的年龄（年数）
 * @param {string|Date} dateString - 日期字符串或Date对象
 * @returns {number} 年龄
 */
export const getAge = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--
  }
  
  return age
}

/**
 * 默认导出 - 兼容旧版本
 */
export default {
  formatRelativeTime,
  formatShortDate,
  formatLongDate,
  formatISODate,
  formatTime,
  formatDateTime,
  isToday,
  isYesterday,
  getAge
}
