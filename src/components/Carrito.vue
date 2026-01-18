<template>
  <div class="carrito">
    <h2>Carrito</h2>
  <!-- VACÍO -->
    <p v-if="!items || items.length === 0">
      El carrito está vacío
    </p>

    <!-- CON PRODUCTOS -->
    <transition-group name="fade" tag="div" v-else>
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
      >
        <!-- IMAGEN (CLICK = IR AL PRODUCTO) -->
        <router-link :to="`/producto/${item.id}`" class="thumb">
          <img :src="item.imagen" :alt="item.nombre" />
        </router-link>

        <!-- INFO -->
        <div class="info">
          <strong>{{ item.nombre }}</strong>
          <div class="detalle">
            {{ item.precio }} CUP x {{ item.cantidad }} =
            <b>{{ item.precio * item.cantidad }} €</b>
          </div>
        </div>

        <!-- ACCIONES -->
        <div class="acciones">
        <button @click.stop="menos(item)">−</button>
        <span class="cantidad">{{ item.cantidad }}</span>
        <button @click.stop="mas(item)">+</button>

          <button class="eliminar" @click="$emit('eliminar', item)">✕</button>
        </div>
      </div>
    </transition-group>

    <div v-if="items.length" class="total">
      <strong>Total: {{ total }} €</strong>
    </div>
    <button
  v-if="items.length > 0"
  class="whatsapp-flotante"
  @click="$emit('whatsapp')"
>
  🟢 Finalizar pedido por WhatsApp
</button>
</div>
</template>

<script setup>
import { computed } from "vue"
function mas(item) {
  item.cantidad++
}

function menos(item) {
  if (item.cantidad > 1) {
    item.cantidad--
  }
}


const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const total = computed(() => {
  return props.items.reduce((suma, item) => {
    const cantidad = Number(item.cantidad) || 0
    const precio = Number(item.precio) || 0
    return suma + precio * cantidad
  }, 0)
})
</script>

<style scoped>
.carrito {
  background: white;
  padding: 20px;
  border-radius: 16px;
}

/* RESUMEN */

/* ITEM */
.item {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 16px;
  align-items: center;

  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

/* IMAGEN */
.thumb {
  width: 90px;
  height: 90px;
  background: #fafafa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* INFO */
.info {
  display: flex;
  flex-direction: column;
}

.detalle {
  font-size: 14px;
  color: #555;
}

/* ACCIONES */
.acciones {
  display: flex;
  align-items: center;
  gap: 8px;
}

.acciones button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.15s ease;
}
/* efecto hover */
.acciones button:hover {
  background: #cfcfcf;
  transform: scale(1.1);
}
/* efecto presionado */
.acciones button:active {
  transform: scale(1.1);
}

.eliminar {
  background: #dc3545 !important;
  color: white;
  border: none !important;
}

.cantidad {
  min-width: 20px;
  text-align: center;
  font-weight: bold;
}

/* TOTAL */
.total {
  margin: 20px 0;
  font-size: 18px;
}

/* BOTÓN WHATSAPP */
.whatsapp-flotante {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  background: #28a745;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.15s ease;
}
/* efecto hover */
.whatsapp-flotante:hover {
  background: #218838;
  transform: scale(1.01);
}
/* efecto presionado */ 
.whatsapp-flotante:active {
  transform: scale(0.95);
}

/* ANIMACIÓN */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
