<template>
  <div class="page">
    <div class="hero">
      <div class="left">
        <h1 class="t">ResuelveShop</h1>
        <p class="s">Envía combos a tu familia en Cuba. Compra fácil y entrega rápida.</p>

        <div class="actions">
          <router-link class="btn" to="/catalogo">Ver catálogo</router-link>
          <router-link class="btn ghost" to="/account">Mi cuenta</router-link>
        </div>

        <div class="badges">
          <span class="badge">🚚 3–10 días</span>
          <span class="badge">💬 Soporte rápido</span>
          <span class="badge">🔒 Compra segura</span>
        </div>
      </div>

      <div class="right">
        <div class="box">
          <div class="boxTitle">¿Cómo funciona?</div>
          <div class="steps">
            <div class="step">1) Elige un combo</div>
            <div class="step">2) Paga online</div>
            <div class="step">3) Entrega en Cuba</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page{
  padding: 18px 2px 22px;
}

.hero{
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);

  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
}

.t{
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
  letter-spacing: -0.2px;
}

.s{
  margin: 8px 0 0;
  color:#6b7280;
  font-weight: 900;
  font-size: 13px;
}

.actions{
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn{
  display:inline-block;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight: 900;
  padding: 12px 14px;
  border-radius: 12px;
}

.btn.ghost{
  background: white;
  color: #111;
  border: 1px solid #eee;
}

.badges{
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge{
  display:inline-flex;
  align-items:center;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(245,246,248,0.9);
  font-weight: 900;
  font-size: 12px;
}

.right .box{
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(245,246,248,0.9);
  padding: 14px;
}

.boxTitle{
  font-weight: 1000;
  margin-bottom: 10px;
}

.steps{
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.step{
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  padding: 10px;
  font-weight: 900;
  font-size: 12px;
}

/* móvil */
@media (max-width: 900px){
  .hero{
    grid-template-columns: 1fr;
    padding: 14px;
    border-radius: 18px;
  }
  .t{ font-size: 22px; }
}
</style>
