<template>
  <div class="detail">

    <!-- NAVBAR -->
    <div class="navbar">
      <h3>SiPerpus</h3>
    </div>

    <!-- BACK -->
    <div class="back">
      <button @click="$router.push('/katalog')">
        ← Kembali ke Katalog
      </button>
    </div>

    <!-- CONTENT -->
    <div class="content">

      <!-- COVER -->
      <div class="cover">
        <div class="img">COVER</div>
      </div>

      <!-- INFO -->
      <div class="info">
        <h2>{{ buku.judul }}</h2>

        <p>Penulis: {{ buku.penulis }}</p>
        <p>Penerbit: {{ buku.penerbit }}</p>
        <p>Tahun: {{ buku.tahun }}</p>
        <p>ISBN: {{ buku.isbn }}</p>
        <p>Kategori: {{ buku.kategori }}</p>

        <p>
          Status:
          <span :class="buku.tersedia ? 'ok' : 'no'">
            {{ buku.tersedia ? 'TERSEDIA' : 'DIPINJAM' }}
          </span>
          ({{ buku.stok }} stok)
        </p>

        <div class="btn">
          <button v-if="buku.tersedia">Pinjam Buku</button>
          <button>Simpan ▼</button>
        </div>
      </div>

    </div>

    <!-- SINOPSIS -->
    <div class="sinopsis">
      <h3>Sinopsis</h3>
      <p>{{ buku.sinopsis }}</p>
    </div>

    <!-- RELATED -->
    <div class="related">
      <h3>Buku Serupa</h3>

      <div class="grid">
        <div class="card">Buku 1</div>
        <div class="card">Buku 2</div>
        <div class="card">Buku 3</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const buku = ref({
  judul: 'Clean Code',
  penulis: 'Robert C. Martin',
  penerbit: 'Prentice Hall',
  tahun: 2008,
  isbn: '978-0132350884',
  kategori: 'Teknologi',
  tersedia: true,
  stok: 3,
  sinopsis: 'Buku tentang cara menulis kode yang bersih dan mudah dipahami.'
})
</script>

<style scoped>
.detail {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

/* NAVBAR */
.navbar {
  background: white;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

/* BACK */
.back {
  margin: 15px 0;
}

.back button {
  border: none;
  background: none;
  color: #2563eb;
  cursor: pointer;
}

/* CONTENT */
.content {
  display: flex;
  gap: 20px;
}

.cover .img {
  width: 250px;
  height: 300px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

/* INFO */
.info {
  flex: 1;
}

.btn {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.btn button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* STATUS */
.ok {
  color: green;
  font-weight: bold;
}

.no {
  color: red;
  font-weight: bold;
}

/* RELATED */
.related {
  margin-top: 30px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
</style>