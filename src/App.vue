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

const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const showShell = computed(() => isInternacional.value || isCuba.value)

/* ================= PRODUCTOS ================= */

const productosInternacional = ref(productosInternacionalData || [])
const productosCuba = ref(productosCubaData || [])

const productosActuales = computed(() => {
  if (isInternacional.value) return productosInternacional.value
  if (isCuba.value) return productosCuba.value
  return []
})

const categoriasActuales = computed(() => {
  return ["Todos", ...new Set(productosActuales.value.map(p => p.categoria).filter(Boolean))]
})

/* ================= CARRITOS ================= */

const carritoInternacional = ref([])
const carritoCuba = ref([])

function cargarCarritos() {
  carritoInternacional.value = JSON.parse(localStorage.getItem("carrito_internacional")) || []
  carritoCuba.value = JSON.parse(localStorage.getItem("carrito_cuba")) || []
}

const carritoActual = computed(() => {
  if (isInternacional.value) return carritoInternacional.value
  if (isCuba.value) return carritoCuba.value
  return []
})

watch(carritoInternacional, v => {
  localStorage.setItem("carrito_internacional", JSON.stringify(v))
}, { deep: true })

watch(carritoCuba, v => {
  localStorage.setItem("carrito_cuba", JSON.stringify(v))
}, { deep: true })

function agregarAlCarrito(producto) {
  if (isInternacional.value) {
    const item = carritoInternacional.value.find(p => p.id === producto.id)
    if (item) item.cantidad += producto.cantidad || 1
    else carritoInternacional.value.push({ ...producto, cantidad: producto.cantidad || 1 })
    return
  }

  if (isCuba.value) {
    const provincia = localStorage.getItem("provincia_cuba")
    const municipio = localStorage.getItem("municipio_cuba")

    if (!provincia || !municipio) {
      alert("Selecciona provincia y municipio primero")
      window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
      return
    }

    if (!producto.provincia?.includes(provincia)) {
      alert(`No disponible en ${provincia}`)
      return
    }

    const item = carritoCuba.value.find(p => p.id === producto.id)
    if (item) item.cantidad += producto.cantidad || 1
    else carritoCuba.value.push({ ...producto, cantidad: producto.cantidad || 1 })

    window.dispatchEvent(new CustomEvent("carrito-actualizado"))
  }
}

function eliminar(i) {
  if (isInternacional.value) {
    carritoInternacional.value = carritoInternacional.value.filter(p => p.id !== i.id)
  }

  if (isCuba.value) {
    carritoCuba.value = carritoCuba.value.filter(p => p.id !== i.id)
  }
}

const totalItems = computed(() =>
  carritoActual.value.reduce((t, i) => t + (Number(i.cantidad) || 0), 0)
)

/* ================= PROVINCIA + MUNICIPIO ================= */

const provinciaCuba = ref(localStorage.getItem("provincia_cuba") || "")
const municipioCuba = ref(localStorage.getItem("municipio_cuba") || "")

const showProvinceModal = computed(() => {
  return isCuba.value && (!provinciaCuba.value || !municipioCuba.value)
})

function setProvinciaCuba(payload) {
  const oldProv = localStorage.getItem("provincia_cuba")
  const oldMun = localStorage.getItem("municipio_cuba")

  provinciaCuba.value = payload.provincia
  municipioCuba.value = payload.municipio

  localStorage.setItem("provincia_cuba", payload.provincia)
  localStorage.setItem("municipio_cuba", payload.municipio)

  if (oldProv !== payload.provincia || oldMun !== payload.municipio) {
    localStorage.removeItem("carrito_cuba")
    carritoCuba.value = []
  }

  window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
  window.dispatchEvent(new CustomEvent("carrito-actualizado"))
}

function refrescarUbicacion() {
  provinciaCuba.value = localStorage.getItem("provincia_cuba") || ""
  municipioCuba.value = localStorage.getItem("municipio_cuba") || ""
}

/* ================= LIFECYCLE ================= */

onMounted(() => {
  cargarCarritos()

  window.addEventListener("carrito-actualizado", cargarCarritos)
  window.addEventListener("provincia-cuba-actualizada", refrescarUbicacion)
})

onBeforeUnmount(() => {
  window.removeEventListener("carrito-actualizado", cargarCarritos)
  window.removeEventListener("provincia-cuba-actualizada", refrescarUbicacion)
})

watch(() => route.fullPath, () => {
  texto.value = ""
  cargarCarritos()
  refrescarUbicacion()
})
</script>

<template>
  <div class="app">
    <Header
      v-if="showShell"
      :total="totalItems"
      :provincia="provinciaCuba"
      :municipio="municipioCuba"
      @buscar="texto = $event"
    />

    <main class="content">
      <router-view
        :busqueda="texto"
        :productos="productosActuales"
        :categorias="categoriasActuales"
        :carrito="carritoActual"
        @agregar="agregarAlCarrito"
        @eliminar="eliminar"
      />
    </main>

    <Footer v-if="showShell" />
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