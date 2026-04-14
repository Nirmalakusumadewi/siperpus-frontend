// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Beranda' }
  },
  {
    path: '/katalog',
    name: 'katalog',
    component: () => import('../views/KatalogView.vue'),
    meta: { title: 'Katalog Buku' }
  },

  // DETAIL BUKU
  {
    path: '/katalog/:id',
    name: 'detail-buku',
    component: () => import('../views/DetailBuku.vue'),
    meta: { title: 'Detail Buku' },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// update title otomatis
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — SiPerpus`
    : 'SiPerpus'
})

export default router