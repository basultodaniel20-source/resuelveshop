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

      <div class="categorias-wrap">
        <Categorias :categorias="categoriasDisponibles" />
      </div>

      <section class="productos">
        <ProductoCard
          v-for="p in productosFiltrados"
          :key="p.id"
          :producto="p"
          @agregar="emit('agregar', $event)"
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

const emit = defineEmits(["agregar"])

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
.catalogo {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 10px 24px;
  box-sizing: border-box;
}

.catalogo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.catalogo-head h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.3rem);
  font-weight: 1000;
  line-height: 1.05;
}

.catalogo-head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-weight: 800;
  font-size: 13px;
  line-height: 1.4;
}

.categorias-wrap {
  margin-bottom: 14px;
}

.productos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 12px;
  align-items: start;
}

.productos > * {
  min-width: 0;
}

.emptyState {
  margin-top: 22px;
  background: #fff;
  border-radius: 18px;
  padding: 22px 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.sin {
  margin: 0 0 14px;
  font-weight: 800;
  color: #6b7280;
  line-height: 1.45;
}

.changeLocation {
  border: none;
  border-radius: 999px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  background: #22c55e;
  color: #fff;
}

@media (max-width: 1100px) {
  .productos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 900px) {
  .catalogo-head {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .catalogo {
    padding: 10px 8px 20px;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .catalogo-head {
    margin-bottom: 10px;
  }

  .catalogo-head h1 {
    font-size: 2rem;
  }

  .catalogo-head p {
    font-size: 12px;
  }

  .categorias-wrap {
    margin-bottom: 12px;
  }
}

@media (max-width: 420px) {
  .catalogo {
    padding: 8px 6px 18px;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .catalogo-head h1 {
    font-size: 1.85rem;
  }

  .catalogo-head p {
    font-size: 11.5px;
  }

  .emptyState {
    padding: 18px 14px;
    border-radius: 16px;
  }
}
</style>