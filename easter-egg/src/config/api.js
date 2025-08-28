// API配置文件
const API_CONFIG = {
  // 从环境变量获取API配置
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // API版本
  API_VERSION: 'api',
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// 构建完整的API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
};

// 通用请求方法
export const apiRequest = async (url, options = {}) => {
  const config = {
    method: 'GET',
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_CONFIG;
