<template>
  <div class="home">
    <!-- 1) HERO -->
    <section class="hero">
      <div class="heroCard">
        <div class="heroLeft">
          <h1>Envía combos a tu familia en Cuba</h1>
          <p>Compra fácil · Entrega rápida · Seguimiento desde tu cuenta</p>

          <div class="heroActions">
            <router-link class="btn primary" to="/catalogo">Ver catálogo</router-link>
            <a class="btn ghost" href="#como-funciona">Cómo funciona</a>
          </div>

          <div class="heroBadges">
            <span class="badge">🚚 3–10 días</span>
            <span class="badge">💬 Soporte rápido</span>
            <span class="badge">🔒 Compra segura</span>
          </div>
        </div>

        <div class="heroRight">
          <div class="miniPanel">
            <div class="mpTitle">Compra en 1 minuto</div>
            <div class="mpText">
              Elige un combo, paga online y lo entregamos en Cuba.
            </div>
            <div class="mpSteps">
              <div class="step">1) Elige</div>
              <div class="step">2) Paga</div>
              <div class="step">3) Entregamos</div>
            </div>
          </div>

          <div class="miniPanel soft">
            <div class="mpTitle">¿Necesitas ayuda?</div>
            <div class="mpText">Atención rápida por WhatsApp.</div>
            <a class="btn mini" :href="whatsLink" target="_blank" rel="noreferrer">
              Abrir WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 2) CATEGORÍAS -->
    <section class="section">
      <div class="sectionHead">
        <h2>Categorías</h2>
        <router-link class="link" to="/catalogo">Ver todo</router-link>
      </div>

      <div class="cats">
        <router-link class="cat" to="/catalogo">
          <div class="catIco">🛍️</div>
          <div class="catTxt">
            <div class="catTitle">Todos</div>
            <div class="catSub">Explorar catálogo</div>
          </div>
        </router-link>

        <router-link
          v-for="cat in categoriasTop"
          :key="cat"
          class="cat"
          :to="`/catalogo/${cat}`"
        >
          <div class="catIco">{{ iconForCat(cat) }}</div>
          <div class="catTxt">
            <div class="catTitle">{{ cat }}</div>
            <div class="catSub">Ver productos</div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 3) MÁS VENDIDOS -->
    <section class="section">
      <div class="sectionHead">
        <h2>Más vendidos</h2>
        <router-link class="link" to="/catalogo">Ver catálogo</router-link>
      </div>

      <section class="grid">
        <ProductoCard
          v-for="p in bestSellers"
          :key="p.id"
          :producto="p"
          @agregar="$emit('agregar', $event)"
        />
      </section>
    </section>

    <!-- 3.1) NOVEDADES -->
    <section class="section">
      <div class="sectionHead">
        <h2>Novedades</h2>
        <span class="muted">Lo último que añadimos</span>
      </div>

      <section class="grid">
        <ProductoCard
          v-for="p in novedades"
          :key="p.id"
          :producto="p"
          @agregar="$emit('agregar', $event)"
        />
      </section>
    </section>

    <!-- 4) OFERTAS / PROMO -->
    <section class="promo">
      <div class="promoCard">
        <div class="promoLeft">
          <div class="promoKicker">🔥 Oferta destacada</div>
          <div class="promoTitle">{{ promoTitle }}</div>
          <div class="promoSub">
            Ahorra tiempo: elige un combo listo para entregar.
          </div>

          <div class="promoActions">
            <router-link class="btn primary" to="/catalogo">Ver ofertas</router-link>
            <router-link class="btn ghost" to="/carrito">Ir al carrito</router-link>
          </div>
        </div>

        <div class="promoRight">
          <div class="promoBox">
            <div class="pbTitle">Ventajas</div>
            <ul class="pbList">
              <li>Pago seguro</li>
              <li>Seguimiento desde tu cuenta</li>
              <li>Soporte rápido</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5) CÓMO FUNCIONA -->
    <section class="section" id="como-funciona">
      <div class="sectionHead">
        <h2>Cómo funciona</h2>
        <span class="muted">Simple, rápido y claro</span>
      </div>

      <div class="how">
        <div class="howCard">
          <div class="howNum">1</div>
          <div class="howTitle">Elige un combo</div>
          <div class="howText">
            Entra al catálogo y selecciona el que más te convenga.
          </div>
        </div>

        <div class="howCard">
          <div class="howNum">2</div>
          <div class="howTitle">Paga online</div>
          <div class="howText">
            Completa el checkout en minutos con tu método de pago.
          </div>
        </div>

        <div class="howCard">
          <div class="howNum">3</div>
          <div class="howTitle">Entregamos en Cuba</div>
          <div class="howText">
            Preparación y entrega según disponibilidad (manteniendo el valor).
          </div>
        </div>
      </div>
    </section>

    <!-- 6) OPINIONES -->
    <section class="section">
      <div class="sectionHead">
        <h2>Opiniones</h2>
        <span class="muted">Lo que dicen nuestros clientes</span>
      </div>

      <div class="reviews">
        <div class="review">
          <div class="stars">★★★★★</div>
          <div class="rText">“Llegó rápido y todo perfecto. Repetiré seguro.”</div>
          <div class="rWho">— Cliente verificado</div>
        </div>

        <div class="review">
          <div class="stars">★★★★★</div>
          <div class="rText">“Muy fácil comprar y el soporte responde rápido.”</div>
          <div class="rWho">— Cliente verificado</div>
        </div>

        <div class="review">
          <div class="stars">★★★★★</div>
          <div class="rText">“Buen servicio y seguimiento desde la cuenta.”</div>
          <div class="rWho">— Cliente verificado</div>
        </div>
      </div>
    </section>

    <!-- 7) CONFIANZA -->
    <section class="trust">
      <div class="trustGrid">
        <div class="trustItem">
          <div class="tIco">🔒</div>
          <div>
            <div class="tTitle">Pago seguro</div>
            <div class="tText">Procesos claros y confirmación de pedido.</div>
          </div>
        </div>

        <div class="trustItem">
          <div class="tIco">📦</div>
          <div>
            <div class="tTitle">Seguimiento</div>
            <div class="tText">Consulta tus pedidos desde tu cuenta.</div>
          </div>
        </div>

        <div class="trustItem">
          <div class="tIco">💬</div>
          <div>
            <div class="tTitle">Soporte rápido</div>
            <div class="tText">Atención por WhatsApp para ayudarte.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="cta">
      <div class="ctaCard">
        <div class="ctaTitle">¿Listo para enviar un combo?</div>
        <div class="ctaSub">
          Entra al catálogo y elige el más conveniente.
        </div>
        <router-link class="btn primary" to="/catalogo">Ir al catálogo</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue"
import ProductoCard from "../components/ProductoCard.vue"

defineEmits(["agregar"])

const props = defineProps({
  productos: { type: Array, default: () => [] },
  categorias: { type: Array, default: () => [] },
})

/** WhatsApp */
const whatsPhone = "34643170184"

const whatsLink = computed(() =>
  `https://wa.me/${whatsPhone}?text=${encodeURIComponent(
    "Hola! Necesito ayuda con un pedido en ResuelveShop."
  )}`
)

/** Categorías top: primeras 4 (sin "Todos") */
const categoriasTop = computed(() => {
  const cats = (props.categorias || []).filter((c) => c && c !== "Todos")
  return cats.slice(0, 4)
})

function iconForCat(cat) {
  const c = String(cat || "").toLowerCase()
  if (c.includes("aseo")) return "🧼"
  if (c.includes("alimento")) return "🛒"
  if (c.includes("bebida")) return "🥤"
  if (c.includes("combo")) return "📦"
  return "🏷️"
}

/**
 * Más vendidos:
 * - Si luego metes p.masVendido=true o p.ventas, lo hacemos “real”.
 * - De momento: primeros 6 del array.
 */
const bestSellers = computed(() => (props.productos || []).slice(0, 6))

/**
 * Novedades: últimos 6 del array
 */
const novedades = computed(() => {
  const arr = props.productos || []
  return arr.slice(Math.max(0, arr.length - 6))
})

/**
 * Promo: usa el primer producto como “destacado” (si existe)
 */
const promoTitle = computed(() => {
  const first = (props.productos || [])[0]
  return first?.nombre ? `Prueba: ${first.nombre}` : "Combos listos para entregar"
})
</script>

<style scoped>
.home{ padding: 8px 2px 22px; }

/* ---------- HERO ---------- */
.hero{ margin: 10px 0 14px; }

.heroCard{
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  background:
    radial-gradient(900px 260px at 15% 0%, rgba(40,167,69,0.16), transparent 60%),
    radial-gradient(750px 260px at 95% 35%, rgba(16,185,129,0.12), transparent 60%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
}

.heroLeft h1{
  margin: 10px 0 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 1000;
  letter-spacing: -0.2px;
}

.heroLeft p{
  margin: 10px 0 0;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
}

.heroActions{
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.heroBadges{
  margin-top: 14px;
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

.heroRight{ display: grid; gap: 10px; }

.miniPanel{
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.85);
  padding: 12px;
}

.miniPanel.soft{ background: rgba(245,246,248,0.85); }

.mpTitle{ font-weight: 1000; font-size: 13px; }
.mpText{
  margin-top: 6px;
  color:#6b7280;
  font-weight: 900;
  font-size: 12px;
  line-height: 1.35;
}

.mpSteps{
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.step{
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.85);
  padding: 10px;
  font-weight: 1000;
  font-size: 12px;
  text-align: center;
}

/* ---------- GENERALES ---------- */
.section{ margin-top: 16px; }
.sectionHead{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.sectionHead h2{
  margin: 0;
  font-size: 16px;
  font-weight: 1000;
}
.muted{
  color:#6b7280;
  font-weight: 900;
  font-size: 12px;
}
.link{
  text-decoration: none;
  font-weight: 1000;
  color: #28a745;
  font-size: 12px;
}

/* ---------- BOTONES ---------- */
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration:none;
  font-weight: 1000;
  border: 1px solid transparent;
  cursor: pointer;
}
.btn.primary{ background:#28a745; color: white; }
.btn.ghost{ background: white; border-color: #eee; color: #111; }
.btn.mini{ padding: 10px 12px; border-radius: 12px; background:#28a745; color:#fff; }

/* ---------- CATEGORÍAS ---------- */
.cats{
  display:grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.cat{
  text-decoration:none;
  color:#111;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
  display:flex;
  gap: 10px;
  align-items:center;
}
.catIco{
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display:grid;
  place-items:center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 18px;
}
.catTitle{ font-weight: 1000; font-size: 13px; }
.catSub{ margin-top:2px; color:#6b7280; font-weight: 900; font-size: 12px; }

/* ---------- GRID PRODUCTOS ---------- */
.grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

/* ---------- PROMO ---------- */
.promo{ margin-top: 18px; }
.promoCard{
  border-radius: 20px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  background:
    radial-gradient(900px 260px at 15% 0%, rgba(34,197,94,0.14), transparent 60%),
    radial-gradient(750px 260px at 95% 35%, rgba(59,130,246,0.10), transparent 60%),
    #ffffff;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  display:grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
}
.promoKicker{
  display:inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 12px;
  border: 1px solid rgba(40,167,69,0.22);
  background: rgba(40,167,69,0.10);
  color: #14532d;
}
.promoTitle{ margin-top: 10px; font-weight: 1000; font-size: 18px; }
.promoSub{ margin-top: 6px; color:#6b7280; font-weight: 900; font-size: 12px; }
.promoActions{ margin-top: 12px; display:flex; gap: 10px; flex-wrap: wrap; }
.promoBox{
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.85);
  padding: 12px;
}
.pbTitle{ font-weight: 1000; font-size: 13px; margin-bottom: 8px; }
.pbList{
  margin: 0;
  padding-left: 18px;
  color:#374151;
  font-weight: 900;
  font-size: 12px;
  display:grid;
  gap: 6px;
}

/* ---------- CÓMO FUNCIONA ---------- */
.how{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.howCard{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}
.howNum{
  width: 34px; height: 34px;
  border-radius: 14px;
  display:grid; place-items:center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-weight: 1000;
}
.howTitle{ margin-top: 10px; font-weight: 1000; font-size: 13px; }
.howText{ margin-top: 6px; color:#6b7280; font-weight: 900; font-size: 12px; line-height: 1.35; }

/* ---------- REVIEWS ---------- */
.reviews{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.review{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}
.stars{ font-weight: 1000; }
.rText{ margin-top: 8px; color:#374151; font-weight: 900; font-size: 12px; line-height: 1.35; }
.rWho{ margin-top: 10px; color:#6b7280; font-weight: 1000; font-size: 12px; }

/* ---------- TRUST ---------- */
.trust{ margin-top: 18px; }
.trustGrid{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.trustItem{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
  display:flex;
  gap: 10px;
  align-items:flex-start;
}
.tIco{
  width: 38px; height: 38px;
  border-radius: 14px;
  display:grid; place-items:center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
}
.tTitle{ font-weight: 1000; font-size: 13px; }
.tText{ margin-top: 2px; color:#6b7280; font-weight: 900; font-size: 12px; line-height: 1.35; }

/* ---------- CTA FINAL ---------- */
.cta{ margin-top: 18px; }
.ctaCard{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  text-align:center;
}
.ctaTitle{ font-weight: 1000; font-size: 16px; }
.ctaSub{ margin-top: 8px; color:#6b7280; font-weight: 900; font-size: 12px; }
.ctaCard .btn{ margin-top: 12px; }

/* ---------- RESPONSIVE MÓVIL ---------- */
@media (max-width: 900px){
  .heroCard{ grid-template-columns: 1fr; padding: 12px; border-radius: 18px; }
  .heroLeft h1{ font-size: 20px; }
  .heroLeft p{ font-size: 12px; }

  .mpSteps{ grid-template-columns: repeat(3, 1fr); }
  .step{ padding: 8px; font-size: 11px; border-radius: 12px; }

  .cats{ grid-template-columns: repeat(2, 1fr); }
  .grid{ grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }

  .promoCard{ grid-template-columns: 1fr; padding: 12px; border-radius: 18px; }

  .how{ grid-template-columns: 1fr; }
  .reviews{ grid-template-columns: 1fr; }
  .trustGrid{ grid-template-columns: 1fr; }
}
</style>
