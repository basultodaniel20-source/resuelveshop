<template>
  <div class="app">
    <!-- HEADER ÚNICO -->
    <Header :total="totalItems" @buscar="texto = $event" />

    <!-- PÁGINAS -->
    <main class="content">
      <router-view
        :busqueda="texto"
        :key="$route.fullPath"
        :productos="productos"
        :categorias="categorias"
        :carrito="carrito"
        @agregar="agregarAlCarrito"
        @eliminar="eliminar"
      />
    </main>

    <!-- FOOTER (solo escritorio) -->
    <Footer class="footer-desktop" />

    <!-- BOTTOM NAV (solo móvil) -->
    <BottomNav :total="totalItems" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import BottomNav from "./components/BottomNav.vue"
import { productos as productosData } from "./data/productos.js"

const texto = ref("")
const productos = ref(productosData)

// ✅ Estado del carrito
const carrito = ref([])

function cargarCarrito() {
  carrito.value = JSON.parse(localStorage.getItem("carrito")) || []
}

// ✅ Cargar al iniciar
cargarCarrito()

// ✅ Escuchar cambios externos (pago / repetir compra / etc.)
onMounted(() => {
  window.addEventListener("carrito-actualizado", cargarCarrito)
})

onBeforeUnmount(() => {
  window.removeEventListener("carrito-actualizado", cargarCarrito)
})

// ✅ Mantener localStorage sincronizado
watch(
  carrito,
  (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito))
  },
  { deep: true }
)

const categorias = ["Todos", ...new Set(productos.value.map((p) => p.categoria))]

function agregarAlCarrito(producto) {
  const item = carrito.value.find((p) => p.id === producto.id)

  if (item) {
    item.cantidad += producto.cantidad
  } else {
    carrito.value.push({
      ...producto,
      cantidad: producto.cantidad || 1,
    })
  }
}

function eliminar(i) {
  carrito.value = carrito.value.filter((p) => p.id !== i.id)
}

const totalItems = computed(() =>
  carrito.value.reduce((t, i) => t + i.cantidad, 0)
)
</script>

<style>
:root{
  --bottom-nav-h: 76px;  /* altura real del menú inferior */
  --header-h: 120px;     /* altura aproximada del header */
}

.app {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 12px calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));
  background: #f5f6f8;
  box-sizing: border-box;
}

.content {
  padding-bottom: 0;
}

</style>
