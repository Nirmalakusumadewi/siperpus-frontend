<template>
  <div class="admin">
    <h1>📚 CRUD Buku - Admin</h1>

    <!-- FORM TAMBAH / EDIT -->
    <div class="form">
      <input v-model="form.judul" placeholder="Judul Buku" />
      <input v-model="form.penulis" placeholder="Penulis" />
      <input v-model="form.kategori" placeholder="Kategori" />
      <input v-model.number="form.tahun" placeholder="Tahun" type="number" />

      <button v-if="!editMode" @click="tambahBuku">Tambah</button>
      <button v-else @click="updateBuku">Update</button>
      <button v-if="editMode" @click="batalEdit">Batal</button>
    </div>

    <!-- TABEL BUKU -->
    <table>
      <thead>
        <tr>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Kategori</th>
          <th>Tahun</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="buku in daftarBuku" :key="buku.id">
          <td>{{ buku.judul }}</td>
          <td>{{ buku.penulis }}</td>
          <td>{{ buku.kategori }}</td>
          <td>{{ buku.tahun }}</td>

          <td>
            <button @click="editBuku(buku)">Edit</button>
            <button @click="hapusBuku(buku.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const daftarBuku = ref([
  { id: 1, judul: 'Clean Code', penulis: 'Robert C. Martin', kategori: 'Teknologi', tahun: 2008 },
  { id: 2, judul: 'Vue JS', penulis: 'Simone Cuomo', kategori: 'Teknologi', tahun: 2024 }
])

const form = ref({
  id: null,
  judul: '',
  penulis: '',
  kategori: '',
  tahun: null
})

const editMode = ref(false)

// 🔥 CREATE
function tambahBuku() {
  if (!form.value.judul) return

  daftarBuku.value.push({
    id: Date.now(),
    ...form.value
  })

  resetForm()
}

// 🔥 DELETE
function hapusBuku(id) {
  daftarBuku.value = daftarBuku.value.filter(b => b.id !== id)
}

// 🔥 EDIT (isi form)
function editBuku(buku) {
  form.value = { ...buku }
  editMode.value = true
}

// 🔥 UPDATE
function updateBuku() {
  const index = daftarBuku.value.findIndex(b => b.id === form.value.id)
  if (index !== -1) {
    daftarBuku.value[index] = { ...form.value }
  }

  resetForm()
  editMode.value = false
}

// 🔥 RESET FORM
function resetForm() {
  form.value = {
    id: null,
    judul: '',
    penulis: '',
    kategori: '',
    tahun: null
  }
}

// 🔥 BATAL EDIT
function batalEdit() {
  resetForm()
  editMode.value = false
}
</script>

<style scoped>
.admin {
  padding: 20px;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
}

th {
  background: #2563EB;
  color: white;
}
</style>