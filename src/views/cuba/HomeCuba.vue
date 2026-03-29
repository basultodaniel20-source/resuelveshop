<template>
  <StoreLayout>
    <div class="homeCuba">
      <!-- HERO -->
      <section class="hero">
        <div class="heroCard">
          <div class="heroContent">
            <div class="heroTop">
              <span class="heroTag">🇨🇺 ResuelveShop Cuba</span>
              <span class="heroMiniTag">Compra fácil y directa</span>
            </div>

            <h1>
              Productos seleccionados para Cuba
              <span>en una tienda clara, visual y cómoda</span>
            </h1>

            <p class="heroText">
              Encuentra ropa, relojes, accesorios, gym, calzado y más,
              organizados para que comprar sea más rápido, más simple y mucho
              más cómodo.
            </p>

            <div class="heroStats">
              <div class="statCard">
                <strong>+6</strong>
                <span>Categorías destacadas</span>
              </div>

              <div class="statCard">
                <strong>Compra</strong>
                <span>Más clara y visual</span>
              </div>

              <div class="statCard">
                <strong>Soporte</strong>
                <span>Atención directa</span>
              </div>
            </div>

            <div class="heroActions">
              <router-link class="btn primary" to="/cuba/catalogo">
                Ver catálogo
              </router-link>

              <a
                class="btn secondary"
                :href="whatsLink"
                target="_blank"
                rel="noreferrer"
              >
                Pedir información
              </a>
            </div>

            <div class="heroTrust">
              <span>✔ Productos útiles</span>
              <span>✔ Enfoque Cuba</span>
              <span>✔ Atención rápida</span>
            </div>
          </div>

          <div class="heroVisual">
            <div class="heroMainBanner">
             <img
                :src="heroMainImg"
                 alt="Banner principal ResuelveShop Cuba"
                 class="heroPhotoReal"
                 />

              <div class="heroOverlayCard">
                <div class="overlayLabel">Destacados</div>
                <div class="overlayTitle">Ropa, relojes, gym y accesorios</div>
                <div class="overlayText">
                  Una selección organizada para encontrar productos útiles con más facilidad.
                </div>
              </div>
            </div>

            <div class="heroMiniBanners">
              <div class="miniBanner">
                <img
                    :src="heroMiniCatImg"
                    alt="Categoría destacada"
                    class="miniBannerReal"
                    />
              </div>

              <div class="miniBanner">
                <img
                    :src="heroMiniPromoImg"
                    alt="Promoción destacada"
                    class="miniBannerReal"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CATEGORÍAS -->
      <section class="section">
        <div class="sectionHead">
          <h2>Categorías destacadas</h2>
          <p>Explora productos organizados para encontrar lo que buscas más rápido</p>
        </div>

        <div class="catsGrid">
          <article v-for="cat in categorias" :key="cat.title" class="catCard">
            <div class="catIcon">{{ cat.icon }}</div>
            <div class="catTitle">{{ cat.title }}</div>
            <div class="catText">{{ cat.text }}</div>
          </article>
        </div>
      </section>

      <!-- BANNERS COMERCIALES -->
      <section class="section">
        <div class="promoGrid">
          <article class="promoBanner dark">
            <div class="promoMedia">
              <img
                  :src="promoBannerOneImg"
                  alt="Banner promocional 1"
                  class="promoBannerReal"
              />
            </div>

            <div class="promoContent">
              <span class="promoTag">Selección Cuba</span>
              <h3>Compra productos con una experiencia más clara y directa</h3>
              <p>
                Una tienda pensada para mostrar mejor cada categoría y ayudarte a decidir más rápido.
              </p>
              <router-link class="btn light" to="/cuba/catalogo">
                Explorar productos
              </router-link>
            </div>
          </article>

          <article class="promoBanner light">
            <div class="promoContent">
              <span class="promoTag green">Atención directa</span>
              <h3>Consulta disponibilidad o recibe ayuda por WhatsApp</h3>
              <p>
                Si necesitas orientación, productos concretos o información adicional, puedes escribirnos directamente.
              </p>
              <a
                class="btn ghost"
                :href="whatsLink"
                target="_blank"
                rel="noreferrer"
              >
                Contactar ahora
              </a>
            </div>

            <div class="promoMedia">
              <img
                  :src="promoBannerTwoImg"
                  alt="Banner promocional 2"
                  class="promoBannerReal"
              />
            </div>
          </article>
        </div>
      </section>

      <!-- BENEFICIOS -->
      <section class="section">
        <div class="sectionHead">
          <h2>Por qué comprar aquí</h2>
          <p>Una tienda pensada para transmitir claridad, confianza y comodidad</p>
        </div>

        <div class="benefitsGrid">
          <article
            v-for="benefit in beneficios"
            :key="benefit.title"
            class="benefitCard"
          >
            <div class="benefitIcon">{{ benefit.icon }}</div>
            <div class="benefitTitle">{{ benefit.title }}</div>
            <p class="benefitText">{{ benefit.text }}</p>
          </article>
        </div>
      </section>

      <!-- CÓMO FUNCIONA -->
      <section class="section">
        <div class="howCard">
          <div class="sectionHead center">
            <h2>Cómo funciona</h2>
            <p>Una compra más simple desde que entras hasta que eliges tu pedido</p>
          </div>

          <div class="stepsGrid">
            <article v-for="step in pasos" :key="step.number" class="stepCard">
              <div class="stepNumber">{{ step.number }}</div>
              <div class="stepTitle">{{ step.title }}</div>
              <div class="stepText">{{ step.text }}</div>
            </article>
          </div>
        </div>
      </section>

      <!-- BLOQUES INFORMATIVOS -->
      <section class="section infoGrid">
        <div class="infoCard">
          <div class="infoTitle">Lo que encontrarás aquí</div>
          <ul class="infoList">
            <li>Catálogo visual y bien organizado</li>
            <li>Productos seleccionados para Cuba</li>
            <li>Categorías más claras y fáciles de explorar</li>
            <li>Compra más cómoda y directa</li>
            <li>Atención rápida cuando la necesites</li>
          </ul>
        </div>

        <div class="infoCard soft">
          <div class="infoTitle">Atención personalizada</div>
          <p class="infoText">
            Escríbenos para consultar disponibilidad, aclarar dudas o recibir ayuda
            para encontrar el producto que necesitas.
          </p>

          <div class="infoActions">
            <a
              class="btn secondary"
              :href="whatsLink"
              target="_blank"
              rel="noreferrer"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="section">
        <div class="finalCard">
          <div class="finalText">
            <span class="finalTag">ResuelveShop Cuba</span>
            <h2>Todo lo que necesitas para Cuba, en un solo lugar</h2>
            <p>
              Explora una tienda más clara, visual y enfocada en productos útiles,
              con una experiencia de compra más cómoda y atención directa.
            </p>
          </div>

          <div class="finalActions">
            <router-link class="btn primary" to="/cuba/catalogo">
              Ir al catálogo
            </router-link>

            <a
              class="btn ghost"
              :href="whatsLink"
              target="_blank"
              rel="noreferrer"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>
    </div>
  </StoreLayout>
</template>

<script setup>
import { computed } from "vue"
import StoreLayout from "@/layouts/StoreLayout.vue"

import heroMainImg from "@/assets/cuba/home/hero-main.png"
import heroMiniCatImg from "@/assets/cuba/home/mini-cat.png"
import heroMiniPromoImg from "@/assets/cuba/home/mini-promo.png"
import promoBannerOneImg from "@/assets/cuba/home/banner-1.png"
import promoBannerTwoImg from "@/assets/cuba/home/banner-2.png"

const whatsPhone = "34624569359"

const whatsLink = computed(() =>
  `https://wa.me/${whatsPhone}?text=${encodeURIComponent(
    "Hola, quiero información sobre productos de ResuelveShop Cuba."
  )}`
)

const categorias = [
  {
    icon: "⌚",
    title: "Relojes",
    text: "Modelos deportivos, casuales y de regalo para diferentes estilos."
  },
  {
    icon: "👟",
    title: "Calzado",
    text: "Opciones cómodas, urbanas y versátiles para uso diario."
  },
  {
    icon: "👕",
    title: "Ropa",
    text: "Prendas básicas, funcionales y fáciles de combinar."
  },
  {
    icon: "🏋️",
    title: "Gym",
    text: "Accesorios y artículos fitness para entrenamiento y bienestar."
  },
  {
    icon: "🕶️",
    title: "Accesorios",
    text: "Complementos útiles para elevar cualquier compra."
  },
  {
    icon: "🎁",
    title: "Regalos",
    text: "Opciones prácticas y visuales para sorprender."
  }
]

const beneficios = [
  {
    icon: "🧭",
    title: "Compra más clara",
    text: "Navegación organizada para encontrar productos más rápido."
  },
  {
    icon: "✨",
    title: "Mejor presentación",
    text: "Diseño visual más limpio y más cómodo para explorar."
  },
  {
    icon: "🎯",
    title: "Enfoque Cuba",
    text: "Selección pensada para necesidades reales y productos útiles."
  },
  {
    icon: "💬",
    title: "Atención directa",
    text: "Canal rápido para resolver dudas o consultar disponibilidad."
  }
]

const pasos = [
  {
    number: "01",
    title: "Explora la tienda",
    text: "Revisa las categorías y descubre productos de forma visual y cómoda."
  },
  {
    number: "02",
    title: "Elige lo que necesitas",
    text: "Compara opciones, revisa detalles y añade al carrito."
  },
  {
    number: "03",
    title: "Continúa tu compra",
    text: "Avanza con tu pedido o consulta directamente por WhatsApp."
  }
]
</script>

<style scoped>
.homeCuba {
  padding: 10px 4px 28px;
}

/* HERO */
.hero {
  margin: 10px 0 18px;
}

.heroCard {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 18px;
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background:
    radial-gradient(900px 320px at 8% 0%, rgba(34, 197, 94, 0.14), transparent 55%),
    radial-gradient(700px 260px at 95% 30%, rgba(16, 185, 129, 0.1), transparent 55%),
    linear-gradient(180deg, #ffffff, #fbfcfd);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.heroTop {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.heroTag,
.heroMiniTag {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.heroTag {
  background: rgba(34, 197, 94, 0.1);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.16);
}

.heroMiniTag {
  background: rgba(15, 23, 42, 0.05);
  color: #334155;
  border: 1px solid rgba(15, 23, 42, 0.07);
}

.heroContent h1 {
  margin: 16px 0 0;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  line-height: 0.98;
  font-weight: 1000;
  letter-spacing: -0.05em;
  color: #0f172a;
  max-width: 760px;
}

.heroContent h1 span {
  display: block;
  color: #16a34a;
}

.heroText {
  margin: 14px 0 0;
  max-width: 720px;
  color: #667085;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.65;
}

.heroStats {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  max-width: 640px;
}

.statCard {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.statCard strong {
  display: block;
  font-size: 18px;
  font-weight: 1000;
  color: #0f172a;
}

.statCard span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.heroActions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.heroTrust {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #475467;
  font-size: 12px;
  font-weight: 700;
}

/* HERO VISUAL */
.heroVisual {
  display: grid;
  gap: 12px;
}

.heroMainBanner {
  position: relative;
  min-height: 380px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background:
    radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.16), transparent 22%),
    radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.14), transparent 20%),
    linear-gradient(135deg, #0f172a, #1e293b 62%, #14532d);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
}

.heroPhotoPlaceholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
}

.heroPhotoPlaceholder span {
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px dashed rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.06);
}

.heroOverlayCard {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 18px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.overlayLabel {
  font-size: 12px;
  font-weight: 800;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.overlayTitle {
  margin-top: 8px;
  font-size: 19px;
  line-height: 1.15;
  font-weight: 1000;
  color: #111827;
}

.overlayText {
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

.heroMiniBanners {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.miniBanner {
  min-height: 128px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #f8fafc;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
}

.miniBannerPhoto {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  background:
    linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04)),
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.45),
      rgba(255,255,255,0.45) 12px,
      rgba(255,255,255,0.65) 12px,
      rgba(255,255,255,0.65) 24px
    );
}

/* GENERAL */
.section {
  margin-top: 18px;
}

.sectionHead h2 {
  margin: 0;
  font-size: 30px;
  line-height: 1.05;
  font-weight: 1000;
  color: #111827;
}

.sectionHead p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #6b7280;
  font-weight: 700;
}

.sectionHead.center {
  text-align: center;
}

/* CATEGORIES */
.catsGrid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.catCard {
  padding: 18px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.catCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  border-color: rgba(34, 197, 94, 0.14);
}

.catIcon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.14);
  font-size: 24px;
}

.catTitle {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.catText {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

/* PROMO BANNERS */
.promoGrid {
  display: grid;
  gap: 14px;
}

.promoBanner {
  display: grid;
  grid-template-columns: minmax(260px, 0.95fr) minmax(0, 1.05fr);
  gap: 16px;
  align-items: center;
  padding: 18px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.05);
}

.promoBanner.dark {
  background:
    radial-gradient(circle at 15% 20%, rgba(34, 197, 94, 0.18), transparent 24%),
    linear-gradient(135deg, #0f172a, #1e293b 68%, #14532d);
  color: white;
}

.promoBanner.light {
  background:
    radial-gradient(circle at 90% 10%, rgba(34, 197, 94, 0.1), transparent 22%),
    #ffffff;
}

.promoBanner.light {
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
}

.promoMedia {
  min-height: 220px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255,255,255,0.08);
}

.promoPhotoPlaceholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  background:
    linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.04),
      rgba(255,255,255,0.04) 14px,
      rgba(255,255,255,0.08) 14px,
      rgba(255,255,255,0.08) 28px
    );
}

.lightPlaceholder {
  color: #64748b;
  background:
    linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.04)),
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.5),
      rgba(255,255,255,0.5) 12px,
      rgba(255,255,255,0.68) 12px,
      rgba(255,255,255,0.68) 24px
    );
}

.promoTag {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.16);
}

.promoTag.green {
  background: rgba(34, 197, 94, 0.1);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.14);
}

.promoContent h3 {
  margin: 12px 0 0;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.05;
  font-weight: 1000;
}

.promoContent p {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
}

.promoBanner.dark .promoContent p {
  color: rgba(255,255,255,0.88);
}

.promoBanner.light .promoContent h3 {
  color: #111827;
}

.promoBanner.light .promoContent p {
  color: #6b7280;
}

.promoContent .btn {
  margin-top: 16px;
}

/* BENEFITS */
.benefitsGrid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.benefitCard {
  padding: 18px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
}

.benefitIcon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(34, 197, 94, 0.1);
  font-size: 22px;
}

.benefitTitle {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.benefitText {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

/* HOW */
.howCard {
  padding: 22px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
}

.stepsGrid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stepCard {
  padding: 18px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.stepNumber {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: #16a34a;
}

.stepTitle {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.stepText {
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

/* INFO */
.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.infoCard {
  padding: 18px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
}

.infoCard.soft {
  background: rgba(248, 250, 252, 0.95);
}

.infoTitle {
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.infoList {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
}

.infoText {
  margin-top: 10px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;
}

.infoActions {
  margin-top: 14px;
}

/* FINAL */
.finalCard {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 24px;
  border-radius: 24px;
  background:
    radial-gradient(700px 220px at 12% 0%, rgba(34, 197, 94, 0.12), transparent 60%),
    #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);
}

.finalTag {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.1);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.14);
  font-size: 12px;
  font-weight: 800;
}

.finalText h2 {
  margin: 12px 0 0;
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  line-height: 1.04;
  font-weight: 1000;
  color: #111827;
}

.finalText p {
  margin: 10px 0 0;
  max-width: 720px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
}

.finalActions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 148px;
  height: 44px;
  padding: 0 16px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  transition: transform 0.14s ease, box-shadow 0.14s ease, background 0.14s ease, border-color 0.14s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn.primary {
  background: linear-gradient(180deg, #2fc354, #28a745);
  color: #fff;
  border-color: rgba(40, 167, 69, 0.9);
  box-shadow: 0 12px 22px rgba(40, 167, 69, 0.2);
}

.btn.primary:hover {
  box-shadow: 0 14px 24px rgba(40, 167, 69, 0.24);
}

.btn.secondary {
  background: #fff;
  color: #111827;
  border-color: rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.btn.secondary:hover,
.btn.ghost:hover,
.btn.light:hover {
  background: #f8fafc;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.94);
  color: #111827;
  border-color: rgba(15, 23, 42, 0.08);
}

.btn.light {
  background: rgba(255, 255, 255, 0.96);
  color: #111827;
  border-color: rgba(255, 255, 255, 0.18);
}

/* RESPONSIVE */
@media (max-width: 980px) {
  .heroCard,
  .finalCard,
  .promoBanner,
  .promoBanner.light {
    grid-template-columns: 1fr;
  }

  .catsGrid,
  .benefitsGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .infoGrid,
  .stepsGrid {
    grid-template-columns: 1fr;
  }

  .finalActions {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .homeCuba {
    padding: 8px 2px 22px;
  }

  .heroCard,
  .howCard,
  .finalCard,
  .infoCard,
  .catCard,
  .benefitCard,
  .promoBanner {
    border-radius: 22px;
  }

  .heroCard,
  .finalCard,
  .howCard,
  .promoBanner {
    padding: 18px;
  }

  .heroContent h1 {
    font-size: 2.2rem;
  }

  .heroStats {
    grid-template-columns: 1fr;
  }

  .heroMiniBanners,
  .catsGrid,
  .benefitsGrid {
    grid-template-columns: 1fr;
  }

  .heroMainBanner {
    min-height: 300px;
  }

  .promoMedia {
    min-height: 180px;
  }

  .sectionHead h2,
  .promoContent h3,
  .finalText h2 {
    font-size: 24px;
  }

  .heroActions,
  .finalActions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    min-width: 0;
  }
}
.heroPhotoReal,
.miniBannerReal,
.promoBannerReal {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.heroPhotoReal {
  object-position: center;
}

.miniBannerReal {
  object-position: center;
}

.promoBannerReal {
  object-position: center;
}
</style>