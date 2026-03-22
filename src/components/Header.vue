<template>
  <header class="header">
    <!-- HAMBURGER -->
    <button class="hamb" @click="drawer = true" aria-label="Abrir menú">☰</button>

    <!-- LOGO -->
    <router-link :to="homePath" class="brand" @click="resetBuscar">
      <img :src="logo" alt="Logo" class="logo" />
    </router-link>

    <!-- BUSCADOR -->
    <div class="search-box" ref="searchBox">
      <div class="input-wrapper">
        <span class="icono">🔍</span>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar productos..."
          @input="onInput"
          @keydown.enter.prevent="onEnter"
          @keydown.down.prevent="bajar"
          @keydown.up.prevent="subir"
          @keydown.esc="abierto = false"
          @focus="abierto = true"
        />

        <button v-if="search" class="clear" @click="limpiar">✕</button>
      </div>

      <div v-if="abierto && sugerencias.length" class="sugerencias">
        <div
          v-for="(s, i) in sugerencias"
          :key="s.id"
          class="sugerencia"
          :class="{ activa: i === seleccion }"
          @mousedown.prevent="seleccionar(s)"
        >
          <img :src="s.imagen" alt="" />
          <span>{{ s.nombre }}</span>
        </div>
      </div>
    </div>

    <!-- ACCIONES -->
    <div class="acciones">
      <router-link
        v-if="user"
        :to="accountPath"
        class="cuenta-icon"
        aria-label="Mi cuenta"
      >
        👤
      </router-link>

      <router-link
        v-else
        to="/login"
        class="cuenta-icon"
        aria-label="Login"
      >
        🔑
      </router-link>

      <router-link
        :to="carritoPath"
        class="carrito-indicador"
        aria-label="Carrito"
      >
        🛒 <span class="n">{{ total }}</span>
      </router-link>
    </div>

    <!-- OVERLAY + DRAWER -->
    <div v-if="drawer" class="overlay" @click="drawer = false"></div>

    <aside class="drawer" :class="{ open: drawer }" aria-label="Menú">
      <div class="drawer-head">
        <div class="drawer-user" v-if="user">
          <div class="avatar">{{ iniciales }}</div>
          <div class="drawer-info">
            <div class="drawer-email">{{ user.email }}</div>
            <div class="drawer-sub">{{ tiendaLabel }}</div>
          </div>
        </div>

        <div class="drawer-user" v-else>
          <div class="avatar">RS</div>
          <div class="drawer-info">
            <div class="drawer-email">{{ tiendaLabel }}</div>
            <div class="drawer-sub">Menú</div>
          </div>
        </div>

        <button class="drawer-close" @click="drawer = false" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <nav class="drawer-nav">
        <router-link class="nav-link" :to="homePath" @click="goClose">
          🏠 Inicio
        </router-link>

        <router-link class="nav-link" :to="catalogoPath" @click="goClose">
          🗂️ Catálogo
        </router-link>

        <router-link class="nav-link" :to="carritoPath" @click="goClose">
          🛒 Carrito ({{ total }})
        </router-link>

        <router-link
          v-if="user"
          class="nav-link"
          :to="accountPath"
          @click="goClose"
        >
          👤 Mi cuenta
        </router-link>

        <router-link
          v-else
          class="nav-link"
          to="/login"
          @click="goClose"
        >
          🔑 Iniciar sesión
        </router-link>

        <router-link class="nav-link" to="/" @click="goClose">
          🔄 Cambiar tienda
        </router-link>

        <button v-if="user" class="nav-link danger" @click="logout">
          🚪 Cerrar sesión
        </button>
      </nav>
    </aside>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import logo from "../assets/logo.png"
import { productos as productosInternacional } from "../data/productosInternacional.js"
import { productos as productosCuba } from "../data/productosCuba.js"
import { supabase } from "../supabase"

defineProps({
  total: { type: Number, default: 0 }
})

const emit = defineEmits(["buscar"])
const router = useRouter()
const route = useRoute()

const search = ref("")
const abierto = ref(false)
const seleccion = ref(0)
const searchBox = ref(null)

const drawer = ref(false)
const user = ref(null)
let unsubAuth = null

const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const homePath = computed(() => {
  if (isInternacional.value) return "/internacional"
  if (isCuba.value) return "/cuba"
  return "/"
})

const catalogoPath = computed(() => {
  if (isInternacional.value) return "/internacional/catalogo"
  if (isCuba.value) return "/cuba/catalogo"
  return "/"
})

const carritoPath = computed(() => {
  if (isInternacional.value) return "/internacional/carrito"
  if (isCuba.value) return "/cuba/carrito"
  return "/"
})

const accountPath = computed(() => {
  if (isInternacional.value) return "/internacional/account"
  if (isCuba.value) return "/cuba/account"
  return "/login"
})

const tiendaLabel = computed(() => {
  if (isInternacional.value) return "ResuelveShop Internacional"
  if (isCuba.value) return "ResuelveShop Cuba"
  return "ResuelveShop"
})

const productosActuales = computed(() => {
  if (isInternacional.value) return productosInternacional
  if (isCuba.value) return productosCuba
  return []
})

const iniciales = computed(() => {
  const email = (user.value?.email || "").trim()
  if (!email) return "RS"
  return email.slice(0, 2).toUpperCase()
})

async function cargarUsuario() {
  const { data } = await supabase.auth.getUser()
  user.value = data.user ?? null
}

function resetBuscar() {
  search.value = ""
  emit("buscar", "")
}

const sugerencias = computed(() => {
  if (!search.value.trim()) return []
  return productosActuales.value
    .filter((p) =>
      String(p.nombre || "").toLowerCase().includes(search.value.toLowerCase())
    )
    .slice(0, 5)
})

function onInput() {
  emit("buscar", search.value)
  abierto.value = true
  seleccion.value = 0
}

function onEnter() {
  if (sugerencias.value.length && seleccion.value >= 0) {
    const producto = sugerencias.value[seleccion.value]
    if (producto) return seleccionar(producto)
  }

  abierto.value = false
  emit("buscar", search.value)
  document.activeElement?.blur?.()

  if (router.currentRoute.value.path !== homePath.value) {
    router.push(homePath.value)
  }
}

function seleccionar(producto) {
  search.value = producto.nombre
  emit("buscar", producto.nombre)
  abierto.value = false
  document.activeElement?.blur?.()

  if (router.currentRoute.value.path !== homePath.value) {
    router.push(homePath.value)
  }
}

function limpiar() {
  search.value = ""
  emit("buscar", "")
  abierto.value = false
}

function clickFuera(e) {
  if (!searchBox.value?.contains(e.target)) {
    abierto.value = false
  }
}

function bajar() {
  if (!sugerencias.value.length) return
  if (seleccion.value < sugerencias.value.length - 1) seleccion.value++
}

function subir() {
  if (!sugerencias.value.length) return
  if (seleccion.value > 0) seleccion.value--
}

function goClose() {
  drawer.value = false
}

async function logout() {
  await supabase.auth.signOut()
  drawer.value = false
  router.push("/")
}

onMounted(async () => {
  await cargarUsuario()

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
  unsubAuth = data?.subscription

  document.addEventListener("mousedown", clickFuera)
})

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", clickFuera)
  unsubAuth?.unsubscribe?.()
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: #f5f6f8;
}

/* HAMB */
.hamb{
  border:none;
  background:white;
  border-radius:999px;
  padding:10px 14px;
  font-weight:900;
  cursor:pointer;
}
.hamb:active{ transform:scale(.97); }

/* LOGO */
.brand { display: flex; align-items: center; }
.logo {
  height: 120px;
  width: auto;
  object-fit: contain;
  border-radius: 50%;
  transition: all 0.15s ease;
}
.logo:active { transform: scale(1.05); }

/* BUSCADOR */
.search-box { position: relative; display: flex; justify-content: center; }
.input-wrapper { position: relative; width: 100%; max-width: 520px; }
.input-wrapper input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
  background: white;
}
.icono {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
}
.clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

/* SUGERENCIAS */
.sugerencias {
  position: absolute;
  top: 100%;
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 12px;
  margin-top: 6px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 2000;
}
.sugerencia {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
}
.sugerencia:hover { background: #f0f0f0; }
.sugerencia img { width: 32px; height: 32px; object-fit: contain; }
.sugerencia.activa { background: #e8f5e9; }

/* ACCIONES */
.acciones { display: flex; align-items: center; gap: 14px; }

.cuenta-icon{
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: white;
  display: grid;
  place-items: center;
  text-decoration: none;
  font-weight: 900;
  color:#111;
  border: 1px solid #e5e7eb;
}

.carrito-indicador {
  background: #28a745;
  color: white;
  padding: 12px 16px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 16px;
  text-decoration: none;
  display:flex;
  align-items:center;
  gap:8px;
}
.carrito-indicador:hover { background: #218838; }
.carrito-indicador:active { transform: scale(0.97); }
.n{ font-weight: 1000; }

/* OVERLAY + DRAWER */
.overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.35);
  z-index:5000;
}
.drawer{
  position:fixed;
  top:0; left:0;
  width:82%;
  max-width:320px;
  height:100vh;
  background:white;
  z-index:6000;
  transform:translateX(-105%);
  transition:transform .18s ease;
  box-shadow:20px 0 40px rgba(0,0,0,.18);
  display:flex;
  flex-direction:column;
}
.drawer.open{ transform:translateX(0); }

.drawer-head{
  padding:16px;
  border-bottom:1px solid #eee;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.drawer-user{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}
.avatar{
  width:44px;
  height:44px;
  border-radius:14px;
  display:grid;
  place-items:center;
  font-weight:900;
  background:#e8f5e9;
  color:#14532d;
  border:1px solid rgba(40,167,69,0.25);
}
.drawer-info{ min-width:0; }
.drawer-email{
  font-weight:900;
  font-size:13px;
  max-width:190px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.drawer-sub{ color:#6b7280; font-size:12px; }

.drawer-close{
  border:none;
  background:#f0f0f0;
  border-radius:12px;
  width:38px;
  height:38px;
  cursor:pointer;
}

.drawer-nav{
  padding:12px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.nav-link{
  text-decoration:none;
  border:1px solid #eee;
  background:white;
  padding:12px;
  border-radius:14px;
  font-weight:900;
  color:#111;
  text-align:left;
  cursor:pointer;
}

.nav-link.danger{
  border-color:#fecaca;
  background:#fff1f2;
  color:#991b1b;
}

/* ===== Mobile Pro Header ===== */
@media (max-width: 900px) {
  .header{
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 10px;
    padding: 10px 12px;
  }

  .hamb{
    padding: 14px 18px;
    font-size: 20px;
  }

  .logo{
    height: 70px;
    border-radius: 14px;
  }

  .search-box{
    grid-column: 1 / -1;
    order: 3;
  }
  .input-wrapper{ max-width: 100%; }
  .input-wrapper input{
    font-size: 15px;
    padding: 12px 40px 12px 40px;
  }

  .acciones{
    display:none;
  }
}
</style>