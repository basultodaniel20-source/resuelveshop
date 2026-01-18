<template>
  <div class="app">
    <!-- HEADER ÚNICO -->
  <Header :total="totalItems" @buscar="texto = $event" />
<!-- YA NO HAY NAV AQUÍ -->

    <!-- PÁGINAS -->
    <router-view
      :busqueda="texto"
      :key="$route.fullPath"
      :productos="productos"
      :categorias="categorias"
      :carrito="carrito"
      @agregar="agregarAlCarrito"
      @eliminar="eliminar"
      @whatsapp="finalizarPedido"
    />
    <Footer />   <!-- 👈 AQUÍ -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import Header from "./components/Header.vue"
import { productos as productosData } from "./data/productos.js"
import Footer from "./components/Footer.vue" 
const texto = ref("")
const productos = ref(productosData)
const carrito = ref(
  JSON.parse(localStorage.getItem("carrito")) || []
)

watch(
  carrito,
  (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito))
  },
  { deep: true }
)

const categorias = ["Todos", ...new Set(productos.value.map(p => p.categoria))]

function agregarAlCarrito(producto) {
  const item = carrito.value.find(p => p.id === producto.id)

  if (item) {
    item.cantidad += producto.cantidad
  } else {
    carrito.value.push({
      ...producto,
      cantidad: producto.cantidad || 1
    })
  }
}

function aumentar(i) {
  i.cantidad++
}

function disminuir(i) {
  i.cantidad > 1 ? i.cantidad-- : eliminar(i)
}

function eliminar(i) {
  carrito.value = carrito.value.filter(p => p.id !== i.id)
}

const totalItems = computed(() =>
  carrito.value.reduce((t, i) => t + i.cantidad, 0)
)
function finalizarPedido() {
  if (carrito.value.length === 0) {
    alert("El carrito está vacío")
    return
  }

  const numero = "34643170184"

  let msg = "Hola, quiero hacer este pedido:\n\n"

  carrito.value.forEach(i => {
    msg += `• ${i.nombre} x${i.cantidad} = ${i.precio * i.cantidad} €\n`
  })

  const total = carrito.value.reduce(
    (s, i) => s + i.precio * i.cantidad,
    0
  )

  msg += `\nTotal: ${total} €`

  // ⚠️ MUY IMPORTANTE: encodear el mensaje
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`

  window.open(url, "_blank")

  carrito.value = []
  localStorage.removeItem("carrito")
}
</script>

<style>
.app {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px 12px;
  background: #f5f6f8;
  box-sizing: border-box;
}
</style>
