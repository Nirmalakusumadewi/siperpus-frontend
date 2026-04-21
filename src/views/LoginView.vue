<template>
  <div class="login">
    <h2>Login SiPerpus</h2>

    <select v-model="role">
      <option value="tamu">Tamu</option>
      <option value="anggota">Anggota</option>
      <option value="admin">Admin</option>
    </select>

    <button @click="login">Masuk</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { setRole } from '@/utils/auth'
import { useRouter } from 'vue-router'

const role = ref('tamu')
const router = useRouter()

function login() {
  setRole(role.value)

  if (role.value === 'admin') router.push('/admin/buku')
  else router.push('/katalog')
}
</script>