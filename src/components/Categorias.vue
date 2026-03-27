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
  categorias: {
    type: Array,
    default: () => [],
  },
})

const route = useRoute()

const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))

const basePath = computed(() => {
  if (isInternacional.value) return "/internacional/catalogo"
  if (isCuba.value) return "/cuba/catalogo"
  return "/catalogo"
})

function getPath(cat) {
  if (cat === "Todos") return basePath.value
  return `${basePath.value}/${encodeURIComponent(cat)}`
}

const categoriaActual = computed(() => {
  return route.params.categoria || "Todos"
})
</script>

<style scoped>
.categorias {
  display: flex;
  gap: 12px;
  margin: 24px 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  scroll-behavior: smooth;
  padding: 4px 2px 8px;
}

.categorias::-webkit-scrollbar {
  display: none;
}

.categorias .btn:active {
  transform: scale(0.95);
}

.btn {
  flex: 0 0 auto;
  padding: 10px 18px;
  border-radius: 999px;
  text-decoration: none;
  background: #e4e6ea;
  color: #333;
  font-weight: 600;
  transition: all 0.15s ease;
}

.btn.activa {
  background: #28a745;
  color: white;
}

@media (max-width: 768px) {
  .categorias {
    gap: 10px;
    margin: 18px 0;
  }

  .btn {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
}
</style>