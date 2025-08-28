// API配置文件
const API_CONFIG = {
  // 从环境变量获取API配置
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  // API版本（可选）
  API_VERSION: import.meta.env.VITE_API_VERSION || '',
  // 请求超时时间
  TIMEOUT: 10000,
  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// 构建完整的API URL，自动适配 API_VERSION
export const buildApiUrl = (endpoint) => {
  const version = API_CONFIG.API_VERSION ? `/${API_CONFIG.API_VERSION}` : '';
  return `${API_CONFIG.BASE_URL}${version}${endpoint}`;
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
