<template>
  <section class="carrito-page">
    <div class="head">
      <h1>Tu carrito</h1>
      <p v-if="!carrito.length">Aún no has añadido productos.</p>
    </div>

    <div v-if="carrito.length" class="lista">
      <article v-for="item in carrito" :key="item.id" class="item">
        <div class="img-box">
          <img :src="item.imagen" :alt="item.nombre" />
        </div>

        <div class="info">
          <h3>{{ item.nombre }}</h3>
          <p class="precio">{{ item.precio }} €</p>

          <div class="acciones">
            <button @click="menos(item)">-</button>
            <span>{{ item.cantidad }}</span>
            <button @click="mas(item)">+</button>
          </div>
        </div>

        <button class="eliminar" @click="eliminar(item)">Eliminar</button>
      </article>

      <div class="resumen">
        <div class="fila">
          <span>Total</span>
          <strong>{{ total }} €</strong>
        </div>

        <router-link class="btn" to="/internacional/checkout">
          Ir al checkout
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  carrito: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["agregar", "eliminar"])

function mas(item) {
  emit("agregar", { ...item, cantidad: 1 })
}

function menos(item) {
  if ((item.cantidad || 1) <= 1) {
    emit("eliminar", item)
    return
  }

  const actualizado = { ...item, cantidad: item.cantidad - 1 }
  emit("eliminar", item)
  emit("agregar", actualizado)
}

function eliminar(item) {
  emit("eliminar", item)
}

const total = computed(() =>
  props.carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  )
)
</script>

<style scoped>
.carrito-page{
  padding: 12px 4px 24px;
}

.head h1{
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
}

.head p{
  margin-top: 8px;
  color: #6b7280;
  font-weight: 900;
}

.lista{
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.item{
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 12px;
  align-items: center;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.img-box{
  width: 90px;
  height: 90px;
  display: grid;
  place-items: center;
}

.img-box img{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info h3{
  margin: 0;
  font-size: 16px;
  font-weight: 1000;
}

.precio{
  margin-top: 6px;
  color: #16a34a;
  font-weight: 1000;
}

.acciones{
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.acciones button{
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #e5e7eb;
  cursor: pointer;
  font-size: 18px;
}

.eliminar{
  border: none;
  background: #fff1f2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 1000;
  cursor: pointer;
}

.resumen{
  margin-top: 8px;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.fila{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.btn{
  display: inline-flex;
  justify-content: center;
  width: 100%;
  text-decoration: none;
  background: #28a745;
  color: white;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 1000;
}

@media (max-width: 900px){
  .item{
    grid-template-columns: 1fr;
    text-align: center;
  }

  .img-box{
    margin: 0 auto;
  }

  .acciones{
    justify-content: center;
  }
}
</style>