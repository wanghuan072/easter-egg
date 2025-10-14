import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getApiUrl } from '@/config/env.js'
import { loadAllData } from '@/data/index.js'
import i18n from '@/i18n'

// 存储当前加载的数据
let currentLocaleData = {
  games: [],
  movies: [],
  tv: [],
  news: [],
  classifications: {
    games: [],
    movies: [],
    tv: [],
    news: []
  }
}

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

  // 本地数据获取辅助函数
  const getLocalData = (type) => {
    switch (type) {
      case 'games':
        return currentLocaleData.games || []
      case 'movies':
        return currentLocaleData.movies || []
      case 'tv':
        return currentLocaleData.tv || []
      case 'news':
        return currentLocaleData.news || []
      default:
        return []
    }
  }

  // 通用数据获取函数（从本地读取）
  const fetchData = async (type, params = {}) => {
    isLoading.value[type] = true
    errors.value[type] = ''
    
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 100))
      
      let data = getLocalData(type)
      
      // 应用搜索过滤
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        data = data.filter(item => 
          item.title?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        )
      }
      
      // 应用分类过滤
      if (params.classify) {
        data = data.filter(item => 
          item.classify && item.classify.includes(params.classify)
        )
      }
      
      // 计算分页信息
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const total = data.length
      const pages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      
      // 分页数据
      const paginatedData = data.slice(offset, offset + limit)
      
      // 更新分页信息
      pagination.value[type] = { page, limit, total, pages }
      
      // 根据类型设置数据
      switch (type) {
        case 'games':
          games.value = paginatedData
          break
        case 'movies':
          movies.value = paginatedData
          break
        case 'tv':
          tvShows.value = paginatedData
          break
        case 'news':
          news.value = paginatedData
          break
      }

      // 标记数据已加载
      dataLoaded.value[type] = true
      
      return paginatedData
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
    return await fetchData('games', params)
  }
  
  // 获取电影数据
  const fetchMovies = async (params = {}) => {
    return await fetchData('movies', params)
  }
  
  // 获取电视数据
  const fetchTV = async (params = {}) => {
    return await fetchData('tv', params)
  }
  
  // 获取新闻数据
  const fetchNews = async (params = {}) => {
    return await fetchData('news', params)
  }
  
  // 获取首页数据（从本地读取 isHome=true 的数据）
  const fetchHomeData = async () => {
    isLoading.value.home = true
    errors.value.home = ''
    
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 过滤首页数据
      games.value = currentLocaleData.games.filter(item => item.isHome).slice(0, 6)
      movies.value = currentLocaleData.movies.filter(item => item.isHome).slice(0, 6)
      tvShows.value = currentLocaleData.tv.filter(item => item.isHome).slice(0, 6)
      
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
  
  // 预加载数据以提高性能（从本地读取）
  const preloadData = async () => {
    isPageLoading.value = true
    
    try {
      // 获取当前语言
      const currentLocale = i18n.global.locale.value || 'en'
      
      // 动态加载对应语言的数据
      const allData = await loadAllData(currentLocale)
      
      // 存储到缓存
      currentLocaleData = allData
      
      // 加载首页数据
      games.value = allData.games.filter(item => item.isHome).slice(0, 6)
      movies.value = allData.movies.filter(item => item.isHome).slice(0, 6)
      tvShows.value = allData.tv.filter(item => item.isHome).slice(0, 6)
      news.value = allData.news.slice(0, 10)
      
      // 存储分类数据
      classifications.value = allData.classifications
      
      // 标记数据已加载
      dataLoaded.value.games = true
      dataLoaded.value.movies = true
      dataLoaded.value.tv = true
      dataLoaded.value.news = true
      dataLoaded.value.categories = true
  
    } catch (error) {
      console.error('预加载数据时出错:', error)
      // 即使出错也不阻止应用继续运行
    } finally {
      isPageLoading.value = false
    }
  }
  
  // 获取最新发现（从本地读取 isLatest=true 的数据）
  const fetchLatestDiscoveries = async () => {
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 合并所有 isLatest=true 的数据
      let allLatest = []
      
      // 获取游戏、电影、电视中的最新数据，并添加 mediaType 标识
      allLatest.push(...currentLocaleData.games.filter(item => item.isLatest).map(item => ({ ...item, mediaType: 'games' })))
      allLatest.push(...currentLocaleData.movies.filter(item => item.isLatest).map(item => ({ ...item, mediaType: 'movies' })))
      allLatest.push(...currentLocaleData.tv.filter(item => item.isLatest).map(item => ({ ...item, mediaType: 'tv' })))
      
      // 按发布时间排序
      allLatest.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      
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
  
  // 本地搜索功能
  const performSearch = async (query, params = {}) => {
    isLoading.value.search = true
    errors.value.search = ''
    
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (!query || !query.trim()) {
        searchResults.value = []
        return []
      }
      
      const searchLower = query.toLowerCase()
      let allData = []
      
      // 根据媒体类型过滤，并添加 mediaType 标识
      if (!params.mediaType || params.mediaType === 'games') {
        allData.push(...currentLocaleData.games.map(item => ({ ...item, mediaType: 'games' })))
      }
      if (!params.mediaType || params.mediaType === 'movies') {
        allData.push(...currentLocaleData.movies.map(item => ({ ...item, mediaType: 'movies' })))
      }
      if (!params.mediaType || params.mediaType === 'tv') {
        allData.push(...currentLocaleData.tv.map(item => ({ ...item, mediaType: 'tv' })))
      }
      if (!params.mediaType || params.mediaType === 'news') {
        allData.push(...currentLocaleData.news.map(item => ({ ...item, mediaType: 'news' })))
      }
      
      // 搜索过滤
      let results = allData.filter(item => {
        // 检查标题和描述
        const titleMatch = item.title?.toLowerCase().includes(searchLower)
        const descMatch = item.description?.toLowerCase().includes(searchLower)
        
        // 检查标签数组（tag 是数组）
        let tagMatch = false
        if (Array.isArray(item.tag)) {
          tagMatch = item.tag.some(tag => tag?.toLowerCase().includes(searchLower))
        }
        
        return titleMatch || descMatch || tagMatch
      })
      
      // 应用分类过滤
      if (params.classify) {
        results = results.filter(item => 
          item.classify && item.classify.includes(params.classify)
        )
      }
      
      // 计算分页
      const page = parseInt(params.page) || 1
      const limit = parseInt(params.limit) || 10
      const total = results.length
      const pages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      
      const paginatedResults = results.slice(offset, offset + limit)
      
      // 更新分页信息
      pagination.value.search = { page, limit, total, pages }
      
      searchResults.value = paginatedResults
      searchState.value.query = query
      searchState.value.filters = params
      searchState.value.results = paginatedResults
      
      return paginatedResults
    } catch (error) {
      const errorMessage = error.message || 'Search failed'
      errors.value.search = errorMessage
      console.error('Search error:', error)
      return []
    } finally {
      isLoading.value.search = false
    }
  }
  
  // 获取分类数据（从本地读取）
  const fetchClassifications = async (type) => {
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const data = currentLocaleData.classifications[type] || []
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
