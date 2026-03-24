<template>
  <div class="app" :class="{ shellApp: showShell, fullApp: !showShell }">
    <div v-if="showShell" id="app-header">
      <Header :total="totalItems" @buscar="texto = $event" />
    </div>

    <main
      class="content"
      :class="{
        noShell: !showShell,
        fullContent: !showShell
      }"
    >
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

    <Footer v-if="showShell" class="footer-desktop" />
    <BottomNav v-if="showShell" :total="totalItems" />

    <ProvinceSelectorModal
      v-if="isCuba"
      :open="showProvinceModal"
      :provincia="provinciaCuba"
      :municipio="municipioCuba"
      :provincias="provinciasCuba"
      @confirm="setProvinciaCuba"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"

import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import BottomNav from "./components/BottomNav.vue"
import ProvinceSelectorModal from "./components/ProvinceSelectorModal.vue"

import { productos as productosInternacionalData } from "./data/productosInternacional.js"
import { productos as productosCubaData } from "./data/productosCuba.js"
import { provinciasCuba } from "./data/provinciasCuba.js"

const route = useRoute()
const texto = ref("")

/* =========================
   DETECTAR TIENDA ACTUAL
========================= */
const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const showShell = computed(() => isInternacional.value || isCuba.value)

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
  return [
    "Todos",
    ...new Set(productosActuales.value.map((p) => p.categoria).filter(Boolean)),
  ]
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
   AGREGAR / ELIMINAR
========================= */
function agregarAlCarrito(producto) {
  if (isInternacional.value) {
    const item = carritoInternacional.value.find((p) => p.id === producto.id)

    if (item) {
      item.cantidad += Number(producto.cantidad || 1)
    } else {
      carritoInternacional.value.push({
        ...producto,
        cantidad: Number(producto.cantidad || 1),
      })
    }

    return
  }

  if (isCuba.value) {
    const provincia = localStorage.getItem("provincia_cuba") || ""
    const municipio = localStorage.getItem("municipio_cuba") || ""

    if (!provincia || !municipio) {
      alert("Debes seleccionar provincia y municipio antes de agregar productos.")
      window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
      return
    }

    const validaProvincia =
      !Array.isArray(producto.provincias) || producto.provincias.includes(provincia)

    const validaMunicipio =
      !Array.isArray(producto.municipios) || producto.municipios.includes(municipio)

    if (!validaProvincia) {
      alert(`Este producto no está disponible en ${provincia}.`)
      return
    }

    if (!validaMunicipio) {
      alert(`Este producto no está disponible en ${municipio}.`)
      return
    }

    const item = carritoCuba.value.find((p) => p.id === producto.id)

    if (item) {
      item.cantidad += Number(producto.cantidad || 1)
    } else {
      carritoCuba.value.push({
        ...producto,
        cantidad: Number(producto.cantidad || 1),
      })
    }

    return
  }
}

function eliminar(i) {
  if (isInternacional.value) {
    carritoInternacional.value = carritoInternacional.value.filter((p) => p.id !== i.id)
    return
  }

  if (isCuba.value) {
    carritoCuba.value = carritoCuba.value.filter((p) => p.id !== i.id)
    return
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

/* =========================
   PROVINCIA + MUNICIPIO CUBA
========================= */
const provinciaCuba = ref(localStorage.getItem("provincia_cuba") || "")
const municipioCuba = ref(localStorage.getItem("municipio_cuba") || "")

const showProvinceModal = computed(() => {
  return isCuba.value && (!provinciaCuba.value || !municipioCuba.value)
})

function setProvinciaCuba(payload) {
  const provinciaAnterior = localStorage.getItem("provincia_cuba") || ""
  const municipioAnterior = localStorage.getItem("municipio_cuba") || ""

  provinciaCuba.value = payload.provincia
  municipioCuba.value = payload.municipio

  localStorage.setItem("provincia_cuba", payload.provincia)
  localStorage.setItem("municipio_cuba", payload.municipio)

  if (
    (provinciaAnterior && provinciaAnterior !== payload.provincia) ||
    (municipioAnterior && municipioAnterior !== payload.municipio)
  ) {
    localStorage.removeItem("carrito_cuba")
    carritoCuba.value = []
  }

  window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
  window.dispatchEvent(new CustomEvent("carrito-actualizado"))
}

function refrescarProvinciaCuba() {
  provinciaCuba.value = localStorage.getItem("provincia_cuba") || ""
  municipioCuba.value = localStorage.getItem("municipio_cuba") || ""
}

/* =========================
   CICLO DE VIDA
========================= */
onMounted(() => {
  recargarCarritos()
  refrescarProvinciaCuba()

  window.addEventListener("carrito-actualizado", recargarCarritos)
  window.addEventListener("provincia-cuba-actualizada", refrescarProvinciaCuba)

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
  window.removeEventListener("provincia-cuba-actualizada", refrescarProvinciaCuba)
  window.removeEventListener("resize", updateHeaderHeight)
  if (ro) ro.disconnect()
})

watch(
  () => route.fullPath,
  () => {
    texto.value = ""
    recargarCarritos()
    refrescarProvinciaCuba()
    requestAnimationFrame(updateHeaderHeight)
  }
)
</script>

<style>
:root{
  --header-h: 120px;
  --bottom-nav-h: 76px;
}

html,
body,
#app{
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background: #f5f6f8;
}

body{
  overflow-x: hidden;
}

.app{
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  box-sizing: border-box;
  background: #f5f6f8;
}

/* MODO TIENDA */
.app.shellApp{
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 12px;
}

/* MODO PANTALLA COMPLETA */
.app.fullApp{
  max-width: none;
  margin: 0;
  padding: 0;
}

.content{
  min-width: 0;
  padding-bottom: calc(var(--bottom-nav-h, 76px) + env(safe-area-inset-bottom));
}

.content.noShell{
  padding-bottom: 0;
}

.content.fullContent{
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
}
</style>