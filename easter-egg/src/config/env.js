// 环境配置
const getApiUrl = (endpoint) => {
  // 开发环境使用本地API
  if (import.meta.env.DEV) {
    return `http://localhost:3000${endpoint}`
  }
  
  // 生产环境使用Vercel部署的API
  // 部署后需要更新为实际的Vercel API域名
  const productionApiUrl = import.meta.env.VITE_API_URL || 'https://easter-egg-api.vercel.app'
  return `${productionApiUrl}${endpoint}`
}

// 获取完整的API URL
const getFullApiUrl = (endpoint) => {
  return getApiUrl(endpoint)
}

// 环境变量
const config = {
  // API配置
  api: {
    baseUrl: import.meta.env.DEV ? 'http://localhost:3000' : (import.meta.env.VITE_API_URL || 'https://easter-egg-api.vercel.app'),
    timeout: 10000,
  },
  
  // 应用配置
  app: {
    name: 'EasterEggVault',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  },
  
  // 功能开关
  features: {
    debug: import.meta.env.DEV,
    analytics: !import.meta.env.DEV,
  }
}

export { getApiUrl, getFullApiUrl, config }
