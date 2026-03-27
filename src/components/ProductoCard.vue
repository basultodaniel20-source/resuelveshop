<template>
  <article class="producto">
    <router-link :to="detallePath" class="link">
      <div class="img-box">
        <img
          :src="producto.imagen"
          :alt="producto.nombre"
          loading="lazy"
        />
      </div>

      <h3 class="titulo">{{ producto.nombre }}</h3>
    </router-link>

    <p class="precio">{{ producto.precio }} €</p>

    <div class="cantidad-selector">
      <button type="button" class="cantidad-btn" @click="menos">-</button>
      <span class="cantidad">{{ cantidad }}</span>
      <button type="button" class="cantidad-btn" @click="mas">+</button>
    </div>

    <button type="button" class="btn-agregar" @click="agregar($event)">
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

<style scoped>
.producto {
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-width: 0;
}

.link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.img-box {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.titulo {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  margin: 6px 0 4px;
  min-height: 38px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.precio {
  color: #079428;
  font-weight: 800;
  font-size: 18px;
  margin: 8px 0;
}

.cantidad-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cantidad {
  min-width: 18px;
  font-weight: 700;
  font-size: 15px;
}

.cantidad-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #e8e8e8;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cantidad-btn:hover {
  background: #dcdcdc;
  transform: scale(1.08);
}

.cantidad-btn:active {
  transform: scale(0.95);
}

.btn-agregar {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.15s ease;
}

.btn-agregar:hover {
  background: #218838;
  transform: scale(1.02);
}

.btn-agregar:active {
  transform: scale(0.97);
}

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

.carrito-indicador.bounce {
  animation: bounceCart 0.4s ease;
}

@keyframes bounceCart {
  0% { transform: scale(1); }
  30% { transform: scale(1.25); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .producto {
    padding: 10px;
    border-radius: 14px;
  }

  .img-box {
    height: 100px;
    margin-bottom: 6px;
  }

  .titulo {
    font-size: 14px;
    min-height: 34px;
  }

  .precio {
    font-size: 17px;
    margin: 6px 0;
  }

  .cantidad-selector {
    gap: 8px;
    margin-bottom: 8px;
  }

  .cantidad-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .cantidad {
    font-size: 14px;
  }

  .btn-agregar {
    padding: 9px 10px;
    font-size: 13px;
    border-radius: 9px;
  }
}

@media (max-width: 420px) {
  .producto {
    padding: 9px;
  }

  .img-box {
    height: 88px;
  }

  .titulo {
    font-size: 13px;
    line-height: 1.2;
    min-height: 32px;
  }

  .precio {
    font-size: 16px;
  }

  .btn-agregar {
    padding: 8px;
    font-size: 12.5px;
  }
}
</style>