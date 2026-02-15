<template>
  <div class="categorias">
    <router-link
      v-for="cat in categorias"
      :key="cat"
      :to="cat === 'Todos' ? '/catalogo' : `/catalogo/${cat}`"
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

// obtener la ruta actual
const route = useRoute()

// categoría actual desde la ruta
const categoriaActual = computed(() => {
  return route.params.categoria || "Todos"
})
</script>

<style scoped>
/* CONTENEDOR DE CATEGORÍAS */
.categorias {
  display: flex;
  gap: 12px;
  margin: 24px 0;
  flex-wrap: wrap;
  transition: all 0.15s ease;
}

/* efecto presionado */
.categorias .btn:active {
  transform: scale(0.95);
}

/* BOTONES DE CATEGORÍAS */
.btn {
  padding: 8px 16px;
  border-radius: 18px;
  text-decoration: none;
  background: #e4e6ea;
  color: #333;
  font-weight: 600;
}

/* categoría activa */
.btn.activa {
  background: #28a745;
  color: white;
}
</style>
