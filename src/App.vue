<template>
  <div class="app">
    <!-- HEADER SOLO EN TIENDAS -->
    <div v-if="showShell" id="app-header">
      <Header :total="totalItems" @buscar="texto = $event" />
    </div>

    <!-- PÁGINAS -->
    <main class="content" :class="{ noShell: !showShell }">
      <router-view
        :busqueda="texto"
        :key="$route.fullPath"
        :productos="productosActuales"
        :categorias="categoriasActuales"
        :carrito="carritoActual"
        @agregar="agregarAlCarrito"
        @eliminar="eliminar"
      />
    </main>

    <!-- FOOTER SOLO EN TIENDAS -->
    <Footer v-if="showShell" class="footer-desktop" />

    <!-- BOTTOM NAV SOLO EN TIENDAS -->
    <BottomNav v-if="showShell" :total="totalItems" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import BottomNav from "./components/BottomNav.vue"

import { productos as productosInternacionalData } from "./data/productosInternacional.js"
import { productos as productosCubaData } from "./data/productosCuba.js"

const route = useRoute()
const texto = ref("")

/* =========================
   DETECTAR TIENDA ACTUAL
========================= */
const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const showShell = computed(() => {
  return isInternacional.value || isCuba.value
})

/* =========================
   PRODUCTOS Y CATEGORÍAS
========================= */
const productosInternacional = ref(productosInternacionalData || [])
const productosCuba = ref(productosCubaData || [])

const productosActuales = computed(() => {
  if (isInternacional.value) return productosInternacional.value
  if (isCuba.value) return productosCuba.value
  return []
})

const categoriasActuales = computed(() => {
  return ["Todos", ...new Set(productosActuales.value.map((p) => p.categoria).filter(Boolean))]
})

/* =========================
   CARRITOS SEPARADOS
========================= */
const carritoInternacional = ref([])
const carritoCuba = ref([])

function cargarCarritoInternacional() {
  carritoInternacional.value =
    JSON.parse(localStorage.getItem("carrito_internacional")) || []
}

function cargarCarritoCuba() {
  carritoCuba.value =
    JSON.parse(localStorage.getItem("carrito_cuba")) || []
}

const carritoActual = computed(() => {
  if (isInternacional.value) return carritoInternacional.value
  if (isCuba.value) return carritoCuba.value
  return []
})

watch(
  carritoInternacional,
  (nuevo) => {
    localStorage.setItem("carrito_internacional", JSON.stringify(nuevo))
  },
  { deep: true }
)

watch(
  carritoCuba,
  (nuevo) => {
    localStorage.setItem("carrito_cuba", JSON.stringify(nuevo))
  },
  { deep: true }
)

/* =========================
   ACCIONES CARRITO
========================= */
function agregarAlCarrito(producto) {
  if (isInternacional.value) {
    const item = carritoInternacional.value.find((p) => p.id === producto.id)
    if (item) item.cantidad += producto.cantidad || 1
    else carritoInternacional.value.push({ ...producto, cantidad: producto.cantidad || 1 })
    return
  }

  if (isCuba.value) {
    const item = carritoCuba.value.find((p) => p.id === producto.id)
    if (item) item.cantidad += producto.cantidad || 1
    else carritoCuba.value.push({ ...producto, cantidad: producto.cantidad || 1 })
  }
}

function eliminar(i) {
  if (isInternacional.value) {
    carritoInternacional.value = carritoInternacional.value.filter((p) => p.id !== i.id)
    return
  }

  if (isCuba.value) {
    carritoCuba.value = carritoCuba.value.filter((p) => p.id !== i.id)
  }
}

const totalItems = computed(() =>
  carritoActual.value.reduce((t, i) => t + (Number(i.cantidad) || 0), 0)
)

/* =========================
   HEADER HEIGHT AUTO
========================= */
function updateHeaderHeight() {
  const el = document.getElementById("app-header")
  if (!el) {
    document.documentElement.style.setProperty("--header-h", `0px`)
    return
  }

  const h = Math.round(el.getBoundingClientRect().height || 0)
  document.documentElement.style.setProperty("--header-h", `${h}px`)
}

let ro = null

function recargarCarritos() {
  cargarCarritoInternacional()
  cargarCarritoCuba()
}

onMounted(() => {
  recargarCarritos()
  window.addEventListener("carrito-actualizado", recargarCarritos)

  updateHeaderHeight()
  requestAnimationFrame(updateHeaderHeight)
  setTimeout(updateHeaderHeight, 200)
  window.addEventListener("resize", updateHeaderHeight, { passive: true })

  const el = document.getElementById("app-header")
  if (el && window.ResizeObserver) {
    ro = new ResizeObserver(() => updateHeaderHeight())
    ro.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("carrito-actualizado", recargarCarritos)
  window.removeEventListener("resize", updateHeaderHeight)
  if (ro) ro.disconnect()
})

watch(
  () => route.fullPath,
  () => {
    texto.value = ""
    recargarCarritos()
    requestAnimationFrame(updateHeaderHeight)
  }
)
</script>

<style>
:root{
  --header-h: 120px;
  --bottom-nav-h: 76px;
}

html, body, #app{
  margin: 0;
  padding: 0;
  background: #f5f6f8;
}

.app{
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 12px;
  background: #f5f6f8;
  box-sizing: border-box;
}

.content{
  padding-bottom: calc(var(--bottom-nav-h, 76px) + env(safe-area-inset-bottom));
}

.content.noShell{
  padding-bottom: 0;
}
</style>