<template>
  <div class="home">
    <!-- 1) HERO -->
    <section class="hero">
      <div class="heroCard">
        <div class="heroLeft">
          <h1>Envía combos a tu familia en Cuba</h1>
          <p>Compra fácil · Entrega rápida · Seguimiento desde tu cuenta</p>
        </div>
      </div>
    </section>

    <!-- NAV STICKY (SE QUEDA ARRIBA + TAB ACTIVA) -->
    <div class="stickyNavTop" ref="stickyRef">
      <div class="tabsTop">
        <a
          class="tabBtn"
          :class="{ active: activeTab === 'categorias' }"
          href="#categorias"
          @click.prevent="scrollToSection('categorias')"
        >
          Categorías 📁💡
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'mas-vendidos' }"
          href="#mas-vendidos"
          @click.prevent="scrollToSection('mas-vendidos')"
        >
          Más Vendidos 🥇💸
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'novedades' }"
          href="#novedades"
          @click.prevent="scrollToSection('novedades')"
        >
          Novedades ✨🔝
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'ofertas-destacadas' }"
          href="#ofertas-destacadas"
          @click.prevent="scrollToSection('ofertas-destacadas')"
        >
          Ofertas Destacadas ⚡💰
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'como-funciona' }"
          href="#como-funciona"
          @click.prevent="scrollToSection('como-funciona')"
        >
          Cómo funciona ⚙️📝
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'opiniones' }"
          href="#opiniones"
          @click.prevent="scrollToSection('opiniones')"
        >
          Opiniones 🗣️💬
        </a>

        <a
          class="tabBtn"
          :class="{ active: activeTab === 'listo-para-enviar' }"
          href="#listo-para-enviar"
          @click.prevent="scrollToSection('listo-para-enviar')"
        >
          Listo para enviar 📦➡️🚚
        </a>
      </div>
    </div>

    <!-- 2) CATEGORÍAS -->
    <section class="section" id="categorias">
      <div class="sectionBanner bannerCats">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Categorías</h2>
            <p>Explora rápido y encuentra el combo ideal</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Ver todo</router-link>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">🗂️ Explorar</div>
          </div>
        </div>
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
    <section class="section" id="mas-vendidos" v-if="bestSellers.length">
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

    <!-- 3.1) NOVEDADES -->
    <section class="section" id="novedades" v-if="novedades.length">
      <div class="sectionBanner bannerNew">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Novedades</h2>
            <p>Lo último que añadimos a ResuelveShop</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Ver catálogo</router-link>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">✨ Nuevo</div>
          </div>
        </div>
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

    <!-- 4) OFERTA DESTACADA -->
    <section class="section" id="ofertas-destacadas">
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

    <!-- 5) CÓMO FUNCIONA -->
    <section class="section" id="como-funciona">
      <div class="sectionBanner bannerHow">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Cómo funciona</h2>
            <p>Simple, rápido y claro</p>

            <div class="bannerActions">
              <router-link class="btn primary" to="/catalogo">Empezar</router-link>
              <a class="btn ghost" :href="whatsLink" target="_blank" rel="noreferrer">Ayuda</a>
            </div>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">⚡ 1 minuto</div>
          </div>
        </div>
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

    <!-- 6) OPINIONES -->
    <section class="section" id="opiniones">
      <div class="sectionBanner bannerReviews">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerLeft">
            <h2>Opiniones</h2>
            <p>Lo que dicen nuestros clientes</p>
          </div>

          <div class="bannerRight">
            <div class="miniFloat">⭐ 5/5</div>
          </div>
        </div>
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

    <!-- 8) CTA FINAL -->
    <section class="section" id="listo-para-enviar">
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

    <!-- Spacer real (para que la última sección suba bien bajo el sticky) -->
    <div class="bottomSpacer" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from "vue"
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

/* ===== NAV STICKY + SCROLL OFFSET REAL ===== */
const activeTab = ref("categorias")
const stickyRef = ref(null)

const sectionIds = [
  "categorias",
  "mas-vendidos",
  "novedades",
  "ofertas-destacadas",
  "como-funciona",
  "opiniones",
  "listo-para-enviar",
]

let observer
let onHashChange
let onResize

function getStickyHeight() {
  return stickyRef.value?.offsetHeight || 0
}

function scrollToSection(id) {
  // marcar instantáneo
  activeTab.value = id

  const el = document.getElementById(id)
  if (!el) return

  // hash sin recargar
  history.replaceState(null, "", `#${id}`)

  // scroll exacto debajo del sticky
  const stickyH = getStickyHeight()
  const extraGap = 14
  const targetTop = window.scrollY + el.getBoundingClientRect().top - stickyH - extraGap

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "auto", // instantáneo (cámbialo a "smooth" si quieres animación)
  })
}

function setupObserver() {
  if (observer) observer.disconnect()

  const stickyH = getStickyHeight()

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visible?.target?.id) activeTab.value = visible.target.id
    },
    {
      threshold: [0.2, 0.35, 0.5],
      rootMargin: `-${stickyH + 12}px 0px -55% 0px`,
    }
  )

  sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .forEach((el) => observer.observe(el))
}

onMounted(async () => {
  await nextTick()

  // si entra con hash, saltar exacto
  if (window.location.hash) {
    const id = window.location.hash.replace("#", "")
    if (sectionIds.includes(id)) {
      // espera un tick para medir sticky bien
      setTimeout(() => scrollToSection(id), 0)
    }
  }

  setupObserver()

  onHashChange = () => {
    const id = window.location.hash.replace("#", "")
    if (sectionIds.includes(id)) scrollToSection(id)
  }
  window.addEventListener("hashchange", onHashChange)

  onResize = () => setupObserver()
  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (onHashChange) window.removeEventListener("hashchange", onHashChange)
  if (onResize) window.removeEventListener("resize", onResize)
})
</script>

<style scoped>
.home{
  padding: 8px 2px 22px;
}

/* ===== STICKY NAV TOP ===== */
.stickyNavTop{
  position: sticky;
  top: 0;
  z-index: 999;
  background: rgba(246,247,249,0.78);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: 10px 2px;
  margin: 6px 0 12px;
}

.tabsTop{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 16px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.tabBtn{
  text-decoration:none;
  font-weight: 1000;
  font-size: 12px;
  padding: 10px 12px;
  border-radius: 999px;
  color: #111;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(245,246,248,0.85);
  transition: transform .12s ease, background .12s ease, border-color .12s ease;
}
.tabBtn:hover{ transform: translateY(-1px); }
.tabBtn.active{
  background: rgba(40,167,69,0.14);
  border-color: rgba(40,167,69,0.28);
  color: #14532d;
}

/* Spacer real para que la última sección suba */
.bottomSpacer{
  height: 320px;
}

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
.heroLeft h1{ margin: 10px 0 0; font-size: 28px; line-height: 1.1; font-weight: 1000; }
.heroLeft p{ margin: 10px 0 0; color: #6b7280; font-weight: 900; font-size: 13px; }

/* ---------- GENERALES ---------- */
.section{ margin-top: 16px; }

/* ---------- BOTONES ---------- */
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap: 8px; padding: 12px 14px; border-radius: 12px;
  text-decoration:none; font-weight: 1000;
  border: 1px solid transparent; cursor: pointer;
}
.btn.primary{
  background:white;
  color: #111;
  border: 1px solid rgba(0,0,0,0.08);
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 12px;
  transition: transform .12s ease, background .12s ease;
}
.btn.primary:hover{ background: #45b748; transform: translateY(-1px); }
.btn.ghost{
  background: white;
  border: 1px solid rgba(0,0,0,0.10);
  color: #111;
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 12px;
}

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

/* ---------- BANNERS ---------- */
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
.bannerNew{ background-image: url("/img/banners/novedades1.png"); }
.bannerPromo{ background-image: url("/img/banners/oferta1.png"); }
.bannerHow{ background-image: url("/img/banners/funcion1.png"); }
.bannerReviews{ background-image: url("/img/banners/opiniones1.png"); }
.bannerCta{ background-image: url("/img/banners/envio1.png"); }
.bannerCats{ background-image: url("/img/banners/categorias1.png"); }

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

  /* En móvil el sticky suele ser más alto, por eso el spacer más grande */
  .bottomSpacer{ height: 420px; }
}
</style>
