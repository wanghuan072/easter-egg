import { buildApiUrl, apiRequest } from '../config/api.js';

// 注意：内容数据(games/movies/tv/news)已迁移至本地数据文件
// 前端页面直接从 src/data/*.js 读取数据，不再使用这些API

// 评论相关API
export const commentsApi = {
  // 获取评论列表
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/comments${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取特定内容的评论
  getByContent: async (contentId, contentType) => {
    const url = buildApiUrl(`/comments?contentId=${contentId}&contentType=${contentType}`);
    return await apiRequest(url);
  },

  // 创建评论
  create: async (commentData) => {
    const url = buildApiUrl('/comments');
    return await apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });
  },

  // 更新评论
  update: async (id, commentData) => {
    const url = buildApiUrl(`/comments/${id}`);
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });
  },

  // 删除评论
  delete: async (id) => {
    const url = buildApiUrl(`/comments/${id}`);
    const token = localStorage.getItem('admin_token');
    return await apiRequest(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// 评分相关API
export const ratingsApi = {
  // 获取评分列表
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = buildApiUrl(`/ratings${queryString ? `?${queryString}` : ''}`);
    return await apiRequest(url);
  },

  // 获取特定内容的评分
  getByContent: async (contentId, contentType) => {
    const url = buildApiUrl(`/ratings?contentId=${contentId}&contentType=${contentType}`);
    return await apiRequest(url);
  },

  // 提交评分
  submit: async (ratingData) => {
    const url = buildApiUrl('/ratings');
    return await apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ratingData)
    });
  },

  // 更新评分
  update: async (id, ratingData) => {
    const url = buildApiUrl(`/ratings/${id}`);
    return await apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ratingData)
    });
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
  comments: commentsApi,
  ratings: ratingsApi,
  health: healthApi
};