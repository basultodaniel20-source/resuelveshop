
<template>
  <div class="home">
    <!-- HERO PRO -->
    <section class="hero">
      <div class="hero-card">
        <div class="hero-left">
          <div class="kicker">ResuelveShop</div>
          <h1>Envía combos a tu familia en Cuba</h1>
          <p>Compra fácil · Entrega rápida · Seguimiento desde tu cuenta</p>

          <div class="hero-badges">
            <span class="badge">🚚 3–10 días</span>
            <span class="badge">💬 Soporte rápido</span>
            <span class="badge">🔒 Compra segura</span>
          </div>
        </div>

        <div class="hero-right">
          <div class="tip">
            <div class="tip-top">
              <span class="tip-ico">💡</span>
              <div>
                <div class="tip-title">Consejo</div>
                <div class="tip-text">
                  Elige un combo, agrégalo al carrito y finaliza en menos de 1 minuto.
                </div>
              </div>
            </div>

            <div class="tip-steps">
              <div class="step"><b>1.</b> Elige</div>
              <div class="step"><b>2.</b> Carrito</div>
              <div class="step"><b>3.</b> Paga</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORÍAS -->
    <Categorias :categorias="categorias" class="cats" />

    <!-- PRODUCTOS -->
    <section class="productos">
      <ProductoCard
        v-for="p in productosFiltrados"
        :key="p.id"
        :producto="p"
        @agregar="$emit('agregar', $event)"
      />
    </section>

    <p v-if="productosFiltrados.length === 0" class="sin">No se encontraron productos</p>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Categorias from "../components/Categorias.vue"
import ProductoCard from "../components/ProductoCard.vue"

defineEmits(["agregar"])

const props = defineProps({
  productos: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] },
  busqueda: { type: String, default: "" },
})

const route = useRoute()
const categoria = computed(() => route.params.categoria || "Todos")

const productosFiltrados = computed(() => {
  const q = (props.busqueda || "").toLowerCase()
  return props.productos.filter((p) => {
    const pasaCategoria = categoria.value === "Todos" || p.categoria === categoria.value
    const pasaTexto = (p.nombre || "").toLowerCase().includes(q)
    return pasaCategoria && pasaTexto
  })
})
</script>

<style scoped>
.home{
  padding: 8px 2px 22px;
}

/* HERO */
.hero{ margin: 10px 0 14px; }

.hero-card{
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  background:
    radial-gradient(900px 260px at 15% 0%, rgba(40,167,69,0.16), transparent 60%),
    radial-gradient(750px 260px at 95% 35%, rgba(16,185,129,0.12), transparent 60%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 14px;
}

.kicker{
  display:inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  border: 1px solid rgba(40,167,69,0.22);
  background: rgba(40,167,69,0.10);
  color: #14532d;
}

.hero-left h1{
  margin: 10px 0 0;
  font-size: 24px;
  line-height: 1.12;
  font-weight: 1000;
  letter-spacing: -0.2px;
}

.hero-left p{
  margin: 8px 0 0;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
}

.hero-badges{
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge{
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.75);
  font-weight: 900;
  font-size: 12px;
}

/* TIP */
.tip{
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.85);
  padding: 12px;
}

.tip-top{
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.tip-ico{
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.12);
  border: 1px solid rgba(40,167,69,0.18);
}

.tip-title{
  font-weight: 1000;
  font-size: 13px;
}

.tip-text{
  margin-top: 4px;
  color: #6b7280;
  font-weight: 900;
  font-size: 12px;
  line-height: 1.35;
}

.tip-steps{
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.step{
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.8);
  padding: 10px;
  font-weight: 1000;
  font-size: 12px;
  text-align: center;
}

.cats{ margin-top: 10px; }

/* PRODUCTOS */
.productos{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.sin{
  margin-top: 20px;
  font-weight: 1000;
  color: #6b7280;
  text-align: center;
}

/* Responsive */
@media (max-width: 900px){
  .hero-card{ grid-template-columns: 1fr; }
}
</style>
