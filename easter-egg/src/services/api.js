import { buildApiUrl, apiRequest } from '../config/api.js';

// 游戏相关API
export const gamesApi = {
  // 获取所有游戏
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/games${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取首页游戏
  getHome: async () => {
    const url = buildApiUrl('/games/home');
    return await apiRequest(url);
  },

  // 获取最新游戏
  getLatest: async (limit = 8) => {
    const url = buildApiUrl(`/games/latest?limit=${limit}`);
    return await apiRequest(url);
  },

  // 根据地址栏获取游戏详情
  getByAddressBar: async (addressBar) => {
    const url = buildApiUrl(`/games/${addressBar}`);
    return await apiRequest(url);
  },

  // 获取游戏分类
  getClassifications: async () => {
    const url = buildApiUrl('/categories/games');
    return await apiRequest(url);
  }
};

// 电影相关API
export const moviesApi = {
  // 获取所有电影
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/movies${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取首页电影
  getHome: async () => {
    const url = buildApiUrl('/movies/home');
    return await apiRequest(url);
  },

  // 获取最新电影
  getLatest: async (limit = 8) => {
    const url = buildApiUrl(`/movies/latest?limit=${limit}`);
    return await apiRequest(url);
  },

  // 根据地址栏获取电影详情
  getByAddressBar: async (addressBar) => {
    const url = buildApiUrl(`/movies/${addressBar}`);
    return await apiRequest(url);
  },

  // 获取电影分类
  getClassifications: async () => {
    const url = buildApiUrl('/categories/movies');
    return await apiRequest(url);
  }
};

// 电视相关API
export const tvApi = {
  // 获取所有电视节目
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/tv${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取首页电视节目
  getHome: async () => {
    const url = buildApiUrl('/tv/home');
    return await apiRequest(url);
  },

  // 获取最新电视节目
  getLatest: async (limit = 8) => {
    const url = buildApiUrl(`/tv/latest?limit=${limit}`);
    return await apiRequest(url);
  },

  // 根据地址栏获取电视节目详情
  getByAddressBar: async (addressBar) => {
    const url = buildApiUrl(`/tv/${addressBar}`);
    return await apiRequest(url);
  },

  // 获取电视节目分类
  getClassifications: async () => {
    const url = buildApiUrl('/categories/tv');
    return await apiRequest(url);
  }
};

// 分类相关API
export const categoriesApi = {
  // 获取所有分类
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/categories${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取特定媒体类型的分类
  getByMediaType: async (mediaType) => {
    const url = buildApiUrl(`/categories/${mediaType}`);
    return await apiRequest(url);
  },

  // 创建分类
  create: async (categoryData) => {
    const url = buildApiUrl('/categories');
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
  },

  // 更新分类
  update: async (id, categoryData) => {
    const url = buildApiUrl(`/categories/${id}`);
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
  },

  // 删除分类
  delete: async (id) => {
    const url = buildApiUrl(`/categories/${id}`);
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // 批量更新排序
  updateSort: async (categories) => {
    const url = buildApiUrl('/categories/sort/batch');
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ categories })
    });
  }
};

// 新闻相关API
export const newsApi = {
  // 获取所有新闻
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/news${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取首页新闻
  getHome: async () => {
    const url = buildApiUrl('/news/home');
    return await apiRequest(url);
  },

  // 获取最新新闻
  getLatest: async (limit = 8) => {
    const url = buildApiUrl(`/news/latest?limit=${limit}`);
    return await apiRequest(url);
  },

  // 根据地址栏获取新闻详情
  getByAddressBar: async (addressBar) => {
    const url = buildApiUrl(`/news/${addressBar}`);
    return await apiRequest(url);
  },

  // 获取新闻分类
  getClassifications: async () => {
    const url = buildApiUrl('/categories/news');
    return await apiRequest(url);
  }
};

// 搜索相关API
export const searchApi = {
  // 全局搜索
  search: async (query, params = {}) => {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    const url = buildApiUrl(`/search?${queryString}`);
    return await apiRequest(url);
  },

  // 获取搜索建议
  getSuggestions: async (query, limit = 5) => {
    const url = buildApiUrl(`/search/suggestions?q=${query}&limit=${limit}`);
    return await apiRequest(url);
  },

  // 获取搜索统计
  getStats: async () => {
    const url = buildApiUrl('/search/stats');
    return await apiRequest(url);
  }
};

// 健康检查API
export const healthApi = {
  check: async () => {
    const url = buildApiUrl('/health').replace('/api', '');
    return await apiRequest(url);
  }
};

// 导出所有API
export default {
  games: gamesApi,
  movies: moviesApi,
  tv: tvApi,
  news: newsApi,
  categories: categoriesApi,
  search: searchApi,
  health: healthApi
};