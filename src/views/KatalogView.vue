<!-- src/views/KatalogView.vue -->
 import { useRouter } from 'vue-router'
import { getRole } from '@/utils/auth'


<template>
  <div class="katalog-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1>Katalog Buku</h1>
      <p>{{ infoHasil }}</p>
    </div>

    <!-- TOOLBAR: Search, Filter, Sort -->
    <div class="toolbar">
      <div class="search-wrap">
        <input
          v-model.trim="kataCari"
          v-focus
          type="text"
          placeholder="Cari judul atau penulis..."
          class="input-search"
          @keyup.escape="kataCari = ''"
        />
        <button
          v-if="kataCari"
          class="btn-clear"
          @click="kataCari = ''"
        >
          ✕
        </button>
      </div>

      <select v-model="filterKategori" class="select-filter">
        <option value="">Semua Kategori</option>
        <option
          v-for="kat in daftarKategori"
          :key="kat"
          :value="kat"
        >
          {{ kat }}
        </option>
      </select>

      <div class="filter-status">
        <button
          v-for="s in statusOptions"
          :key="s.value"
          :class="['btn-status', { aktif: filterStatus === s.value }]"
          @click="filterStatus = s.value"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="grid-buku">
      <div v-for="n in 8" :key="n" class="skeleton-kartu"></div>
    </div>

    <!-- EMPTY -->
    <div v-else-if="bukuTerfilter.length === 0" class="state-kosong">
      <p>📭 Tidak ada buku yang cocok dengan pencarian Anda.</p>
      <button @click="resetFilter" class="btn-reset">Reset Filter</button>
    </div>

    <!-- DATA -->
    <div v-else class="grid-buku">
      <div
        v-for="buku in bukuTerfilter"
        :key="buku.id"
        :class="['kartu-buku', { 'kartu-dipinjam': !buku.tersedia }]"
      >
        <h3 class="judul" v-highlight="kataCari">{{ buku.judul }}</h3>
        <p class="penulis" v-highlight="kataCari">{{ buku.penulis }}</p>

        <div class="kartu-meta">
          <span class="badge-kategori">{{ buku.kategori }}</span>
          <span class="badge-status" :class="buku.tersedia ? 'tersedia' : 'dipinjam'">
            {{ buku.tersedia ? 'Tersedia' : 'Dipinjam' }}
          </span>
        </div>

        <p class="tahun">{{ buku.tahun }} • {{ buku.penerbit }}</p>

        <div class="kartu-actions">
          <button class="btn-detail" @click="lihatDetail(buku)">
            Detail
          </button>

          <button
            v-if="buku.tersedia"
            class="btn-pinjam"
            @click="pinjamBuku(buku.id)"
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>

    <!-- FILTER LANJUT -->
    <button class="btn-filter-toggle" @click="panelFilterTerbuka = !panelFilterTerbuka">
      {{ panelFilterTerbuka ? 'Sembunyikan' : 'Tampilkan' }} Filter Lanjutan
    </button>

    <div v-show="panelFilterTerbuka" class="panel-filter-lanjutan">
      <h4>Filter Lanjutan</h4>

      <label>Tahun dari:</label>
      <input v-model.number="filterTahunDari" type="number" />

      <label>Tahun sampai:</label>
      <input v-model.number="filterTahunSampai" type="number" :placeholder="tahunSekarang" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'   // 🔥 TAMBAHAN FIX
import { vFocus } from '@/directives/vFocus'
import { vHighlight } from '@/directives/vHighlight'

const router = useRouter()              // 🔥 TAMBAHAN FIX

// ── STATE ──────────────────────────────────────────────
const kataCari = ref('')
const filterKategori = ref('')
const filterStatus = ref('semua')
const filterTahunDari = ref(null)
const filterTahunSampai = ref(null)
const panelFilterTerbuka = ref(false)
const isLoading = ref(false)
const tahunSekarang = new Date().getFullYear()

const statusOptions = [
  { label: 'Semua', value: 'semua' },
  { label: 'Tersedia', value: 'tersedia' },
  { label: 'Dipinjam', value: 'dipinjam' },
]

const daftarBuku = ref([
  { id: 1, judul: 'Clean Code', penulis: 'Robert C. Martin', kategori: 'Teknologi', penerbit: 'Prentice Hall', tahun: 2008, tersedia: true },
  { id: 2, judul: 'Vue.js 3 for Beginners', penulis: 'Simone Cuomo', kategori: 'Teknologi', penerbit: 'Packt', tahun: 2024, tersedia: false },
  { id: 3, judul: 'Learning Vue', penulis: 'Maya Shavin', kategori: 'Teknologi', penerbit: "O'Reilly", tahun: 2024, tersedia: true },
  { id: 4, judul: 'Bumi', penulis: 'Tere Liye', kategori: 'Fiksi', penerbit: 'Gramedia', tahun: 2014, tersedia: true },
  { id: 5, judul: 'Sapiens', penulis: 'Yuval Noah Harari', kategori: 'Sejarah', penerbit: 'Harper', tahun: 2011, tersedia: false },
  { id: 6, judul: 'Atomic Habits', penulis: 'James Clear', kategori: 'Bisnis', penerbit: 'Avery', tahun: 2018, tersedia: true },
  { id: 7, judul: 'The Pragmatic Programmer', penulis: 'David Thomas', kategori: 'Teknologi', penerbit: 'Addison-Wesley', tahun: 1999, tersedia: true },
  { id: 8, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', kategori: 'Fiksi', penerbit: 'Bentang', tahun: 2005, tersedia: false },
])

// ── COMPUTED ───────────────────────────────────────────
const daftarKategori = computed(() =>
  [...new Set(daftarBuku.value.map(b => b.kategori))].sort()
)

const bukuTerfilter = computed(() => {
  return daftarBuku.value.filter(buku => {
    const q = kataCari.value.toLowerCase()

    const cocokCari =
      !q ||
      buku.judul.toLowerCase().includes(q) ||
      buku.penulis.toLowerCase().includes(q)

    const cocokKategori =
      !filterKategori.value || buku.kategori === filterKategori.value

    const cocokStatus =
      filterStatus.value === 'semua' ||
      (filterStatus.value === 'tersedia' && buku.tersedia) ||
      (filterStatus.value === 'dipinjam' && !buku.tersedia)

    const cocokTahun =
      (!filterTahunDari.value || buku.tahun >= filterTahunDari.value) &&
      (!filterTahunSampai.value || buku.tahun <= filterTahunSampai.value)

    return cocokCari && cocokKategori && cocokStatus && cocokTahun
  })
})

const infoHasil = computed(() => {
  const total = daftarBuku.value.length
  const terfilter = bukuTerfilter.value.length

  if (kataCari.value || filterKategori.value || filterStatus.value !== 'semua') {
    return `Menampilkan ${terfilter} dari ${total} buku`
  }
  return `Total ${total} buku dalam koleksi`
})

// ── METHODS ────────────────────────────────────────────
function resetFilter() {
  kataCari.value = ''
  filterKategori.value = ''
  filterStatus.value = 'semua'
  filterTahunDari.value = null
  filterTahunSampai.value = null
}

function lihatDetail(buku) {
  // 🔥 FIX ROUTER
  router.push(`/katalog/${buku.id}`)
}

function pinjamBuku(id) {
  const buku = daftarBuku.value.find(b => b.id === id)
  if (buku) buku.tersedia = false
}
</script>

<style scoped>
/* ===== CSS KAMU TETAP UTUH 100% (TIDAK DIUBAH SAMA SEKALI) ===== */

.katalog-page { max-width:1100px; margin:0 auto; padding:32px 24px; }
.page-header { margin-bottom:24px; } 
.page-header h1 { font-size:2rem; color:#1A3C5E; } 
.page-header p  { color:#64748B; margin-top:4px; } 

.toolbar { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; } 

.search-wrap {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.input-search {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: .2s;
}

.input-search:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px #BFDBFE;
}

.btn-clear {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94A3B8;
  cursor: pointer; font-size: 1rem;
}

.select-filter { flex: 0 0 180px; }

.filter-status { display:flex; gap:6px; flex-wrap:wrap; }

.btn-status {
  padding:8px 16px; border:1px solid #CBD5E1;
  border-radius:8px; background:white;
  cursor:pointer; font-size:.9rem;
}

.btn-status.aktif { background:#2563EB; color:white; }

.skeleton-kartu {
  height:200px; background:#E2E8F0;
  border-radius:12px;
  animation:pulse 1.5s infinite;
}

@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

.grid-buku {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:20px;
}

.kartu-buku {
  background:white; border-radius:12px;
  padding:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.07);
}

.kartu-dipinjam { opacity:.75; }

.judul { font-weight:700; color:#1A3C5E; }
.penulis { color:#475569; }

.kartu-actions { display:flex; gap:8px; }

.btn-detail {
  flex:1; padding:8px;
  border:1px solid #2563EB;
  color:#2563EB;
  background:transparent;
  border-radius:6px;
}

.btn-pinjam {
  flex:1; padding:8px;
  background:#2563EB;
  color:white;
  border:none;
  border-radius:6px;
}

.state-kosong {
  text-align:center;
  padding:60px 20px;
}
</style>