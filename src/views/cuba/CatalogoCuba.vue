<template>
  <div class="catalogo">
    <!-- HEADER -->
    <div class="catalogo-head">
      <h1>Tienda Cuba 🇨🇺</h1>
      <p>Productos disponibles dentro de Cuba</p>
    </div>

    <!-- CATEGORÍAS -->
    <Categorias :categorias="categorias" />

    <!-- PRODUCTOS -->
    <section class="productos">
      <ProductoCard
        v-for="p in productosFiltrados"
        :key="p.id"
        :producto="p"
        @agregar="$emit('agregar', $event)"
      />
    </section>

    <p v-if="productosFiltrados.length === 0" class="sin">
      No hay productos disponibles
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../../components/Categorias.vue"
import ProductoCard from "../../components/ProductoCard.vue"
import { productos } from "../../data/productosCuba.js"

defineEmits(["agregar"])

const route = useRoute()

const categoria = computed(() => route.params.categoria || "Todos")

const categorias = [
  "Todos",
  ...new Set(productos.map((p) => p.categoria))
]

const productosFiltrados = computed(() => {
  return productos.filter((p) => {
    return categoria.value === "Todos" || p.categoria === categoria.value
  })
})
</script>

<style scoped>
.catalogo{
  padding: 10px 4px 24px;
}

.catalogo-head h1{
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
}

.catalogo-head p{
  margin-top: 6px;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
}

/* PRODUCTOS */
.productos{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.sin{
  margin-top: 20px;
  font-weight: 1000;
  color: #6b7280;
  text-align: center;
}
</style>