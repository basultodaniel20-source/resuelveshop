<template>
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
    No se encontraron productos
  </p>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../components/Categorias.vue"
import ProductoCard from "../components/ProductoCard.vue"

const emit = defineEmits(["agregar"])

const props = defineProps({
  productos: Array,
  categorias: Array,
  busqueda: String
})
const route = useRoute()
const categoria = computed(() => route.params.categoria || "Todos")

const productosFiltrados = computed(() => {
  return props.productos.filter(p => {
    const pasaCategoria =
      categoria.value === "Todos" || p.categoria === categoria.value
      const pasaTexto =
  p.nombre.toLowerCase().includes((props.busqueda || "").toLowerCase())
    return pasaCategoria && pasaTexto
  })
})
</script>

<style scoped>
.productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}


.sin {
  margin-top: 20px;
  font-weight: bold;
  color: #777;
}
</style>
