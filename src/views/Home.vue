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
            <div class="mpText">Elige un combo, paga online y lo entregamos en Cuba.</div>
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

    <!-- 3) MÁS VENDIDOS (BANNER) -->
    <section class="section" v-if="bestSellers.length">
      <div class="sectionBanner bannerBest">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Más vendidos</h2>
            <p>Los combos más pedidos en ResuelveShop</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Ver catálogo</router-link>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">🔥 Top ventas</div>
          </div>
        </div>
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

    <!-- 3.1) NOVEDADES (SIN BANNER, PERO HEAD COOL) -->
    <section class="section" v-if="novedades.length">
      <div class="sectionHeadCool">
        <div class="shLeft">
          <div class="shKicker">✨</div>
          <div>
            <h2>Novedades</h2>
            <div class="shSub">Lo último que añadimos</div>
          </div>
        </div>

        <router-link class="shLink" to="/catalogo">Ver catálogo</router-link>
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

    <!-- 4) OFERTA DESTACADA (BANNER + CAJAS COOL) -->
    <section class="section">
      <div class="sectionBanner bannerPromo">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Oferta destacada</h2>
            <p>{{ promoTitle }}</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Ver ofertas</router-link>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">🔥 Ahorra hoy</div>
          </div>
        </div>
      </div>

      <div class="promoCool">
        <div class="promoBoxCool">
          <div class="pbTitle">Ventajas</div>
          <ul class="pbList">
            <li>Pago seguro</li>
            <li>Seguimiento desde tu cuenta</li>
            <li>Soporte rápido</li>
          </ul>
        </div>

        <div class="promoBoxCool soft">
          <div class="pbTitle">Tip</div>
          <div class="pbTip">Elige un combo listo para entregar y ahorra tiempo.</div>
        </div>
      </div>
    </section>

    <!-- 5) CÓMO FUNCIONA (NORMAL) -->
    <section class="section" id="como-funciona">
      <div class="sectionHead">
        <h2>Cómo funciona</h2>
        <span class="muted">Simple, rápido y claro</span>
      </div>

      <div class="how howCool">
        <div class="howCard">
          <div class="howNum">1</div>
          <div class="howTitle">Elige un combo</div>
          <div class="howText">Entra al catálogo y selecciona el que más te convenga.</div>
        </div>

        <div class="howCard">
          <div class="howNum">2</div>
          <div class="howTitle">Paga online</div>
          <div class="howText">Completa el checkout en minutos con tu método de pago.</div>
        </div>

        <div class="howCard">
          <div class="howNum">3</div>
          <div class="howTitle">Entregamos en Cuba</div>
          <div class="howText">Preparación y entrega según disponibilidad (manteniendo el valor).</div>
        </div>
      </div>
    </section>

    <!-- 6) OPINIONES (SIN BANNER, PERO HEAD COOL) -->
    <section class="section">
      <div class="sectionHeadCool">
        <div class="shLeft">
          <div class="shKicker">⭐</div>
          <div>
            <h2>Opiniones</h2>
            <div class="shSub">Lo que dicen nuestros clientes</div>
          </div>
        </div>

        <span class="shPill">5.0 • Clientes felices</span>
      </div>

      <div class="reviews reviewsCool">
        <div class="review">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <div class="rText">“Llegó rápido y todo perfecto. Repetiré seguro.”</div>
          <div class="rWho">— Cliente verificado</div>
        </div>

        <div class="review">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <div class="rText">“Muy fácil comprar y el soporte responde rápido.”</div>
          <div class="rWho">— Cliente verificado</div>
        </div>

        <div class="review">
          <div class="stars">⭐⭐⭐⭐⭐</div>
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

    <!-- 8) CTA FINAL (BANNER) -->
    <section class="section">
      <div class="sectionBanner bannerCta">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>¿Listo para enviar un combo?</h2>
            <p>Entra al catálogo y elige el más conveniente.</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Ir al catálogo</router-link>
              <a class="btn ghost" :href="whatsLink" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">📦 Envío rápido</div>
          </div>
        </div>
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
const whatsPhone = "34624569359"
const whatsLink = computed(() =>
  `https://wa.me/${whatsPhone}?text=${encodeURIComponent(
    "Hola! Necesito ayuda con un pedido en ResuelveShop."
  )}`
)

/** Categorías top */
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

/** Más vendidos */
const bestSellers = computed(() =>
  (props.productos || []).filter((p) => p?.masVendido === true)
)

/** Novedades */
const novedades = computed(() =>
  (props.productos || []).filter((p) => p?.novedad === true)
)

/** Promo */
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
.heroLeft h1{ margin: 10px 0 0; font-size: 28px; line-height: 1.1; font-weight: 1000; letter-spacing: -0.2px; }
.heroLeft p{ margin: 10px 0 0; color: #6b7280; font-weight: 900; font-size: 13px; }
.heroActions{ margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
.heroBadges{ margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
.badge{
  display: inline-flex; align-items: center;
  padding: 7px 10px; border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.75);
  font-weight: 900; font-size: 12px;
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
.mpText{ margin-top: 6px; color:#6b7280; font-weight: 900; font-size: 12px; line-height: 1.35; }
.mpSteps{ margin-top: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
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
  display:flex; align-items:baseline; justify-content:space-between;
  gap: 10px; margin-bottom: 10px;
}
.sectionHead h2{ margin: 0; font-size: 16px; font-weight: 1000; }
.muted{ color:#6b7280; font-weight: 900; font-size: 12px; }
.link{ text-decoration: none; font-weight: 1000; color: #28a745; font-size: 12px; }

/* ---------- SECTION HEAD COOL (NOVEDADES + OPINIONES) ---------- */
.sectionHeadCool{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.06);
  background:
    radial-gradient(700px 200px at 10% 0%, rgba(40,167,69,0.14), transparent 60%),
    #ffffff;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
  margin-bottom: 12px;
}
.shLeft{ display:flex; align-items:center; gap: 10px; }
.shKicker{
  width: 38px; height: 38px;
  border-radius: 14px;
  display:grid; place-items:center;
  background: rgba(40,167,69,0.12);
  border: 1px solid rgba(40,167,69,0.20);
  font-size: 18px;
}
.sectionHeadCool h2{ margin: 0; font-size: 16px; font-weight: 1000; }
.shSub{ margin-top: 2px; color:#6b7280; font-weight: 900; font-size: 12px; }
.shLink{
  text-decoration:none;
  font-weight: 1000;
  font-size: 12px;
  color: #28a745;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(40,167,69,0.22);
  background: rgba(40,167,69,0.08);
}
.shPill{
  font-weight: 1000;
  font-size: 12px;
  color: #111;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.9);
}

/* ---------- BOTONES ---------- */
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap: 8px; padding: 12px 14px; border-radius: 12px;
  text-decoration:none; font-weight: 1000;
  border: 1px solid transparent; cursor: pointer;
}
.btn.primary{ background:#28a745; color: white; }
.btn.ghost{ background: white; border-color: #eee; color: #111; }
.btn.mini{ padding: 10px 12px; border-radius: 12px; background:#28a745; color:#fff; }

/* ---------- CATEGORÍAS ---------- */
.cats{ display:grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.cat{
  text-decoration:none; color:#111;
  background: white; border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px; padding: 12px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
  display:flex; gap: 10px; align-items:center;
}
.catIco{
  width: 38px; height: 38px; border-radius: 14px;
  display:grid; place-items:center;
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

/* ---------- BANNERS (3) ---------- */
.sectionBanner{
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  min-height: 170px;
  margin-bottom: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.bannerBest{ background-image: url("/img/banners/masVendido1.png"); }
.bannerPromo{ background-image: url("/img/banners/oferta1.png"); }
.bannerCta{ background-image: url("/img/banners/envio1.png"); }

.bannerOverlay{
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.72),
    rgba(0,0,0,0.25) 60%,
    rgba(0,0,0,0.08)
  );
}
.bannerContent{
  position: relative;
  z-index: 1;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
  align-items: center;
}
.bannerLeft{ max-width: 520px; }
.bannerLeft h2{
  margin: 0;
  color: #fff;
  font-weight: 1000;
  font-size: 26px;
  line-height: 1.05;
}
.bannerLeft p{
  margin-top: 10px;
  color: rgba(255,255,255,0.9);
  font-weight: 900;
  font-size: 13px;
}
.bannerActions{ margin-top: 12px; display:flex; gap:10px; flex-wrap:wrap; }
.bannerRight{ display:flex; justify-content:flex-end; }
.miniFloat{
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.45);
  border-radius: 16px;
  padding: 10px 14px;
  font-weight: 1000;
  font-size: 14px;
  color: #111;
}

/* ---------- PROMO COOL ---------- */
.promoCool{
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.promoBoxCool{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}
.promoBoxCool.soft{ background: rgba(245,246,248,0.85); }
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
.pbTip{ margin-top: 6px; color:#374151; font-weight: 900; font-size: 12px; line-height: 1.35; }

/* ---------- CÓMO FUNCIONA ---------- */
.how{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.howCool .howCard{ border-radius: 18px; padding: 14px; }
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

/* ---------- OPINIONES ---------- */
.reviews{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.reviewsCool .review{ border-radius: 18px; padding: 14px; }
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

/* ---------- RESPONSIVE ---------- */
@media (max-width: 900px){
  .heroCard{ grid-template-columns: 1fr; padding: 12px; border-radius: 18px; }
  .heroLeft h1{ font-size: 20px; }
  .heroLeft p{ font-size: 12px; }

  .cats{ grid-template-columns: repeat(2, 1fr); }
  .grid{ grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }

  .bannerContent{ grid-template-columns: 1fr; }
  .bannerRight{ justify-content: flex-start; }
  .bannerOverlay{
    background: linear-gradient(
      180deg,
      rgba(0,0,0,0.72),
      rgba(0,0,0,0.12)
    );
  }

  .how{ grid-template-columns: 1fr; }
  .reviews{ grid-template-columns: 1fr; }
  .trustGrid{ grid-template-columns: 1fr; }
  .promoCool{ grid-template-columns: 1fr; }

  .sectionHeadCool{ padding: 10px 12px; }
  .shLink{ display:none; }
}
</style>
