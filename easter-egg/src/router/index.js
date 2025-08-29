import { createRouter, createWebHistory } from 'vue-router'

// 预先导入组件以避免动态导入问题
import HomeView from '../views/HomeView.vue'
import VideoGamesView from '../views/VideoGamesView.vue'
import MoviesView from '../views/MoviesView.vue'
import TVShowsView from '../views/TVShowsView.vue'
import NewsView from '../views/NewsView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import DetailView from '../views/DetailView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

// 导入路由守卫
import { globalBeforeEach } from './guards.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/games',
      name: 'games',
      component: VideoGamesView
    },
    {
      path: '/games/:addressBar',
      name: 'games-detail',
      component: DetailView,
      props: route => ({
        addressBar: route.params.addressBar,
        type: 'games'
      })
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesView
    },
    {
      path: '/movies/:addressBar',
      name: 'movies-detail',
      component: DetailView,
      props: route => ({
        addressBar: route.params.addressBar,
        type: 'movies'
      })
    },
    {
      path: '/tv',
      name: 'tv',
      component: TVShowsView
    },
    {
      path: '/tv/:addressBar',
      name: 'tv-detail',
      component: DetailView,
      props: route => ({
        addressBar: route.params.addressBar,
        type: 'tv'
      })
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/search',
      name: 'search-results',
      component: SearchResultsView
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginView
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: DashboardView
    }
  ]
})

// 添加全局前置守卫
router.beforeEach(globalBeforeEach)

export default router
