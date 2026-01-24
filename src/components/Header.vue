<template>
  <header class="header">
    <!-- LOGO -->
    <router-link to="/" class="brand" @click="resetBuscar">
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

        <!-- ❌ LIMPIAR -->
        <button v-if="search" class="clear" @click="limpiar">✕</button>
      </div>

      <!-- SUGERENCIAS -->
      <div v-if="abierto && sugerencias.length" class="sugerencias">
        <div
          v-for="(s, i) in sugerencias"
          :key="s.id"
          class="sugerencia"
          :class="{ activa: i === seleccion }"
          @mousedown.prevent="seleccionar(s)"
        >
          <img :src="s.imagen" />
          <span>{{ s.nombre }}</span>
        </div>
      </div>
    </div>

    <!-- ACCIONES -->
    <div class="acciones">
      <!-- PERFIL O LOGIN -->
      <router-link v-if="user" to="/perfil" class="cuenta-link">
        👤 Perfil
      </router-link>

      <router-link v-else to="/login" class="cuenta-link">
        🔑 Login
      </router-link>

      <!-- CARRITO -->
      <router-link to="/carrito" class="carrito-indicador">
        🛒 {{ total }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import logo from "../assets/logo.png"
import { productos } from "../data/productos.js"
import { supabase } from "../supabase"

defineProps({
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(["buscar"])
const router = useRouter()

const search = ref("")
const abierto = ref(false)
const seleccion = ref(0)
const searchBox = ref(null)

const user = ref(null)
let unsubAuth = null

async function cargarUsuario() {
  const { data } = await supabase.auth.getUser()
  user.value = data.user ?? null
}

/* 🔄 RESET BUSCAR AL HACER CLIC EN LOGO */
function resetBuscar() {
  search.value = ""
  emit("buscar", "")
}

/* 🔎 FILTRAR SUGERENCIAS */
const sugerencias = computed(() => {
  if (!search.value.trim()) return []
  return productos
    .filter(p => p.nombre.toLowerCase().includes(search.value.toLowerCase()))
    .slice(0, 5)
})

function onInput() {
  emit("buscar", search.value)
  abierto.value = true
  seleccion.value = 0
}

/* ⏎ ENTER = ir al primer resultado */
function onEnter() {
  if (sugerencias.value.length && seleccion.value >= 0) {
    const producto = sugerencias.value[seleccion.value]
    if (producto) {
      seleccionar(producto)
      return
    }
  }

  abierto.value = false
  emit("buscar", search.value)
  document.activeElement.blur()

  if (router.currentRoute.value.path !== "/") {
    router.push("/")
  }
}

/* 🖱️ CLICK O SELECCIÓN */
function seleccionar(producto) {
  search.value = producto.nombre
  emit("buscar", producto.nombre)
  abierto.value = false
  document.activeElement.blur()

  if (router.currentRoute.value.path !== "/") {
    router.push("/")
  }
}

/* ❌ LIMPIAR */
function limpiar() {
  search.value = ""
  emit("buscar", "")
  abierto.value = false
}

/* 👇 CLICK FUERA CIERRA */
function clickFuera(e) {
  if (!searchBox.value?.contains(e.target)) {
    abierto.value = false
  }
}

/* ⬇️ SUBIR / BAJAR EN SUGERENCIAS */
function bajar() {
  if (!sugerencias.value.length) return
  if (seleccion.value < sugerencias.value.length - 1) seleccion.value++
}

function subir() {
  if (!sugerencias.value.length) return
  if (seleccion.value > 0) seleccion.value--
}

onMounted(async () => {
  await cargarUsuario()

  // ✅ Escuchar cambios de sesión (sin refrescar)
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
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 10px 16px;
  background: #f5f6f8;
}

/* LOGO */
.brand {
  display: flex;
  align-items: center;
}

.logo {
  height: 160px;
  width: auto;
  object-fit: contain;
  border-radius: 50%;
  transition: all 0.15s ease;
}

.logo:active {
  transform: scale(1.1);
}

/* BUSCADOR */
.search-box {
  position: relative;
  display: flex;
  justify-content: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 16px;
}

/* ICONO */
.icono {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
}

/* ❌ LIMPIAR */
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
  max-width: 500px;
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

.sugerencia:hover {
  background: #f0f0f0;
}

.sugerencia img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sugerencia.activa {
  background: #e8f5e9;
}

/* ACCIONES */
.acciones {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* PERFIL / LOGIN */
.cuenta-link {
  color: rgb(16, 15, 15);
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.cuenta-link:active {
  transform: scale(0.95);
}

/* CARRITO */
.carrito-indicador {
  background: #28a745;
  color: white;
  padding: 12px 18px;
  border-radius: 999px;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.carrito-indicador:hover {
  background: #218838;
  transform: scale(1.02);
}

.carrito-indicador:active {
  transform: scale(0.95);
}

@media (max-width: 900px) {
  .header {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 12px;
  }

  .search-box {
    grid-column: 1 / -1;
    order: 3;
  }

  .logo {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .logo {
    height: 90px;
  }
}
</style>
