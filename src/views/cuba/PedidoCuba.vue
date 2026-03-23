<template>
  <section class="pedidos-page">
    <div class="head">
      <h1>Mis pedidos · Cuba</h1>
      <p>Aquí verás el historial de pedidos realizados en la tienda Cuba.</p>
    </div>

    <div class="estado">
      <div class="icon">📦</div>
      <h3>Aún no hay pedidos conectados</h3>
      <p>
        Esta sección está lista para mostrar tus pedidos cuando conectemos el flujo
        completo de checkout de Cuba.
      </p>

      <div class="actions">
        <router-link class="btn primary" to="/cuba/catalogo">
          Ir al catálogo
        </router-link>
        <router-link class="btn ghost" to="/cuba/account">
          Volver a mi cuenta
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pedidos-page{
  padding: 12px 4px 24px;
}

.head h1{
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
}

.head p{
  margin-top: 8px;
  color: #6b7280;
  font-weight: 900;
}

.estado{
  margin-top: 18px;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.icon{
  width: 64px;
  height: 64px;
  margin: 0 auto;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 28px;
}

.estado h3{
  margin-top: 14px;
  margin-bottom: 0;
  font-size: 20px;
  font-weight: 1000;
}

.estado p{
  margin: 10px auto 0;
  max-width: 620px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.45;
}

.actions{
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 14px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 1000;
  font-size: 12px;
}

.btn.primary{
  background: #28a745;
  color: white;
}

.btn.ghost{
  background: white;
  color: #111;
  border: 1px solid rgba(0,0,0,0.10);
}
</style>