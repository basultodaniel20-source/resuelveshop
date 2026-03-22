<template>
  <article class="producto">
    <!-- ZONA CLICABLE → VA AL DETALLE -->
    <router-link :to="detallePath" class="link">
      <div class="img-box">
        <img
          :src="producto.imagen"
          :alt="producto.nombre"
        />
      </div>

      <h3>{{ producto.nombre }}</h3>
    </router-link>

    <p class="precio">{{ producto.precio }} €</p>

    <!-- SELECTOR DE CANTIDAD -->
    <div class="cantidad-selector">
      <button @click="menos">-</button>
      <span>{{ cantidad }}</span>
      <button @click="mas">+</button>
    </div>

    <!-- BOTÓN AGREGAR -->
    <button class="btn" @click="agregar($event)">
      Agregar 🛒
    </button>
  </article>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
  producto: Object
})

const emit = defineEmits(["agregar"])
const route = useRoute()

const cantidad = ref(1)

const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const detallePath = computed(() => {
  if (isInternacional.value) return `/internacional/producto/${props.producto.id}`
  if (isCuba.value) return `/cuba/producto/${props.producto.id}`
  return `/producto/${props.producto.id}`
})

function mas() {
  cantidad.value++
}

function menos() {
  if (cantidad.value > 1) cantidad.value--
}

function agregar(e) {
  animarAlCarrito(e.currentTarget)

  emit("agregar", {
    ...props.producto,
    cantidad: cantidad.value
  })

  cantidad.value = 1
}

/* ✨ PARTÍCULA QUE VUELA AL CARRITO */
function animarAlCarrito(origenElemento) {
  const carrito = document.querySelector(".carrito-indicador")
  if (!carrito || !origenElemento) return

  const origenRect = origenElemento.getBoundingClientRect()
  const cartRect = carrito.getBoundingClientRect()

  const bola = document.createElement("div")
  bola.className = "particula-carrito"

  const startX = origenRect.left + origenRect.width / 2
  const startY = origenRect.top + origenRect.height / 2

  const endX = cartRect.left + cartRect.width / 2
  const endY = cartRect.top + cartRect.height / 2

  bola.style.left = startX + "px"
  bola.style.top = startY + "px"

  document.body.appendChild(bola)

  bola.getBoundingClientRect()

  bola.style.left = endX + "px"
  bola.style.top = endY + "px"
  bola.style.transform = "scale(0.3)"
  bola.style.opacity = "0.3"

  setTimeout(() => {
    bola.remove()

    carrito.classList.remove("bounce")
    void carrito.offsetWidth
    carrito.classList.add("bounce")
  }, 700)
}
</script>

<style>
.producto {
  background: white;
  border-radius: 12px;
  padding: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* LINK DEL PRODUCTO */
.link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* IMAGEN */
.img-box {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.img-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* NOMBRE */
.producto h3 {
  font-size: 15px;
  margin: 6px 0 4px;
}

/* PRECIO */
.precio {
  color: #079428;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

/* SELECTOR */
.cantidad-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.cantidad-selector button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #e0e0e0;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cantidad-selector button:hover {
  background: #cfcfcf;
  transform: scale(1.1);
}

.cantidad-selector button:active {
  background: #cfcfcf;
  transform: scale(0.95);
}

/* BOTÓN */
.btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;
}

.btn:hover {
  background: #218838;
  transform: scale(1.02);
}

.btn:active {
  transform: scale(0.95);
}

/* 🔵 PARTÍCULA */
.particula-carrito {
  position: fixed;
  width: 14px;
  height: 14px;
  background: #28a745;
  border-radius: 50%;
  z-index: 99999;
  pointer-events: none;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 🛒 BOUNCE DEL CARRITO */
.carrito-indicador.bounce {
  animation: bounceCart 0.4s ease;
}

@keyframes bounceCart {
  0% { transform: scale(1); }
  30% { transform: scale(1.25); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
</style>