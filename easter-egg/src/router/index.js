import { createRouter, createWebHistory } from 'vue-router'

// 预先导入组件以避免动态导入问题
import HomeView from '../views/HomeView.vue'
import VideoGamesView from '../views/VideoGamesView.vue'
import MoviesView from '../views/MoviesView.vue'
import TVShowsView from '../views/TVShowsView.vue'
import NewsView from '../views/NewsView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import DetailView from '../views/DetailView.vue'
import PopularView from '../views/PopularView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TermsOfUseView from '../views/TermsOfUseView.vue'
import CopyrightView from '../views/CopyrightView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import ContactUsView from '../views/ContactUsView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

// 导入路由守卫
import { globalBeforeEach, globalAfterEach } from './guards.js'

// 支持的语言列表（英文是默认语言，不需要路径前缀）
const supportedLanguages = ['en', 'ru', 'es', 'fr', 'de', 'ja', 'ko']

// 组件映射
const componentMap = {
  'HomeView': HomeView,
  'VideoGamesView': VideoGamesView,
  'MoviesView': MoviesView,
  'TVShowsView': TVShowsView,
  'NewsView': NewsView,
  'SearchResultsView': SearchResultsView,
  'DetailView': DetailView,
  'PopularView': PopularView,
  'PrivacyPolicyView': PrivacyPolicyView,
  'TermsOfUseView': TermsOfUseView,
  'CopyrightView': CopyrightView,
  'AboutUsView': AboutUsView,
  'ContactUsView': ContactUsView,
  'LoginView': LoginView,
  'DashboardView': DashboardView
}

// 页面配置（不包括管理员页面，管理员页面不需要多语言）
const pageConfigs = [
  {
    path: '/',
    component: 'HomeView',
    name: 'Home',
    meta: {
      title: 'EasterEggVault - Discover Hidden Secrets in Games, Movies & TV Shows',
      description: 'The ultimate guide to easter eggs, hidden details, and secrets in video games, movies, and TV shows. Discover comprehensive guides and latest findings.',
      keywords: 'easter eggs, hidden secrets, video games, movies, tv shows, game guides, secrets, hidden details'
    }
  },
  {
    path: '/games',
    component: 'VideoGamesView',
    name: 'Games',
    meta: {
      title: 'Video Game Easter Eggs & Hidden Secrets - EasterEggVault',
      description: 'Discover amazing easter eggs and hidden secrets in your favorite video games. Complete guides with detailed walkthroughs and tips.',
      keywords: 'video game easter eggs, hidden secrets, game guides, easter eggs, gaming secrets'
    }
  },
  {
    path: '/games/:addressBar',
    component: 'DetailView',
    name: 'GameDetail',
    props: route => ({
      addressBar: route.params.addressBar,
      type: 'games'
    }),
    meta: {
      dynamic: true
    }
  },
  {
    path: '/movies',
    component: 'MoviesView',
    name: 'Movies',
    meta: {
      title: 'Movie Easter Eggs & Hidden Details - EasterEggVault',
      description: 'Find hidden easter eggs and secret details in movies. Discover behind-the-scenes secrets and hidden references.',
      keywords: 'movie easter eggs, hidden details, film secrets, movie references, hidden meanings'
    }
  },
  {
    path: '/movies/:addressBar',
    component: 'DetailView',
    name: 'MovieDetail',
    props: route => ({
      addressBar: route.params.addressBar,
      type: 'movies'
    }),
    meta: {
      dynamic: true
    }
  },
  {
    path: '/tv',
    component: 'TVShowsView',
    name: 'TV',
    meta: {
      title: 'TV Show Easter Eggs & Hidden Secrets - EasterEggVault',
      description: 'Uncover easter eggs and hidden secrets in TV shows. Find hidden references and behind-the-scenes details.',
      keywords: 'tv show easter eggs, hidden secrets, television secrets, show references, hidden details'
    }
  },
  {
    path: '/tv/:addressBar',
    component: 'DetailView',
    name: 'TVDetail',
    props: route => ({
      addressBar: route.params.addressBar,
      type: 'tv'
    }),
    meta: {
      dynamic: true
    }
  },
  {
    path: '/news',
    component: 'NewsView',
    name: 'News',
    meta: {
      title: 'Latest Easter Egg Discoveries & News - EasterEggVault',
      description: 'Stay updated with the latest easter egg discoveries, hidden secrets, and news in games, movies, and TV shows.',
      keywords: 'easter egg news, latest discoveries, hidden secrets news, gaming news, movie news'
    }
  },
  {
    path: '/news/:addressBar',
    component: 'DetailView',
    name: 'NewsDetail',
    props: route => ({
      addressBar: route.params.addressBar,
      type: 'news'
    }),
    meta: {
      dynamic: true
    }
  },
  {
    path: '/search',
    component: 'SearchResultsView',
    name: 'Search',
    meta: {
      title: 'Search Easter Eggs & Hidden Secrets - EasterEggVault',
      description: 'Search for easter eggs, hidden secrets, and details in games, movies, and TV shows.',
      keywords: 'search easter eggs, find hidden secrets, search games, search movies, search tv shows'
    }
  },
  {
    path: '/popular',
    component: 'PopularView',
    name: 'Popular',
    meta: {
      title: 'Popular Easter Eggs & Hidden Secrets - EasterEggVault',
      description: 'Discover the most popular and trending easter eggs, hidden secrets, and discoveries from our community.',
      keywords: 'popular easter eggs, trending secrets, popular discoveries, easter egg vault popular'
    }
  },
  {
    path: '/privacy',
    component: 'PrivacyPolicyView',
    name: 'Privacy',
    meta: {
      title: 'Privacy Policy - EasterEggVault',
      description: 'Privacy policy and data protection information for EasterEggVault users.',
      keywords: 'privacy policy, data protection, easter egg vault privacy'
    }
  },
  {
    path: '/terms',
    component: 'TermsOfUseView',
    name: 'Terms',
    meta: {
      title: 'Terms of Use - EasterEggVault',
      description: 'Terms of use and service agreement for EasterEggVault platform.',
      keywords: 'terms of use, service agreement, easter egg vault terms'
    }
  },
  {
    path: '/copyright',
    component: 'CopyrightView',
    name: 'Copyright',
    meta: {
      title: 'Copyright Information - EasterEggVault',
      description: 'Copyright information and intellectual property rights for EasterEggVault.',
      keywords: 'copyright, intellectual property, easter egg vault copyright'
    }
  },
  {
    path: '/about',
    component: 'AboutUsView',
    name: 'About',
    meta: {
      title: 'About Us - EasterEggVault',
      description: 'Learn more about EasterEggVault, our mission, and our community of easter egg hunters.',
      keywords: 'about us, easter egg vault mission, easter egg community'
    }
  },
  {
    path: '/contact',
    component: 'ContactUsView',
    name: 'Contact',
    meta: {
      title: 'Contact Us - EasterEggVault',
      description: 'Get in touch with the EasterEggVault team for questions, suggestions, or support.',
      keywords: 'contact us, easter egg vault contact, support'
    }
  }
]

// 动态生成路由
function generateRoutes() {
  const routes = []

  // 为每种语言生成路由
  supportedLanguages.forEach(lang => {
    pageConfigs.forEach(page => {
      const isDefaultLang = lang === 'en'
      const path = isDefaultLang ? page.path : `/${lang}${page.path}`
      const name = isDefaultLang ? page.name : `${page.name}${lang.charAt(0).toUpperCase() + lang.slice(1)}`

      routes.push({
        path,
        name,
        component: componentMap[page.component],
        props: page.props,
        meta: { ...page.meta, locale: lang }
      })
    })
  })

  // 添加管理员路由（不需要多语言）
  routes.push(
    {
      path: '/admin/login',
      name: 'admin-login',
      component: LoginView,
      meta: {
        title: 'Admin Login - EasterEggVault',
        description: 'Administrator login page for EasterEggVault content management.',
        keywords: 'admin login, easter egg vault admin, content management'
      }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: DashboardView,
      meta: {
        title: 'Admin Dashboard - EasterEggVault',
        description: 'Administrator dashboard for managing EasterEggVault content.',
        keywords: 'admin dashboard, content management, easter egg vault admin'
      }
    }
  )

  return routes
}

// 生成路由配置
const routes = generateRoutes()

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 检测URL中的语言
export function detectLanguageFromPath(path) {
  for (const lang of supportedLanguages) {
    if (lang === 'en') continue // 英文是默认语言，不需要前缀
    if (path.startsWith(`/${lang}`)) {
      return lang
    }
  }
  return 'en' // 默认返回英文
}

// 添加全局前置守卫
router.beforeEach(globalBeforeEach)

// 添加全局后置守卫
router.afterEach(globalAfterEach)

export default router
export { supportedLanguages }
