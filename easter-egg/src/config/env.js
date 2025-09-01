// 环境配置
const getApiUrl = (endpoint) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${apiUrl}${endpoint}`
}

// 获取完整的API URL
const getFullApiUrl = (endpoint) => {
  return getApiUrl(endpoint)
}

// 环境变量
const config = {
  // API配置
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  
  // 应用配置
  app: {
    name: import.meta.env.VITE_APP_NAME || 'EasterEggVault',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE,
  },
  
  // 功能开关
  features: {
    debug: import.meta.env.VITE_ENABLE_DEBUG === 'true' || import.meta.env.DEV,
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && !import.meta.env.DEV,
  }
}

export { getApiUrl, getFullApiUrl, config }
