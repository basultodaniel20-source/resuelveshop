<template>
  <section class="perfil-page">
    <div class="head">
      <h1>Mi cuenta · Cuba</h1>
      <p>Gestiona tu perfil, direcciones y pedidos de la tienda Cuba.</p>
    </div>

    <div class="grid">
      <router-link class="card" to="/cuba/account/orders">
        <div class="icon">📦</div>
        <div>
          <h3>Mis pedidos</h3>
          <p>Consulta el historial y estado de tus pedidos.</p>
        </div>
      </router-link>

      <router-link class="card" to="/cuba/account/addresses">
        <div class="icon">📍</div>
        <div>
          <h3>Direcciones</h3>
          <p>Gestiona tus direcciones de entrega en Cuba.</p>
        </div>
      </router-link>

      <router-link class="card" to="/cuba/catalogo">
        <div class="icon">🛍️</div>
        <div>
          <h3>Seguir comprando</h3>
          <p>Vuelve al catálogo y descubre más productos.</p>
        </div>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.perfil-page{
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

.grid{
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.card{
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: start;
  text-decoration: none;
  color: inherit;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.icon{
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 24px;
}

.card h3{
  margin: 0;
  font-size: 16px;
  font-weight: 1000;
}

.card p{
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.4;
}
</style>