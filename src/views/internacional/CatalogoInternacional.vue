<template>
  <StoreLayout>
    <div class="home">
      <PedidoPendienteBanner />

      <section class="hero">
        <div class="hero-card">
          <div class="hero-left">
            <h1>Envía combos a tu familia en Cuba</h1>
            <p>Compra fácil · Entrega rápida · Seguimiento desde tu cuenta</p>

            <div class="hero-badges">
              <span class="badge">🚚 3–10 días</span>
              <span class="badge">💬 Soporte rápido</span>
              <span class="badge">🔒 Compra segura</span>
            </div>
          </div>
        </div>
      </section>

      <Categorias :categorias="categorias" class="cats" />

      <section class="productos">
        <ProductoCard
          v-for="p in productosFiltrados"
          :key="p.id"
          :producto="p"
          @agregar="emit('agregar', $event)"
        />
      </section>

      <p v-if="productosFiltrados.length === 0" class="sin">
        No se encontraron productos
      </p>
    </div>
  </StoreLayout>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../../components/Categorias.vue"
import ProductoCard from "../../components/ProductoCard.vue"
import StoreLayout from "@/layouts/StoreLayout.vue"

const emit = defineEmits(["agregar"])

const props = defineProps({
  productos: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] },
  busqueda: { type: String, default: "" },
})

const route = useRoute()

const categoria = computed(() => route.params.categoria || "Todos")
const busquedaUrl = computed(() =>
  String(route.query.q || "").toLowerCase().trim()
)

const productosFiltrados = computed(() => {
  return props.productos.filter((p) => {
    const pasaCategoria =
      categoria.value === "Todos" || p.categoria === categoria.value

    const nombre = String(p.nombre || "").toLowerCase()
    const descripcion = String(p.descripcion || "").toLowerCase()
    const categoriaTexto = String(p.categoria || "").toLowerCase()

    const pasaBusqueda =
      !busquedaUrl.value ||
      nombre.includes(busquedaUrl.value) ||
      descripcion.includes(busquedaUrl.value) ||
      categoriaTexto.includes(busquedaUrl.value)

    return pasaCategoria && pasaBusqueda
  })
})
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px 8px 22px;
  box-sizing: border-box;
}

/* HERO */
.hero {
  margin: 10px 0 14px;
}

.hero-card {
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background:
    radial-gradient(900px 260px at 15% 0%, rgba(40, 167, 69, 0.16), transparent 60%),
    radial-gradient(750px 260px at 95% 35%, rgba(16, 185, 129, 0.12), transparent 60%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.06);
}

.hero-left h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  line-height: 1.1;
  font-weight: 1000;
  letter-spacing: -0.2px;
}

.hero-left p {
  margin: 8px 0 0;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
}

.hero-badges {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.75);
  font-weight: 900;
  font-size: 12px;
}

.cats {
  margin-top: 10px;
}

/* PRODUCTOS */
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

.sin {
  margin-top: 20px;
  font-weight: 1000;
  color: #6b7280;
  text-align: center;
  line-height: 1.45;
}

/* Responsive */
@media (max-width: 1100px) {
  .productos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 8px 6px 20px;
  }

  .hero {
    margin: 8px 0 12px;
  }

  .hero-card {
    padding: 12px;
    border-radius: 18px;
  }

  .hero-left h1 {
    font-size: 1.35rem;
    line-height: 1.1;
  }

  .hero-left p {
    font-size: 12px;
  }

  .hero-badges {
    gap: 6px;
    margin-top: 10px;
  }

  .badge {
    padding: 6px 9px;
    font-size: 11px;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

@media (max-width: 420px) {
  .home {
    padding: 8px 4px 18px;
  }

  .hero-card {
    padding: 10px;
    border-radius: 16px;
  }

  .hero-left h1 {
    font-size: 1.22rem;
  }

  .hero-left p {
    font-size: 11.5px;
  }

  .badge {
    font-size: 10.5px;
    padding: 5px 8px;
  }

  .productos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}
</style>