<template>
  <div class="catalogo">
    <div class="catalogo-head">
      <div>
        <h1>Tienda Cuba 🇨🇺</h1>
        <p>
          {{ provinciaSeleccionada
            ? `Productos disponibles en ${provinciaSeleccionada}`
            : "Selecciona una provincia para ver disponibilidad" }}
        </p>
      </div>

      <button class="provBtn" @click="cambiarProvincia">
        📍 {{ provinciaSeleccionada || "Elegir provincia" }}
      </button>
    </div>

    <Categorias :categorias="categoriasDisponibles" />

    <section class="productos">
      <ProductoCard
        v-for="p in productosFiltrados"
        :key="p.id"
        :producto="p"
        @agregar="$emit('agregar', $event)"
      />
    </section>

    <p v-if="!provinciaSeleccionada" class="sin">
      Primero selecciona una provincia para ver los productos disponibles.
    </p>

    <p v-else-if="productosFiltrados.length === 0" class="sin">
      No hay productos disponibles para esta provincia en esta categoría.
    </p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../../components/Categorias.vue"
import ProductoCard from "../../components/ProductoCard.vue"
import { productos } from "../../data/productosCuba.js"

defineEmits(["agregar"])

const route = useRoute()
const categoria = computed(() => route.params.categoria || "Todos")
const provinciaSeleccionada = ref(localStorage.getItem("provincia_cuba") || "")

function refrescarProvincia() {
  provinciaSeleccionada.value = localStorage.getItem("provincia_cuba") || ""
}

function cambiarProvincia() {
  localStorage.removeItem("provincia_cuba")
  refrescarProvincia()
  window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
}

const productosPorProvincia = computed(() => {
  if (!provinciaSeleccionada.value) return []

  return productos.filter((p) => {
    return Array.isArray(p.provincias) && p.provincias.includes(provinciaSeleccionada.value)
  })
})

const categoriasDisponibles = computed(() => {
  return [
    "Todos",
    ...new Set(productosPorProvincia.value.map((p) => p.categoria).filter(Boolean))
  ]
})

const productosFiltrados = computed(() => {
  if (!provinciaSeleccionada.value) return []

  return productosPorProvincia.value.filter((p) => {
    return categoria.value === "Todos" || p.categoria === categoria.value
  })
})

onMounted(() => {
  window.addEventListener("provincia-cuba-actualizada", refrescarProvincia)
})

onBeforeUnmount(() => {
  window.removeEventListener("provincia-cuba-actualizada", refrescarProvincia)
})
</script>

<style scoped>
.catalogo{
  padding: 10px 4px 24px;
}

.catalogo-head{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 8px;
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

.provBtn{
  border: 1px solid rgba(0,0,0,0.08);
  background: white;
  color: #111;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 1000;
  cursor: pointer;
  white-space: nowrap;
}

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

@media (max-width: 900px){
  .catalogo-head{
    flex-direction: column;
    align-items: stretch;
  }

  .provBtn{
    width: 100%;
  }
}
</style>