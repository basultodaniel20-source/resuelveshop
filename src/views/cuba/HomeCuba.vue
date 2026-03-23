<template>
  <div class="homeCuba">
    <!-- HERO -->
    <section class="hero">
      <div class="heroCard">
        <div class="heroLeft">
          <div class="kicker">🇨🇺 ResuelveShop Cuba</div>
          <h1>Productos útiles y demandados para Cuba</h1>
          <p>
            Muy pronto podrás encontrar ropa, relojes, accesorios, gym, calzado
            y más productos pensados para entregas en Cuba.
          </p>

          <div class="heroBadges">
            <span class="badge">🛍️ Nuevas categorías</span>
            <span class="badge">🇨🇺 Pensado para Cuba</span>
            <span class="badge">⚡ Próximamente</span>
          </div>

         <div class="heroActions">
        <router-link class="btn primary" to="/cuba/catalogo">
        Ver catálogo
       </router-link>
       <a class="btn ghost" :href="whatsLink" target="_blank" rel="noreferrer">
        Pedir información
       </a>
        <router-link class="btn ghost" to="/">Cambiar opción</router-link>
       </div>
        </div>

        <div class="heroRight">
          <div class="heroMini">
            <div class="miniCard">
              <div class="miniTitle">Muy pronto</div>
              <div class="miniText">Ropa, relojes, gym, zapatos y accesorios.</div>
            </div>

            <div class="miniCard soft">
              <div class="miniTitle">Objetivo</div>
              <div class="miniText">
                Crear una tienda moderna para productos que cuesta encontrar.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORÍAS VISUALES -->
    <section class="section">
      <div class="sectionHead">
        <h2>Categorías que llegarán</h2>
        <p>Base inicial para la nueva línea Cuba</p>
      </div>

      <div class="catsGrid">
        <div class="catCard">
          <div class="catIcon">⌚</div>
          <div class="catTitle">Relojes</div>
          <div class="catText">Modelos deportivos, casuales y para regalo.</div>
        </div>

        <div class="catCard">
          <div class="catIcon">👟</div>
          <div class="catTitle">Calzado</div>
          <div class="catText">Tenis, zapatos urbanos y opciones cómodas.</div>
        </div>

        <div class="catCard">
          <div class="catIcon">👕</div>
          <div class="catTitle">Ropa</div>
          <div class="catText">Camisetas, conjuntos, básicos y más.</div>
        </div>

        <div class="catCard">
          <div class="catIcon">🏋️</div>
          <div class="catTitle">Gym</div>
          <div class="catText">Accesorios para entrenamiento y fitness.</div>
        </div>

        <div class="catCard">
          <div class="catIcon">🕶️</div>
          <div class="catTitle">Accesorios</div>
          <div class="catText">Gafas, cadenas, gorras y detalles útiles.</div>
        </div>

        <div class="catCard">
          <div class="catIcon">🎁</div>
          <div class="catTitle">Regalos</div>
          <div class="catText">Opciones pensadas para sorprender y resolver.</div>
        </div>
      </div>
    </section>

    <!-- BANNER -->
    <section class="section">
      <div class="banner bannerMain">
        <div class="bannerOverlay"></div>

        <div class="bannerContent">
          <div class="bannerText">
            <h2>Una nueva forma de comprar para Cuba</h2>
            <p>
              Estamos construyendo una experiencia más moderna, clara y útil para
              encontrar productos que realmente hacen falta.
            </p>

            <a class="btn primary white" :href="whatsLink" target="_blank" rel="noreferrer">
              Avisarme cuando esté lista
            </a>
          </div>

          <div class="bannerFloat">🚀 Nueva línea</div>
        </div>
      </div>
    </section>

    <!-- BLOQUES -->
    <section class="section infoGrid">
      <div class="infoCard">
        <div class="infoTitle">Qué estamos preparando</div>
        <ul class="infoList">
          <li>Catálogo propio para Cuba</li>
          <li>Nuevas categorías y banners</li>
          <li>Productos diferenciados del área internacional</li>
          <li>Experiencia más clara y enfocada</li>
        </ul>
      </div>

      <div class="infoCard soft">
        <div class="infoTitle">Mientras tanto</div>
        <p class="infoText">
          Puedes escribirnos por WhatsApp para consultar disponibilidad, ideas de
          productos o encargos personalizados.
        </p>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="section finalCta">
      <div class="finalCard">
        <h2>Estamos construyendo algo grande para Cuba</h2>
        <p>
          Esta sección será independiente de la parte internacional y tendrá su
          propio estilo, categorías y productos.
        </p>

        <div class="finalActions">
       <router-link class="btn primary" to="/cuba/catalogo">
        Ir al catálogo
       </router-link>
       <a class="btn ghost" :href="whatsLink" target="_blank" rel="noreferrer">
       Contactar por WhatsApp
       </a>
       <router-link class="btn ghost" to="/">Volver al selector</router-link>
       </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue"

const whatsPhone = "34624569359"

const whatsLink = computed(() =>
  `https://wa.me/${whatsPhone}?text=${encodeURIComponent(
    "Hola! Quiero información sobre la nueva sección de ResuelveShop Cuba."
  )}`
)
</script>

<style scoped>
.homeCuba{
  padding: 10px 2px 24px;
}

/* HERO */
.hero{
  margin: 10px 0 16px;
}

.heroCard{
  border-radius: 24px;
  padding: 22px;
  border: 1px solid rgba(0,0,0,0.06);
  background:
    radial-gradient(900px 260px at 15% 0%, rgba(40,167,69,0.16), transparent 60%),
    radial-gradient(750px 260px at 95% 35%, rgba(16,185,129,0.12), transparent 60%),
    #ffffff;
  box-shadow: 0 18px 40px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: center;
}

.kicker{
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(40,167,69,0.10);
  color: #166534;
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 12px;
  font-weight: 1000;
}

.heroLeft h1{
  margin: 14px 0 0;
  font-size: 38px;
  line-height: 1.05;
  font-weight: 1000;
  letter-spacing: -0.4px;
}

.heroLeft p{
  margin: 12px 0 0;
  max-width: 720px;
  color: #6b7280;
  font-weight: 900;
  font-size: 14px;
  line-height: 1.5;
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
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.82);
  font-weight: 900;
  font-size: 12px;
}

.heroActions{
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.heroMini{
  display: grid;
  gap: 12px;
}

.miniCard{
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.miniCard.soft{
  background: rgba(245,246,248,0.92);
}

.miniTitle{
  font-weight: 1000;
  font-size: 15px;
}

.miniText{
  margin-top: 8px;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
  line-height: 1.4;
}

/* SECTION HEAD */
.section{
  margin-top: 16px;
}

.sectionHead h2{
  margin: 0;
  font-size: 26px;
  font-weight: 1000;
}

.sectionHead p{
  margin-top: 8px;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
}

/* CATS */
.catsGrid{
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.catCard{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.catIcon{
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 24px;
}

.catTitle{
  margin-top: 12px;
  font-size: 16px;
  font-weight: 1000;
}

.catText{
  margin-top: 6px;
  color: #6b7280;
  font-weight: 900;
  font-size: 13px;
  line-height: 1.4;
}

/* BANNER */
.banner{
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  min-height: 220px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 16px 36px rgba(0,0,0,0.06);
}

.bannerMain{
  background:
    radial-gradient(circle at 20% 20%, rgba(40,167,69,0.30), transparent 25%),
    radial-gradient(circle at 80% 30%, rgba(16,185,129,0.22), transparent 22%),
    linear-gradient(135deg, #0f172a, #1f2937 55%, #14532d);
}

.bannerOverlay{
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.30),
    rgba(0,0,0,0.08)
  );
}

.bannerContent{
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 220px;
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
}

.bannerText h2{
  margin: 0;
  color: white;
  font-size: 32px;
  line-height: 1.05;
  font-weight: 1000;
}

.bannerText p{
  margin-top: 12px;
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  font-weight: 900;
  max-width: 640px;
  line-height: 1.45;
}

.bannerFloat{
  align-self: start;
  background: rgba(255,255,255,0.92);
  color: #111;
  border-radius: 16px;
  padding: 10px 14px;
  font-weight: 1000;
  font-size: 14px;
}

/* INFO GRID */
.infoGrid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.infoCard{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.infoCard.soft{
  background: rgba(245,246,248,0.9);
}

.infoTitle{
  font-size: 15px;
  font-weight: 1000;
}

.infoList{
  margin: 10px 0 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.5;
}

.infoText{
  margin-top: 10px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.45;
}

/* FINAL CTA */
.finalCard{
  background:
    radial-gradient(700px 220px at 15% 0%, rgba(40,167,69,0.16), transparent 60%),
    #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
  text-align: center;
}

.finalCard h2{
  margin: 0;
  font-size: 30px;
  line-height: 1.08;
  font-weight: 1000;
}

.finalCard p{
  margin: 12px auto 0;
  max-width: 760px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.45;
}

.finalActions{
  margin-top: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* BUTTONS */
.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 1000;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 12px;
}

.btn.primary{
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.btn.primary.white{
  background: white;
  color: #111;
  border-color: rgba(255,255,255,0.35);
}

.btn.ghost{
  background: white;
  color: #111;
  border: 1px solid rgba(0,0,0,0.10);
}

/* RESPONSIVE */
@media (max-width: 900px){
  .heroCard{
    grid-template-columns: 1fr;
    padding: 16px;
    border-radius: 20px;
  }

  .heroLeft h1{
    font-size: 26px;
  }

  .heroLeft p{
    font-size: 13px;
  }

  .catsGrid{
    grid-template-columns: 1fr;
  }

  .bannerContent{
    grid-template-columns: 1fr;
    min-height: 220px;
  }

  .bannerText h2{
    font-size: 24px;
  }

  .bannerText p{
    font-size: 13px;
  }

  .infoGrid{
    grid-template-columns: 1fr;
  }

  .finalCard h2{
    font-size: 24px;
  }

  .finalCard p{
    font-size: 13px;
  }

  .heroActions,
  .finalActions{
    flex-direction: column;
    align-items: stretch;
  }
}
</style>