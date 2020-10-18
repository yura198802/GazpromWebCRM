import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Авторизация',
      component: () => import('@/views/Login/Login'),
      meta: {layout: 'Public'}
    },
    {
      path: '/register',
      name: 'Авторизация',
      component: () => import('@/views/Register/Register'),
      meta: {layout: 'Public'}
    },
    {
      path: '/',
      name: 'Loading',
      component: () => import('@/views/Login/Login'),
      meta: {layout: 'Public'}
    },
    {
      path: '/constructor',
      name: 'Constructor',
      component: () => import('@/views/Constructor/Constructor'),
      meta: {layout: 'Private'}
    },
    {
      path: '/information',
      name: 'Монитор ботов',
      component: () => import('@/views/InformationBot/InformationBot'),
      meta: {layout: 'Private'}
    },
    {
      path: '/dashboard',
      name: 'Главная',
      component: () => import('@/views/Dashboard/Dashboard'),
      meta: {layout: 'Private'},
      children: [
        {
          path: 'profile',
          component: () => import('@/views/Dashboard/Dashboard')
        },
        {
          path: 'posts',
          component: () => import('@/views/Dashboard/Dashboard')
        }
      ]
    },
    {
      path: '/FileImport',
      name: 'Импорт',
      component: () => import('@/views/FileImport/FileImport'),
      meta: {layout: 'Private'}
    },
    {
      path: '/Pp',
      name: 'Печать платежных поручений',
      component: () => import('@/views/Pp/Pp'),
      meta: {layout: 'Private'}
    },
    {
      path: '/Settings',
      name: 'Настройки',
      component: () => import('@/views/Settings/settings'),
      meta: {layout: 'Private'}
    },
    {
      path: '/diag',
      name: 'Диаграммы',
      component: () => import('@/components/Diag/diag'),
      meta: {layout: 'Private'}
    }
  ]
})
