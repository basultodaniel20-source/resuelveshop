<template>
  <section class="direcciones-page">
    <div class="head">
      <h1>Direcciones · Cuba</h1>
      <p>Gestiona tus direcciones de entrega para pedidos dentro de Cuba.</p>
    </div>

    <div class="box">
      <div class="icon">📍</div>
      <h3>Direcciones en preparación</h3>
      <p>
        Aquí podrás guardar y editar direcciones cuando terminemos la parte de perfil
        y checkout de Cuba.
      </p>

      <router-link class="btn" to="/cuba/account">
        Volver a mi cuenta
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.direcciones-page{
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

.box{
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

.box h3{
  margin-top: 14px;
  margin-bottom: 0;
  font-size: 20px;
  font-weight: 1000;
}

.box p{
  margin: 10px auto 0;
  max-width: 620px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.45;
}

.btn{
  display: inline-flex;
  margin-top: 16px;
  padding: 11px 14px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 1000;
  font-size: 12px;
  background: #28a745;
  color: white;
}
</style>