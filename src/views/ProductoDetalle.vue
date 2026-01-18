<template>
  <div v-if="producto" class="detalle">

    <!-- IZQUIERDA: GALERÍA -->
    <div class="galeria">
      <button class="flecha" @click="anterior">‹</button>

      <img
        :src="imagenes[imagenActual]"
        class="imagen-principal"
        ref="imgProducto"
      />

      <button class="flecha" @click="siguiente">›</button>
    </div>

    <!-- DERECHA: INFO -->
    <div class="info">
      <h1>{{ producto.nombre }}</h1>

      <p class="precio">{{ producto.precio }} €</p>

      <!-- SELECTOR -->
      <div class="cantidad">
        <button @click="menos">-</button>
        <span>{{ cantidad }}</span>
        <button @click="mas">+</button>
      </div>

      <!-- BOTÓN -->
      <button class="btn" @click="agregar($event)">
        Agregar 🛒
      </button>

      <!-- DESCRIPCIÓN -->
    <div class="descripcion">

  <!-- DESCRIPCIÓN CORTA -->
  <p class="descripcion-corta">
    {{ producto.descripcionCorta }}
  </p>

  <!-- DESCRIPCIÓN COMPLETA -->
  <p class="descripcion-larga">
    {{ producto.descripcion }}
  </p>

  <!-- INCLUYE -->
  <div v-if="producto.incluye && producto.incluye.length" class="incluye">
    <h3>📦 Este combo incluye:</h3>
    <ul>
      <li v-for="(item, i) in producto.incluye" :key="i">
        ✅ {{ item }}
      </li>
    </ul>
  </div>

  <!-- ENTREGA -->
  <div class="entrega" v-if="producto.entrega || producto.tiempoEntrega">
    <p><b>🚚 Entrega:</b> {{ producto.entrega }}</p>
    <p><b>⏱ Tiempo de entrega:</b> {{ producto.tiempoEntrega }}</p>
  </div>

  <!-- NOTA -->
  <div class="nota" v-if="producto.nota">
    ⚠️ {{ producto.nota }}
  </div>

</div>

</div>
    </div>


  <p v-else>Cargando producto...</p>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { productos } from "../data/productos.js"

const emit = defineEmits(["agregar"])

const route = useRoute()
const id = Number(route.params.id)

const producto = productos.find(p => p.id === id)

const imagenes = computed(() => {
  if (producto.imagenes) return producto.imagenes
  return [producto.imagen]
})

const imagenActual = ref(0)
const cantidad = ref(1)
const imgProducto = ref(null)

function siguiente() {
  imagenActual.value = (imagenActual.value + 1) % imagenes.value.length
}

function anterior() {
  imagenActual.value =
    (imagenActual.value - 1 + imagenes.value.length) % imagenes.value.length
}

function mas() {
  cantidad.value++
}

function menos() {
  if (cantidad.value > 1) cantidad.value--
}

function agregar(e) {
  // 1️⃣ Primero agrega al carrito (LO IMPORTANTE)
  emit("agregar", {
    ...producto,
    cantidad: cantidad.value
  })

  // 2️⃣ Luego ejecuta la animación (solo visual)
  try {
    animarAlCarrito(e?.currentTarget || null)
  } catch (err) {
    console.warn("Animación falló, pero el producto ya fue agregado", err)
  }
}

/* ✨ ANIMACIÓN TIPO TEMU / AMAZON */
function animarAlCarrito(origenElemento) {
  const carrito = document.querySelector(".carrito-indicador")
  if (!carrito || !origenElemento) return

  const origenRect = origenElemento.getBoundingClientRect()
  const cartRect = carrito.getBoundingClientRect()

  // Crear partícula
  const bola = document.createElement("div")
  bola.className = "particula-carrito"

  bola.style.left = origenRect.left + origenRect.width / 2 + "px"
  bola.style.top = origenRect.top + origenRect.height / 2 + "px"

  document.body.appendChild(bola)

  // Forzar render
  bola.getBoundingClientRect()

  // Mover hacia carrito
  bola.style.transform = `translate(
    ${cartRect.left - origenRect.left}px,
    ${cartRect.top - origenRect.top}px
  ) scale(0.3)`

  bola.style.opacity = "0.3"

  // Al terminar animación
  setTimeout(() => {
    bola.remove()

    // Bounce del carrito
    carrito.classList.remove("bounce")
    void carrito.offsetWidth
    carrito.classList.add("bounce")
  }, 700)
}

</script>

<style scoped>
/* DETALLE DEL PRODUCTO */
.detalle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  background: white;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

/* GALERÍA */
.galeria {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #fafafa;
  border-radius: 16px;
  padding: 20px;

  /* 🔥 CLAVE: que no crezca infinito */
  max-height: 520px;
}
/* IMAGEN PRINCIPAL */
.imagen-principal {
  width: 100%;
  max-width: 480px;
  max-height: 480px;
  object-fit: contain;
}

/* FLECHAS */
.flecha {
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;
}

/* INFO */
.info h1 {
  margin-bottom: 12px;
}

.precio {
  color: #28a745;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* CANTIDAD */
.cantidad {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.cantidad button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #e0e0e0;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cantidad button:hover {
  background: #cfcfcf;
  transform: scale(1.1);
}

.cantidad button:active {
  transform: scale(0.95);
}

/* BOTÓN */
.btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.15s ease;
}

.btn:hover {
  background: #218838;
  transform: scale(1.01);
}

.btn:active {
  transform: scale(0.95);
}
/* RESPONSIVE */
@media (max-width: 900px) {
  .detalle {
    grid-template-columns: 1fr;
  }
}
/* 🔵 PARTÍCULA QUE VUELA AL CARRITO */
.particula-carrito {
  position: fixed;
  width: 16px;
  height: 16px;
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
.descripcion {
  margin-top: 20px;
}

.descripcion-corta {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.descripcion-larga {
  color: #444;
  margin-bottom: 16px;
}

.incluye {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 16px;
}

.incluye ul {
  margin: 0;
  padding-left: 18px;
}

.incluye li {
  margin-bottom: 6px;
}

.entrega {
  background: #eef7f1;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.nota {
  background: #fff3cd;
  padding: 12px;
  border-radius: 10px;
  color: #856404;
  font-size: 14px;
}

</style>
