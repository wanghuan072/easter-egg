import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/views/VideoGamesView.vue'),
    },
    {
      path: '/games/:addressBar',
      name: 'game-detail',
      component: () => import('@/views/DetailView.vue'),
      props: (route) => ({ type: 'games', addressBar: route.params.addressBar })
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/MoviesView.vue'),
    },
    {
      path: '/movies/:addressBar',
      name: 'movie-detail',
      component: () => import('@/views/DetailView.vue'),
      props: (route) => ({ type: 'movies', addressBar: route.params.addressBar })
    },
    {
      path: '/tv',
      name: 'tv',
      component: () => import('@/views/TVShowsView.vue'),
    },
    {
      path: '/tv/:addressBar',
      name: 'tv-detail',
      component: () => import('@/views/DetailView.vue'),
      props: (route) => ({ type: 'tv', addressBar: route.params.addressBar })
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsView.vue'),
    },
    {
      path: '/search',
      name: 'search-results',
      component: () => import('@/views/SearchResultsView.vue'),
    },
  ],
})

export default router
