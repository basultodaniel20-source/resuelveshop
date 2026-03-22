<template>
  <div class="categorias">
    <router-link
      v-for="cat in categorias"
      :key="cat"
      :to="getPath(cat)"
      class="btn"
      :class="{ activa: cat === categoriaActual }"
    >
      {{ cat }}
    </router-link>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

defineProps({
  categorias: Array,
})

const route = useRoute()

/* 🔥 detectar tienda */
const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const basePath = computed(() => {
  if (isInternacional.value) return "/internacional/catalogo"
  if (isCuba.value) return "/cuba/catalogo"
  return "/catalogo"
})

/* 🔥 construir ruta correcta */
function getPath(cat) {
  if (cat === "Todos") return basePath.value
  return `${basePath.value}/${cat}`
}

/* categoría activa */
const categoriaActual = computed(() => {
  return route.params.categoria || "Todos"
})
</script>

<style scoped>
.categorias {
  display: flex;
  gap: 12px;
  margin: 24px 0;
  flex-wrap: wrap;
  transition: all 0.15s ease;
}

.categorias .btn:active {
  transform: scale(0.95);
}

.btn {
  padding: 8px 16px;
  border-radius: 18px;
  text-decoration: none;
  background: #e4e6ea;
  color: #333;
  font-weight: 600;
}

.btn.activa {
  background: #28a745;
  color: white;
}
</style>