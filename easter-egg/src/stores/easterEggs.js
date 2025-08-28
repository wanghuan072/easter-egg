import { defineStore } from 'pinia';
import { gamesApi, moviesApi, tvApi, newsApi, searchApi } from '../services/api.js';

export const useEasterEggsStore = defineStore('easterEggs', {
  state: () => ({
    // 游戏数据
    games: {
      data: [],
      loading: false,
      error: null,
      pagination: null
    },
    
    // 电影数据
    movies: {
      data: [],
      loading: false,
      error: null,
      pagination: null
    },
    
    // 电视数据
    tv: {
      data: [],
      loading: false,
      error: null,
      pagination: null
    },
    
    // 新闻数据
    news: {
      data: [],
      loading: false,
      error: null,
      pagination: null
    },
    
    // 搜索数据
    search: {
      data: [],
      loading: false,
      error: null,
      pagination: null,
      query: ''
    },
    
    // 首页数据
    homeData: {
      games: [],
      movies: [],
      tv: [],
      loading: false,
      error: null
    },
    
    // 最新发现
    latestDiscoveries: {
      data: [],
      loading: false,
      error: null
    }
  }),

  getters: {
    // 获取游戏数据
    getGames: (state) => state.games.data,
    
    // 获取电影数据
    getMovies: (state) => state.movies.data,
    
    // 获取电视数据
    getTV: (state) => state.tv.data,
    
    // 获取新闻数据
    getNews: (state) => state.news.data,
    
    // 获取搜索数据
    getSearchResults: (state) => state.search.data,
    
    // 获取首页数据
    getHomeData: (state) => state.homeData,
    
    // 获取最新发现
    getLatestDiscoveries: (state) => state.latestDiscoveries.data,
    
    // 检查是否正在加载
    isLoading: (state) => (type) => {
      switch (type) {
        case 'games': return state.games.loading;
        case 'movies': return state.movies.loading;
        case 'tv': return state.tv.loading;
        case 'news': return state.news.loading;
        case 'search': return state.search.loading;
        case 'home': return state.homeData.loading;
        case 'latest': return state.latestDiscoveries.loading;
        default: return false;
      }
    },
    
    // 检查是否有错误
    hasError: (state) => (type) => {
      switch (type) {
        case 'games': return state.games.error;
        case 'movies': return state.movies.error;
        case 'tv': return state.tv.error;
        case 'news': return state.news.error;
        case 'search': return state.search.error;
        case 'home': return state.homeData.error;
        case 'latest': return state.latestDiscoveries.error;
        default: return null;
      }
    }
  },

  actions: {
    // 获取游戏数据
    async fetchGames(params = {}) {
      this.games.loading = true;
      this.games.error = null;
      
      try {
        const response = await gamesApi.getAll(params);
        this.games.data = response.data;
        this.games.pagination = response.pagination;
      } catch (error) {
        this.games.error = error.message;
        console.error('Failed to fetch games:', error);
      } finally {
        this.games.loading = false;
      }
    },

    // 获取电影数据
    async fetchMovies(params = {}) {
      this.movies.loading = true;
      this.movies.error = null;
      
      try {
        const response = await moviesApi.getAll(params);
        this.movies.data = response.data;
        this.movies.pagination = response.pagination;
      } catch (error) {
        this.movies.error = error.message;
        console.error('Failed to fetch movies:', error);
      } finally {
        this.movies.loading = false;
      }
    },

    // 获取电视数据
    async fetchTV(params = {}) {
      this.tv.loading = true;
      this.tv.error = null;
      
      try {
        const response = await tvApi.getAll(params);
        this.tv.data = response.data;
        this.tv.pagination = response.pagination;
      } catch (error) {
        this.tv.error = error.message;
        console.error('Failed to fetch TV shows:', error);
      } finally {
        this.tv.loading = false;
      }
    },

    // 获取新闻数据
    async fetchNews(params = {}) {
      this.news.loading = true;
      this.news.error = null;
      
      try {
        const response = await newsApi.getAll(params);
        this.news.data = response.data;
        this.news.pagination = response.pagination;
      } catch (error) {
        this.news.error = error.message;
        console.error('Failed to fetch news:', error);
      } finally {
        this.news.loading = false;
      }
    },

    // 搜索
    async search(query, params = {}) {
      this.search.loading = true;
      this.search.error = null;
      this.search.query = query;
      
      try {
        const response = await searchApi.search(query, params);
        this.search.data = response.data;
        this.search.pagination = response.pagination;
      } catch (error) {
        this.search.error = error.message;
        console.error('Search failed:', error);
      } finally {
        this.search.loading = false;
      }
    },

    // 获取首页数据
    async fetchHomeData() {
      this.homeData.loading = true;
      this.homeData.error = null;
      
      try {
        const [gamesResponse, moviesResponse, tvResponse] = await Promise.all([
          gamesApi.getHome(),
          moviesApi.getHome(),
          tvApi.getHome()
        ]);
        
        this.homeData.games = gamesResponse.data;
        this.homeData.movies = moviesResponse.data;
        this.homeData.tv = tvResponse.data;
      } catch (error) {
        this.homeData.error = error.message;
        console.error('Failed to fetch home data:', error);
      } finally {
        this.homeData.loading = false;
      }
    },

    // 获取最新发现
    async fetchLatestDiscoveries() {
      this.latestDiscoveries.loading = true;
      this.latestDiscoveries.error = null;
      
      try {
        const [gamesResponse, moviesResponse, tvResponse, newsResponse] = await Promise.all([
          gamesApi.getLatest(3),
          moviesApi.getLatest(3),
          tvApi.getLatest(3),
          newsApi.getLatest(3)
        ]);
        
        // 合并所有最新数据并按日期排序
        const allLatest = [
          ...gamesResponse.data.map(item => ({ ...item, mediaType: 'games' })),
          ...moviesResponse.data.map(item => ({ ...item, mediaType: 'movies' })),
          ...tvResponse.data.map(item => ({ ...item, mediaType: 'tv' })),
          ...newsResponse.data.map(item => ({ ...item, mediaType: 'news' }))
        ];
        
        this.latestDiscoveries.data = allLatest.sort((a, b) => 
          new Date(b.publishDate) - new Date(a.publishDate)
        );
      } catch (error) {
        this.latestDiscoveries.error = error.message;
        console.error('Failed to fetch latest discoveries:', error);
      } finally {
        this.latestDiscoveries.loading = false;
      }
    },

    // 清除错误
    clearError(type) {
      switch (type) {
        case 'games': this.games.error = null; break;
        case 'movies': this.movies.error = null; break;
        case 'tv': this.tv.error = null; break;
        case 'news': this.news.error = null; break;
        case 'search': this.search.error = null; break;
        case 'home': this.homeData.error = null; break;
        case 'latest': this.latestDiscoveries.error = null; break;
      }
    },

    // 重置状态
    reset() {
      this.games = { data: [], loading: false, error: null, pagination: null };
      this.movies = { data: [], loading: false, error: null, pagination: null };
      this.tv = { data: [], loading: false, error: null, pagination: null };
      this.news = { data: [], loading: false, error: null, pagination: null };
      this.search = { data: [], loading: false, error: null, pagination: null, query: '' };
      this.homeData = { games: [], movies: [], tv: [], loading: false, error: null };
      this.latestDiscoveries = { data: [], loading: false, error: null };
    }
  }
});
