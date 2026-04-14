<template> 
  <div id="app"> 
    <!-- Navbar sederhana — akan dipindah ke komponen AppHeader di Bab 3 --> 
    <nav class="navbar"> 
      <RouterLink to="/" class="brand">📚 SiPerpus</RouterLink> 
      <div class="nav-links"> 
        <RouterLink to="/" active-class="aktif" exact>Beranda</RouterLink> 
        <RouterLink to="/katalog" active-class="aktif">Katalog</RouterLink> 
        <!-- Link lain akan ditambahkan di Bab 4 --> 
      </div> 
    </nav> 
  
    <main> 
      <RouterView /> 
    </main> 
  </div> 
</template> 
  
/* Reset global */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* Body style */
body {
  font-family: 'Inter','Segoe UI',system-ui,sans-serif;
  background: #F8FAFC;
  color: #1E293B;
  line-height: 1.6;
}

<style>
/* Navbar */
.navbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:  24px;
  height: 64px;
  background: white;
  border-bottom: 1px solid #E2E8F0;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1A3C5E;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  padding: 6px 14px;
  border-radius: 6px;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  transition: .2s;
}

.nav-links a:hover {
  background: #F1F5F9;
  color: #1A3C5E;
}

.nav-links a.aktif {
  background: #EFF6FF;
  color: #2563EB;
  font-weight: 600;
}
</style>