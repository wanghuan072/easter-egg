import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gamesApi, moviesApi, tvApi, newsApi, searchApi } from '@/services/api.js'
import { getApiUrl } from '@/config/env.js'

export const useEasterEggsStore = defineStore('easterEggs', () => {
  // 状态
  const games = ref([])
  const movies = ref([])
  const tvShows = ref([])
  const news = ref([])
  const searchResults = ref([])
  const latestDiscoveries = ref([])
  
  // 加载状态
  const isLoading = ref({
    games: false,
    movies: false,
    tv: false,
    news: false,
    search: false,
    home: false
  })
  
  // 全局页面加载状态
  const isPageLoading = ref(false)
  
  // 错误状态
  const errors = ref({
    games: '',
    movies: '',
    tv: '',
    news: '',
    search: '',
    home: ''
  })
  
  // 分页信息
  const pagination = ref({
    games: { page: 1, pages: 1, total: 0 },
    movies: { page: 1, pages: 1, total: 0 },
    tv: { page: 1, pages: 1, total: 0 },
    news: { page: 1, pages: 1, total: 0 },
    search: { page: 1, pages: 1, total: 0 }
  })
  
  // 搜索相关状态
  const searchState = ref({
    query: '',
    filters: {},
    results: []
  })
  
  // 分类数据
  const classifications = ref({
    games: [],
    movies: [],
    tv: [],
    news: []
  })

  // 认证状态
  const auth = ref({
    isAuthenticated: false,
    user: null,
    token: null
  })

  // 数据加载状态
  const dataLoaded = ref({
    games: false,
    movies: false,
    tv: false,
    news: false,
    categories: false,
    latestDiscoveries: false
  })

  // 计算属性 - 过滤后的数据
  const filteredGames = computed(() => games.value)
  const filteredMovies = computed(() => movies.value)
  const filteredTVShows = computed(() => tvShows.value)
  const filteredNews = computed(() => news.value)
  
  // 认证状态计算属性
  const isAuthenticated = computed(() => auth.value.isAuthenticated)
  
  // 获取分类列表
  const getClassifications = (type) => {
    return classifications.value[type] || []
  }

  // 检查数据是否已加载
  const isDataLoaded = (type) => {
    const loaded = dataLoaded.value[type]
    return loaded
  }

  // 检查多个数据类型是否都已加载
  const areDataTypesLoaded = (types) => {
    return types.every(type => dataLoaded.value[type])
  }

  // 通用数据获取函数
  const fetchData = async (type, apiMethod, params = {}) => {
    isLoading.value[type] = true
    errors.value[type] = ''
    
    try {
      const response = await apiMethod(params)
      
      // 统一处理响应格式
      let data = []
      if (Array.isArray(response)) {
        data = response
      } else if (response && response.data) {
        data = response.data
        // 处理分页信息
        if (response.pagination) {
          pagination.value[type] = response.pagination
        }
      } else {
        data = []
      }
      
      // 根据类型设置数据
      switch (type) {
        case 'games':
          games.value = data
          break
        case 'movies':
          movies.value = data
          break
        case 'tv':
          tvShows.value = data
          break
        case 'news':
          news.value = data
          break
      }

      // 标记数据已加载
      dataLoaded.value[type] = true
      
      return data
    } catch (error) {
      const errorMessage = error.message || `Failed to fetch ${type}`
      errors.value[type] = errorMessage
      console.error(`Error fetching ${type}:`, error)
      return []
    } finally {
      isLoading.value[type] = false
    }
  }

  // 获取游戏数据
  const fetchGames = async (params = {}) => {
    return await fetchData('games', gamesApi.getAll, params)
  }
  
  // 获取电影数据
  const fetchMovies = async (params = {}) => {
    return await fetchData('movies', moviesApi.getAll, params)
  }
  
  // 获取电视数据
  const fetchTV = async (params = {}) => {
    return await fetchData('tv', tvApi.getAll, params)
  }
  
  // 获取新闻数据
  const fetchNews = async (params = {}) => {
    return await fetchData('news', newsApi.getAll, params)
  }
  
  // 获取首页数据
  const fetchHomeData = async () => {
    isLoading.value.home = true
    errors.value.home = ''
    
    try {
      const [gamesRes, moviesRes, tvRes] = await Promise.all([
        gamesApi.getHome(),
        moviesApi.getHome(),
        tvApi.getHome()
      ])
      
      // 统一处理响应
      games.value = Array.isArray(gamesRes) ? gamesRes : (gamesRes.data || [])
      movies.value = Array.isArray(moviesRes) ? moviesRes : (moviesRes.data || [])
      tvShows.value = Array.isArray(tvRes) ? tvRes : (tvRes.data || [])
      
      // 标记数据已加载
      dataLoaded.value.games = true
      dataLoaded.value.movies = true
      dataLoaded.value.tv = true
      
      return { games: games.value, movies: movies.value, tv: tvShows.value }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch home data'
      errors.value.home = errorMessage
      console.error('Error fetching home data:', error)
      return { games: [], movies: [], tv: [] }
    } finally {
      isLoading.value.home = false
    }
  }
  
  // 预加载数据以提高性能
  const preloadData = async () => {
    isPageLoading.value = true
    
    try {
      // 一次性加载所有数据，提高性能
      const [gamesData, moviesData, tvData, newsData, gamesCat, moviesCat, tvCat, newsCat] = await Promise.all([
        fetchData('games', gamesApi.getHome),  // 使用getHome而不是getAll
        fetchData('movies', moviesApi.getHome), // 使用getHome而不是getAll
        fetchData('tv', tvApi.getHome),        // 使用getHome而不是getAll
        fetchData('news', newsApi.getAll),     // 新闻没有getHome，继续使用getAll
        gamesApi.getClassifications(),
        moviesApi.getClassifications(),
        tvApi.getClassifications(),
        newsApi.getClassifications()
      ])
      
      // 存储分类数据
      classifications.value.games = Array.isArray(gamesCat) ? gamesCat : (gamesCat?.data || [])
      classifications.value.movies = Array.isArray(moviesCat) ? moviesCat : (moviesCat?.data || [])
      classifications.value.tv = Array.isArray(tvCat) ? tvCat : (tvCat?.data || [])
      classifications.value.news = Array.isArray(newsCat) ? newsCat : (newsCat?.data || [])
      
      // 标记分类数据已加载
      dataLoaded.value.categories = true
      
  
    } catch (error) {
      console.error('预加载数据时出错:', error)
      // 即使出错也不阻止应用继续运行
    } finally {
      isPageLoading.value = false
    }
  }
  
  // 获取最新发现
  const fetchLatestDiscoveries = async (limit = 4) => {
    try {
      // 获取游戏、电影、电视中 is_latest = true 的内容
      const [gamesRes, moviesRes, tvRes] = await Promise.all([
        gamesApi.getLatest(limit),
        moviesApi.getLatest(limit),
        tvApi.getLatest(limit)
      ])
      
      // 合并所有结果
      let allLatest = []
      
      // 处理游戏数据
      if (gamesRes && gamesRes.data) {
        allLatest.push(...gamesRes.data)
      } else if (Array.isArray(gamesRes)) {
        allLatest.push(...gamesRes)
      }
      
      // 处理电影数据
      if (moviesRes && moviesRes.data) {
        allLatest.push(...moviesRes.data)
      } else if (Array.isArray(moviesRes)) {
        allLatest.push(...moviesRes)
      }
      
      // 处理电视数据
      if (tvRes && tvRes.data) {
        allLatest.push(...tvRes.data)
      } else if (Array.isArray(tvRes)) {
        allLatest.push(...tvRes)
      }
      
      // 按发布时间排序，取最新的 limit 条
      allLatest.sort((a, b) => new Date(b.publish_date || b.publishDate) - new Date(a.publish_date || a.publishDate))
      allLatest = allLatest.slice(0, limit)
      
      latestDiscoveries.value = allLatest
      
      // 标记数据已加载
      dataLoaded.value.latestDiscoveries = true
      
      return allLatest
    } catch (error) {
      console.error('Error fetching latest discoveries:', error)
      latestDiscoveries.value = []
      return []
    }
  }
  
  // 搜索功能
  const performSearch = async (query, params = {}) => {
    isLoading.value.search = true
    errors.value.search = ''
    
    try {
      const response = await searchApi.search(query, params)
      
      let data = []
      if (Array.isArray(response)) {
        data = response
      } else if (response && response.data) {
        data = response.data
        if (response.pagination) {
          pagination.value.search = response.pagination
        }
      }
      
      searchResults.value = data
      searchState.value.query = query
      searchState.value.filters = params
      searchState.value.results = data
      
      return data
    } catch (error) {
      const errorMessage = error.message || 'Search failed'
      errors.value.search = errorMessage
      console.error('Search error:', error)
      return []
    } finally {
      isLoading.value.search = false
    }
  }
  
  // 获取分类数据
  const fetchClassifications = async (type) => {
    try {
      let response
      switch (type) {
        case 'games':
          response = await gamesApi.getClassifications()
          break
        case 'movies':
          response = await moviesApi.getClassifications()
          break
        case 'tv':
          response = await tvApi.getClassifications()
          break
        case 'news':
          response = await newsApi.getClassifications()
          break
        default:
          return []
      }
      
      const data = Array.isArray(response) ? response : (response.data || [])
      classifications.value[type] = data
      return data
    } catch (error) {
      console.error(`Error fetching ${type} classifications:`, error)
      return []
    }
  }
  
  // 清除错误
  const clearError = (type) => {
    if (errors.value[type]) {
      errors.value[type] = ''
    }
  }
  
  // 重置状态
  const reset = () => {
    games.value = []
    movies.value = []
    tvShows.value = []
    news.value = []
    searchResults.value = []
    latestDiscoveries.value = []
    searchState.value = { query: '', filters: {}, results: [] }
    isPageLoading.value = false
    
    Object.keys(isLoading.value).forEach(key => {
      isLoading.value[key] = false
    })
    
    Object.keys(errors.value).forEach(key => {
      errors.value[key] = ''
    })
    
    Object.keys(pagination.value).forEach(key => {
      pagination.value[key] = { page: 1, pages: 1, total: 0 }
    })
  }

  // 认证相关方法
  const login = async (username, password) => {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        auth.value.isAuthenticated = true
        auth.value.user = data.data.user
        auth.value.token = data.data.token
        
        // 存储到localStorage
        localStorage.setItem('admin_token', data.data.token)
        localStorage.setItem('admin_user', data.data.user.username)
        
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }

  const logout = () => {
    auth.value.isAuthenticated = false
    auth.value.user = null
    auth.value.token = null
    
    // 清除localStorage
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    const user = localStorage.getItem('admin_user')
    
    if (token && user && isTokenValid(token)) {
      auth.value.isAuthenticated = true
      auth.value.user = { username: user }
      auth.value.token = token
      return true
    } else {
      // token无效或过期，清除认证状态
      logout()
      return false
    }
  }

  // 检查token是否有效
  const isTokenValid = (token) => {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now() / 1000
      return tokenData.exp > now
    } catch (error) {
      return false
    }
  }

  return {
    // 状态
    games,
    movies,
    tvShows,
    news,
    searchResults,
    latestDiscoveries,
    isLoading,
    isPageLoading,
    errors,
    pagination,
    searchState,
    classifications,
    dataLoaded,
    
    // 计算属性
    filteredGames,
    filteredMovies,
    filteredTVShows,
    filteredNews,
    isAuthenticated,
    getClassifications,
    isDataLoaded,
    areDataTypesLoaded,
    
    // 方法
    fetchGames,
    fetchMovies,
    fetchTV,
    fetchNews,
    fetchHomeData,
    fetchLatestDiscoveries,
    performSearch,
    fetchClassifications,
    preloadData,
    clearError,
    reset,
    
    // 认证相关
    auth,
    login,
    logout,
    checkAuth
  }
})
