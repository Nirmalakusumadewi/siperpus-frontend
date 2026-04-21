import { createRouter, createWebHistory } from 'vue-router'
import { getRole } from '@/utils/auth'

const routes = [
  {
  path: '/login',
  name: 'login',
  component: () => import('../views/LoginView.vue'),
  meta: { title: 'Login' }
},
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
  {
    path: '/katalog/:id',
    name: 'detail-buku',
    component: () => import('../views/DetailBuku.vue'),
    meta: { title: 'Detail Buku' }
  },
  {
  path: '/admin/buku',
  component: () => import('../views/AdminBuku.vue'),
  meta: { role: 'admin', title: 'CRUD Buku' }
},
{
  path: '/riwayat',
  component: () => import('../views/RiwayatView.vue'),
  meta: { role: 'anggota', title: 'Riwayat' }
}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const role = getRole()

  // kalau route butuh role
  if (to.meta.role && to.meta.role !== role) {
    return next('/katalog') // lempar ke katalog
  }

  next()
})

/* 🏷️ AUTO TITLE */
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — SiPerpus`
    : 'SiPerpus'
})

export default router