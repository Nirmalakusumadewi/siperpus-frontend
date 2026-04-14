<!-- src/views/KatalogView.vue -->
<template>
  <div class="katalog-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1>Katalog Buku</h1>
      <p>{{ infoHasil }}</p>
    </div>

    <!-- TOOLBAR: Search, Filter, Sort -->
    <div class="toolbar">
      <!-- v-model.trim + v-focus + @keyup.escape untuk search -->
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

      <!-- v-model + v-for untuk filter kategori -->
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

      <!-- v-model untuk filter status -->
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

    <!-- STATE: Loading — skeleton cards menggunakan v-for range angka -->
    <div v-if="isLoading" class="grid-buku">
      <div v-for="n in 8" :key="n" class="skeleton-kartu"></div>
    </div>

    <!-- STATE: Hasil Kosong -->
    <div v-else-if="bukuTerfilter.length === 0" class="state-kosong">
      <p>📭 Tidak ada buku yang cocok dengan pencarian Anda.</p>
      <button @click="resetFilter" class="btn-reset">Reset Filter</button>
    </div>

    <!-- STATE: Data Ada -->
    <div v-else class="grid-buku">
      <div
        v-for="buku in bukuTerfilter"
        :key="buku.id"
        :class="[
          'kartu-buku',
          { 'kartu-dipinjam': !buku.tersedia }
        ]"
      >
        <!-- v-highlight: sorot kata cari di judul -->
        <h3 class="judul" v-highlight="kataCari">{{ buku.judul }}</h3>
        <!-- v-highlight: sorot kata cari di nama penulis -->
        <p class="penulis" v-highlight="kataCari">{{ buku.penulis }}</p>

        <div class="kartu-meta">
          <span class="badge-kategori">{{ buku.kategori }}</span>
          <span
            class="badge-status"
            :class="buku.tersedia ? 'tersedia' : 'dipinjam'"
          >
            {{ buku.tersedia ? 'Tersedia' : 'Dipinjam' }}
          </span>
        </div>

        <p class="tahun">{{ buku.tahun }} &bull; {{ buku.penerbit }}</p>

        <div class="kartu-actions">
          <button class="btn-detail" @click="lihatDetail(buku)">Detail</button>
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

    <!-- TOGGLE PANEL FILTER LANJUTAN -->
    <button class="btn-filter-toggle" @click="panelFilterTerbuka = !panelFilterTerbuka">
      {{ panelFilterTerbuka ? 'Sembunyikan' : 'Tampilkan' }} Filter Lanjutan
    </button>

    <!-- v-show: panel ini SELALU ada di DOM, hanya tersembunyi saat false -->
    <div v-show="panelFilterTerbuka" class="panel-filter-lanjutan">
      <h4>Filter Lanjutan</h4>
      <label>Tahun dari:</label>
      <input v-model.number="filterTahunDari" type="number" placeholder="2000" />
      <label>Tahun sampai:</label>
      <input v-model.number="filterTahunSampai" type="number" :placeholder="tahunSekarang" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vFocus } from '@/directives/vFocus'
import { vHighlight } from '@/directives/vHighlight'

// ── STATE ──────────────────────────────────────────────
const kataCari          = ref('')
const filterKategori    = ref('')
const filterStatus      = ref('semua')
const filterTahunDari   = ref(null)
const filterTahunSampai = ref(null)
const panelFilterTerbuka = ref(false)
const isLoading          = ref(false)
const tahunSekarang      = new Date().getFullYear()

// Status options untuk tombol filter
const statusOptions = [
  { label: 'Semua',    value: 'semua' },
  { label: 'Tersedia', value: 'tersedia' },
  { label: 'Dipinjam', value: 'dipinjam' },
]

// Data buku — di Bab 5 ini akan diganti dengan fetch dari API Express.js
const daftarBuku = ref([
  { id: 1, judul: 'Clean Code',               penulis: 'Robert C. Martin', kategori: 'Teknologi', penerbit: 'Prentice Hall',   tahun: 2008, tersedia: true  },
  { id: 2, judul: 'Vue.js 3 for Beginners',   penulis: 'Simone Cuomo',     kategori: 'Teknologi', penerbit: 'Packt',           tahun: 2024, tersedia: false },
  { id: 3, judul: 'Learning Vue',             penulis: 'Maya Shavin',      kategori: 'Teknologi', penerbit: "O'Reilly",        tahun: 2024, tersedia: true  },
  { id: 4, judul: 'Bumi',                     penulis: 'Tere Liye',        kategori: 'Fiksi',     penerbit: 'Gramedia',        tahun: 2014, tersedia: true  },
  { id: 5, judul: 'Sapiens',                  penulis: 'Yuval Noah Harari',kategori: 'Sejarah',   penerbit: 'Harper',          tahun: 2011, tersedia: false },
  { id: 6, judul: 'Atomic Habits',            penulis: 'James Clear',      kategori: 'Bisnis',    penerbit: 'Avery',           tahun: 2018, tersedia: true  },
  { id: 7, judul: 'The Pragmatic Programmer', penulis: 'David Thomas',     kategori: 'Teknologi', penerbit: 'Addison-Wesley',  tahun: 1999, tersedia: true  },
  { id: 8, judul: 'Laskar Pelangi',           penulis: 'Andrea Hirata',    kategori: 'Fiksi',     penerbit: 'Bentang',         tahun: 2005, tersedia: false },
])

// ── COMPUTED ───────────────────────────────────────────
// Ambil semua kategori unik dari data buku
const daftarKategori = computed(() =>
  [...new Set(daftarBuku.value.map(b => b.kategori))].sort()
)

// Filter gabungan: kata cari + kategori + status + tahun
const bukuTerfilter = computed(() => {
  return daftarBuku.value.filter(buku => {
    // Filter kata cari (case-insensitive)
    const q = kataCari.value.toLowerCase()
    const cocokCari = !q ||
      buku.judul.toLowerCase().includes(q) ||
      buku.penulis.toLowerCase().includes(q)

    // Filter kategori
    const cocokKategori = !filterKategori.value ||
      buku.kategori === filterKategori.value

    // Filter status
    const cocokStatus =
      filterStatus.value === 'semua' ||
      (filterStatus.value === 'tersedia' && buku.tersedia) ||
      (filterStatus.value === 'dipinjam' && !buku.tersedia)

    // Filter tahun
    const cocokTahun =
      (!filterTahunDari.value   || buku.tahun >= filterTahunDari.value) &&
      (!filterTahunSampai.value || buku.tahun <= filterTahunSampai.value)

    return cocokCari && cocokKategori && cocokStatus && cocokTahun
  })
})

// Info hasil filter untuk ditampilkan di header
const infoHasil = computed(() => {
  const total     = daftarBuku.value.length
  const terfilter = bukuTerfilter.value.length
  if (kataCari.value || filterKategori.value || filterStatus.value !== 'semua') {
    return `Menampilkan ${terfilter} dari ${total} buku`
  }
  return `Total ${total} buku dalam koleksi`
})

// ── METHODS ────────────────────────────────────────────
function resetFilter() {
  kataCari.value          = ''
  filterKategori.value    = ''
  filterStatus.value      = 'semua'
  filterTahunDari.value   = null
  filterTahunSampai.value = null
}

function lihatDetail(buku) {
  console.log('Lihat detail:', buku.judul)
  // Bab 4: router.push({ name: 'detail-buku', params: { id: buku.id } })
}

function pinjamBuku(id) {
  const buku = daftarBuku.value.find(b => b.id === id)
  if (buku) {
    buku.tersedia = false
    console.log(`Buku '${buku.judul}' berhasil dipinjam!`)
    // Bab 5: POST ke backend API untuk mencatat peminjaman
  }
}
</script>

<style scoped>
.katalog-page { max-width:1100px; margin:0 auto; padding:32px 24px; }
.page-header { margin-bottom:24px; } 
.page-header h1 { font-size:2rem; color:#1A3C5E; } 
.page-header p  { color:#64748B; margin-top:4px; } 

/* Toolbar */
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
  background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 1rem;
}

.select-filter {
  flex: 0 0 180px;
}

.filter-status {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.btn-status {
  padding: 8px 16px; border: 1px solid #CBD5E1; border-radius: 8px;
  background: white; cursor: pointer; font-size: .9rem; transition: .2s;
}
.btn-status.aktif { background: #2563EB; color: white; border-color: #2563EB; }

/* Skeleton loading */
.skeleton-kartu {
  height: 200px; background: #E2E8F0; border-radius: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .5 } }

/* Grid buku */
.grid-buku {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.kartu-buku {
  background: white; border-radius: 12px; padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .07);
  transition: transform .2s, box-shadow .2s;
}
.kartu-buku:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0, 0, 0, .12); }
.kartu-dipinjam { opacity: .75; }

.judul   { font-size: 1rem; font-weight: 700; color: #1A3C5E; margin-bottom: 4px; }
.penulis { color: #475569; font-size: .9rem; margin-bottom: 12px; }

.kartu-meta { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
.badge-kategori {
  background: #EFF6FF; color: #1D4ED8;
  font-size: .75rem; padding: 2px 8px; border-radius: 12px;
}
.badge-status.tersedia {
  background: #F0FDF4; color: #15803D;
  font-size: .75rem; padding: 2px 8px; border-radius: 12px;
}
.badge-status.dipinjam {
  background: #FEF2F2; color: #DC2626;
  font-size: .75rem; padding: 2px 8px; border-radius: 12px;
}

.tahun { font-size: .8rem; color: #94A3B8; margin-bottom: 16px; }

.kartu-actions { display: flex; gap: 8px; }
.btn-detail {
  flex: 1; padding: 8px; border: 1px solid #2563EB; color: #2563EB;
  background: transparent; border-radius: 6px; cursor: pointer; transition: .2s;
}
.btn-detail:hover { background: #EFF6FF; }
.btn-pinjam {
  flex: 1; padding: 8px; background: #2563EB; color: white;
  border: none; border-radius: 6px; cursor: pointer; transition: .2s;
}
.btn-pinjam:hover { background: #1D4ED8; }

/* State kosong */
.state-kosong { text-align: center; padding: 60px 20px; color: #64748B; }
.state-kosong p { font-size: 1.1rem; margin-bottom: 16px; }
.btn-reset {
  background: #2563EB; color: white; border: none;
  padding: 10px 24px; border-radius: 8px; cursor: pointer;
}

/* Panel filter lanjutan */
.btn-filter-toggle {
  margin-top: 20px; background: none; border: 1px solid #CBD5E1;
  padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #475569;
}
.panel-filter-lanjutan {
  margin-top: 12px; background: white; border: 1px solid #E2E8F0;
  border-radius: 12px; padding: 20px; display: flex; gap: 16px;
  align-items: center; flex-wrap: wrap;
}
.panel-filter-lanjutan h4 { color: #1A3C5E; }
.panel-filter-lanjutan label { color: #475569; font-size: .9rem; }
.panel-filter-lanjutan input {
  padding: 6px 10px; border: 1px solid #CBD5E1;
  border-radius: 6px; width: 100px;
}
</style>