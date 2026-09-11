import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/post/:slug', name: 'Post', component: () => import('../views/PostView.vue') },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0, behavior: 'smooth' }
})

export default router
