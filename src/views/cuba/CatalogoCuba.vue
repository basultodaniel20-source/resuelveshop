<template>
  <StoreLayout>
    <div class="catalogo">
      <div class="catalogo-head">
        <div>
          <h1>Tienda Cuba 🇨🇺</h1>
          <p>
            {{
              provinciaSeleccionada && municipioSeleccionado
                ? `Productos disponibles en ${provinciaSeleccionada} · ${municipioSeleccionado}`
                : "Selecciona provincia y municipio para ver disponibilidad"
            }}
          </p>
        </div>
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

      <div
        v-if="!provinciaSeleccionada || !municipioSeleccionado"
        class="emptyState"
      >
        <p class="sin">
          Primero selecciona provincia y municipio para ver los productos disponibles.
        </p>
        <button class="changeLocation" @click="cambiarUbicacion">
          Elegir ubicación
        </button>
      </div>

      <div
        v-else-if="productosFiltrados.length === 0"
        class="emptyState"
      >
        <p class="sin">
          No hay productos disponibles para
          {{ provinciaSeleccionada }} · {{ municipioSeleccionado }}
          en esta categoría.
        </p>
        <button class="changeLocation" @click="cambiarUbicacion">
          Cambiar ubicación
        </button>
      </div>
    </div>
  </StoreLayout>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../../components/Categorias.vue"
import ProductoCard from "../../components/ProductoCard.vue"
import { productos } from "../../data/productosCuba.js"
import StoreLayout from "@/layouts/StoreLayout.vue"

defineEmits(["agregar"])

const route = useRoute()
const categoria = computed(() => route.params.categoria || "Todos")

const provinciaSeleccionada = ref(localStorage.getItem("provincia_cuba") || "")
const municipioSeleccionado = ref(localStorage.getItem("municipio_cuba") || "")

function refrescarUbicacion() {
  provinciaSeleccionada.value = localStorage.getItem("provincia_cuba") || ""
  municipioSeleccionado.value = localStorage.getItem("municipio_cuba") || ""
}

function cambiarUbicacion() {
  localStorage.removeItem("provincia_cuba")
  localStorage.removeItem("municipio_cuba")
  localStorage.removeItem("carrito_cuba")

  refrescarUbicacion()

  window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
  window.dispatchEvent(new CustomEvent("carrito-actualizado"))
}

const productosPorZona = computed(() => {
  if (!provinciaSeleccionada.value || !municipioSeleccionado.value) return []

  return productos.filter((p) => {
    const okProvincia =
      !Array.isArray(p.provincias) || p.provincias.includes(provinciaSeleccionada.value)

    const okMunicipio =
      !Array.isArray(p.municipios) || p.municipios.includes(municipioSeleccionado.value)

    return okProvincia && okMunicipio
  })
})

const categoriasDisponibles = computed(() => {
  return [
    "Todos",
    ...new Set(productosPorZona.value.map((p) => p.categoria).filter(Boolean))
  ]
})

const productosFiltrados = computed(() => {
  if (!provinciaSeleccionada.value || !municipioSeleccionado.value) return []

  return productosPorZona.value.filter((p) => {
    return categoria.value === "Todos" || p.categoria === categoria.value
  })
})

onMounted(() => {
  window.addEventListener("provincia-cuba-actualizada", refrescarUbicacion)
})

onBeforeUnmount(() => {
  window.removeEventListener("provincia-cuba-actualizada", refrescarUbicacion)
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
  line-height: 1.4;
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

.emptyState{
  margin-top: 22px;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.sin{
  margin-top: 0;
  font-weight: 1000;
  color: #6b7280;
  text-align: center;
  line-height: 1.45;
}

.changeLocation{
  border: 1px solid rgba(0,0,0,0.08);
  background: white;
  color: #111;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 1000;
  cursor: pointer;
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