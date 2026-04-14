<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <h1>📚 SiPerpus</h1>
      <p class="tagline">Sistem Informasi Perpustakaan Digital</p>
      <p class="desc">
        Kelola koleksi buku, anggota, dan peminjaman
        dalam satu platform modern berbasis Vue.js 3.
      </p>

      <div class="hero-btns">
        <button class="btn-primary" @click="showInfo('katalog')">
          Jelajahi Katalog
        </button>
        <button class="btn-outline" @click="showInfo('login')">
          Masuk Akun
        </button>
      </div>
    </section>

    <!-- STATISTIK -->
    <section class="stat-section">
      <h2>Statistik Koleksi</h2>
      <p class="sub">Data perpustakaan saat ini</p>

      <div class="stat-grid">
        <div
          v-for="kartu in kartuStat"
          :key="kartu.id"
          class="kartu"
          :style="{ borderTopColor: kartu.warna }"
        >
          <span class="k-ikon">{{ kartu.ikon }}</span>
          <span class="k-nilai" :style="{ color: kartu.warna }">
            {{ kartu.nilai }}
          </span>
          <span class="k-label">{{ kartu.label }}</span>
          <span v-if="kartu.sub" class="k-sub">{{ kartu.sub }}</span>
        </div>
      </div>
    </section>

    <!-- DEMO -->
    <section class="demo">
      <h2>Demo Reaktivitas Vue.js 3</h2>
      <p class="sub">
        Ubah nilai di bawah dan perhatikan statistik berubah otomatis!
      </p>

      <div class="demo-row">
        <div class="ctrl-group">
          <label>Total Buku</label>
          <div class="ctrl">
            <button @click="stat.totalBuku--" :disabled="stat.totalBuku <= 0">-</button>
            <span>{{ stat.totalBuku }}</span>
            <button @click="stat.totalBuku++">+</button>
          </div>
        </div>

        <div class="ctrl-group">
          <label>Peminjaman Aktif</label>
          <div class="ctrl">
            <button @click="kurangiPeminjaman" :disabled="stat.peminjamanAktif <= 0">-</button>
            <span>{{ stat.peminjamanAktif }}</span>
            <button @click="tambahPeminjaman">+</button>
          </div>
        </div>
      </div>

      <div class="computed-info">
        <p>
          Buku Tersedia: <strong>{{ bukuTersedia }}</strong>
          &nbsp;({{ persenTersedia }})
        </p>
        <div class="pbar">
          <div class="pbar-fill" :style="{ width: persenTersedia }"></div>
        </div>
      </div>
    </section>

    <!-- TOAST -->
    <div v-if="toast" class="toast" :class="toast.type">
      <span>{{ toast.msg }}</span>
      <button @click="toast = null">x</button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const stat = reactive({
  totalBuku: 1247,
  totalAnggota: 328,
  peminjamanAktif: 89,
})

const toast = ref(null)
let toastTimer = null

const bukuTersedia = computed(() => stat.totalBuku - stat.peminjamanAktif)

const persenTersedia = computed(() => {
  if (stat.totalBuku === 0) return '0%'
  return ((bukuTersedia.value / stat.totalBuku) * 100).toFixed(1) + '%'
})

const kartuStat = computed(() => [
  { id:'buku', ikon:'📚', label:'Total Buku', nilai:stat.totalBuku, warna:'#2563EB' },
  { id:'anggota', ikon:'👥', label:'Anggota Aktif', nilai:stat.totalAnggota, warna:'#059669' },
  { id:'pinjam', ikon:'📤', label:'Dipinjam', nilai:stat.peminjamanAktif, warna:'#D97706' },
  { id:'tersedia', ikon:'✅', label:'Buku Tersedia', nilai:bukuTersedia.value, warna:'#7C3AED', sub:persenTersedia.value },
])

watch(() => stat.peminjamanAktif, (baru) => {
  const persen = (baru / stat.totalBuku) * 100
  if (persen > 80) {
    showToast('warning', `⚠️ ${persen.toFixed(0)}% buku sedang dipinjam!`)
  }
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

function tambahPeminjaman() {
  if (stat.peminjamanAktif >= stat.totalBuku) {
    showToast('error', '❌ Semua buku sudah dipinjam!')
    return
  }
  stat.peminjamanAktif++
}

function kurangiPeminjaman() {
  if (stat.peminjamanAktif > 0) stat.peminjamanAktif--
}

function showInfo(fitur) {
  const pesan = {
    katalog: '📚 Katalog ada di halaman Katalog',
    login: '🔐 Fitur login ada di sistem autentikasi',
  }
  showToast('info', pesan[fitur] || 'Fitur segera hadir')
}

function showToast(type, msg) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { type, msg }
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 3500)
}
</script>

<style scoped> 

.home {
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  
}
/* Hero */ 
.hero {
  text-align: center;
  padding: 60px 20px 40px;
}
.hero h1 { font-size: 3rem; font-weight: 800; color: #1A3C5E; } 
.tagline { font-size: 1.3rem; color: #2563EB; font-weight: 600; margin: 8px 
0; } 
.desc { color: #64748B; max-width: 500px; margin: 12px auto 28px; } 
.hero-btns { display: flex; gap: 12px; justify-content: center; } 
.btn-primary { background: #2563EB; color: #fff; border: none; 
  padding: 12px 28px; border-radius: 8px; font-size: 1rem; font-weight: 600; 
  cursor: pointer; transition: .2s; } 
.btn-primary:hover { background: #1D4ED8; } 
.btn-outline { background: transparent; color: #2563EB; border: 2px solid 
#2563EB; 
  padding: 12px 28px; border-radius: 8px; font-size: 1rem; font-weight: 600; 
  cursor: pointer; transition: .2s; } 
.btn-outline:hover { background: #EFF6FF; } 
  
/* Statistik */ 
.stat-section, .demo { margin-top: 60px; } 
.stat-section h2, .demo h2 { font-size: 1.8rem; color: #1A3C5E; text-align: 
center; } 
.sub { text-align: center; color: #64748B; margin: 8px 0 28px; } 
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.kartu { background: #fff; border-radius: 12px; padding: 24px 20px; 
  border-top: 4px solid; box-shadow: 0 2px 12px rgba(0,0,0,.07); 
  text-align: center; transition: transform .2s; } 
.kartu:hover { transform: translateY(-3px); } 
.k-ikon  { display: block; font-size: 2rem; } 
.k-nilai { display: block; font-size: 2.2rem; font-weight: 800; margin: 8px 
0; } 
.k-label { font-size: .85rem; color: #64748B; font-weight: 500; } 
.k-sub   { display: block; font-size: .75rem; color: #059669; 
  background: #F0FDF4; padding: 2px 8px; border-radius: 12px; margin-top: 
6px; } 
/* Demo */ 
.demo { background: #fff; border-radius: 16px; padding: 40px; 
  box-shadow: 0 2px 12px rgba(0,0,0,.06); } 
.demo-row { display: flex; gap: 40px; justify-content: center; 
  flex-wrap: wrap; margin: 24px 0; } 
.ctrl-group label { display: block; font-weight: 600; color: #475569; margin-bottom: 8px; } 
.ctrl { display: flex; align-items: center; gap: 12px; } 
.ctrl button { width: 36px; height: 36px; border: 2px solid #2563EB; 
  background: transparent; color: #2563EB; border-radius: 8px; 
  font-size: 1.2rem; cursor: pointer; transition: .2s; } 
.ctrl button:hover:not(:disabled) { background: #2563EB; color: #fff; } 
.ctrl button:disabled { opacity: .3; cursor: not-allowed; } 
.ctrl span { font-size: 1.5rem; font-weight: 700; min-width: 60px; text-align: center; } 
.computed-info { text-align: center; } 
.computed-info p { margin-bottom: 12px; color: #475569; } 
.computed-info strong { color: #1A3C5E; font-size: 1.1rem; } 
.pbar { height: 12px; background: #E2E8F0; border-radius: 6px; max-width: 
400px; margin: 0 auto; } 
.pbar-fill { height: 100%; background: linear-gradient(90deg, #2563EB, 
#059669); 
  border-radius: 6px; transition: width .5s; } 
  
/* Toast */ 
.toast { position: fixed; bottom: 24px; right: 24px; max-width: 380px; 
  padding: 14px 18px; border-radius: 10px; display: flex; gap: 12px; 
  align-items: center; justify-content: space-between; 
  box-shadow: 0 4px 20px rgba(0,0,0,.15); z-index: 999; 
  animation: slideIn .3s ease; } 
.toast button { background: none; border: none; cursor: pointer; font-size: 
1rem; opacity:.6; } 
.toast.info    { background: #EFF6FF; border-left: 4px solid #2563EB; color: 
#1E3A5F; } 
.toast.warning { background: #FFFBEB; border-left: 4px solid #D97706; color: 
#7C4A00; } 
.toast.error   { background: #FEF2F2; border-left: 4px solid #DC2626; color: 
#7F1D1D; } 
@keyframes slideIn { from { transform: translateX(110%); opacity:0; } 
                      to   { transform: translateX(0);    opacity:1; } } 
</style>