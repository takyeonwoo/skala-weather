import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/weather',
      name: 'weather',
      component: () => import('../views/WeatherView.vue'),
    },
    {
      path: '/weather2',
      name: 'weather2',
      component: () => import('../views/WeatherView2.vue'),
    },
    {
      path: '/weather3',
      name: 'weather3',
      component: () => import('../views/WeatherParent.vue'),
    },
    {
      path: '/weather4',
      name: 'weather4',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather4/:cityId',
      name: 'weatherDetail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/weather5',
      name: 'weather5',
      component: () => import('../views/WeatherStoreView.vue'),
    },
    {
      path: '/weather5/:cityId',
      name: 'weather5Detail',
      component: () => import('../views/WeatherStoreDetailView.vue'),
    },
    {
      path: '/weather6',
      name: 'weather6',
      component: () => import('../views/WeatherAxiosView.vue'),
    },
    {
      path: '/weather6/:cityId',
      name: 'weather6Forecast',
      component: () => import('../views/WeatherForecastView.vue'),
    },
    {
      path: '/weather-map',
      name: 'weatherMap',
      component: () => import('../views/WeatherMapView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/compare/:cityA/:cityB',
      name: 'compare',
      component: () => import('../views/CompareView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
