<template>
  <StoreLayout>
    <div class="catalogo">
      <section class="catalogo-banner">
        <img
          :src="bannerCatalogo"
          alt="Banner catálogo Cuba"
          class="catalogo-banner-img"
        />

        <div class="catalogo-banner-overlay">
          <div class="catalogo-head">
            <div>
              <h1 class="catalogo-title">
                <span>Tienda Cuba</span>
                <img :src="flagCuba" alt="Bandera de Cuba" class="flag-desktop" />
                <img :src="flagCuba" alt="Bandera de Cuba" class="flag-mobile" />
              </h1>

              <p>
                {{
                  provinciaSeleccionada && municipioSeleccionado
                    ? `Productos disponibles en ${provinciaSeleccionada} · ${municipioSeleccionado}`
                    : "Selecciona provincia y municipio para ver disponibilidad"
                }}
              </p>
            </div>
          </div>
        </div>
      </section>

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


import bannerCatalogo from "@/assets/cuba/catalogo/banner-catalogo.png"
import flagCuba from "@/assets/cuba/catalogo/flag-cuba.png"


const emit = defineEmits(["agregar"])

const route = useRoute()
const categoria = computed(() => route.params.categoria || "Todos")
const busqueda = computed(() => String(route.query.q || "").toLowerCase().trim())

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
    const pasaCategoria =
      categoria.value === "Todos" || p.categoria === categoria.value

    const nombre = String(p.nombre || "").toLowerCase()
    const descripcion = String(p.descripcion || "").toLowerCase()
    const categoriaTexto = String(p.categoria || "").toLowerCase()

    const pasaBusqueda =
      !busqueda.value ||
      nombre.includes(busqueda.value) ||
      descripcion.includes(busqueda.value) ||
      categoriaTexto.includes(busqueda.value)

    return pasaCategoria && pasaBusqueda
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

/* BANNER */
.catalogo-banner {
  position: relative;
  width: 100%;
  min-height: 240px;
  border-radius: 26px;
  overflow: hidden;
  margin-bottom: 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.06);
  background: #f3f4f6;
}

.catalogo-banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.catalogo-banner-overlay {
  position: relative;
  z-index: 1;
  min-height: 240px;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.10) 0%,
    rgba(0, 0, 0, 0.48) 100%
  );
}

.catalogo-head {
  margin: 0;
}

.catalogo-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: white;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.02;
  font-weight: 1000;
  letter-spacing: -0.03em;
}

.catalogo-head p {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.flag-desktop,
.flag-mobile {
  display: block;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.flag-desktop {
  width: 34px;
  height: 24px;
}

.flag-mobile {
  display: none;
  width: 28px;
  height: 20px;
}

/* RESTO */
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
  .catalogo-banner {
    min-height: 200px;
  }

  .catalogo-banner-overlay {
    min-height: 200px;
    padding: 18px;
  }
}

@media (max-width: 768px) {
  .catalogo {
    padding: 10px 8px 20px;
  }

  .catalogo-banner {
    min-height: 180px;
    border-radius: 22px;
    margin-bottom: 14px;
  }

  .catalogo-banner-overlay {
    min-height: 180px;
    padding: 16px;
  }

  .catalogo-title {
    font-size: 2rem;
    gap: 8px;
  }

  .catalogo-head p {
    font-size: 12px;
    margin-top: 8px;
  }

  .flag-desktop {
    display: none;
  }

  .flag-mobile {
    display: block;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .categorias-wrap {
    margin-bottom: 12px;
  }
}

@media (max-width: 420px) {
  .catalogo {
    padding: 8px 6px 18px;
  }

  .catalogo-banner {
    min-height: 165px;
  }

  .catalogo-banner-overlay {
    min-height: 165px;
    padding: 14px;
  }

  .catalogo-title {
    font-size: 1.75rem;
  }

  .catalogo-head p {
    font-size: 11.5px;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .emptyState {
    padding: 18px 14px;
    border-radius: 16px;
  }
}
</style>