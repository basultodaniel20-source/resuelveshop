<template>
  <div class="page">
    <div class="card">
      <div class="head">
        <router-link class="back" to="/account">←</router-link>
        <div>
          <h2>📦 Mis pedidos</h2>
          <p class="muted">Aquí verás tus pedidos cuando activemos el historial.</p>
        </div>
      </div>

      <div class="empty">
        <div class="ico">🧾</div>
        <div class="t1">Próximamente</div>
        <div class="t2">En el siguiente paso te conecto los pedidos reales.</div>
        <router-link class="btn" to="/">Volver a la tienda</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page{
  min-height: calc(100vh - 140px);
  display:grid;
  place-items:center;
  padding:18px;
  background:#f5f6f8;
}
.card{
  width:100%;
  max-width:520px;
  background:white;
  border-radius:16px;
  padding:18px;
  box-shadow:0 10px 28px rgba(0,0,0,0.08);
}
.head{
  display:flex;
  gap:12px;
  align-items:flex-start;
  margin-bottom:12px;
}
.back{
  width:42px;
  height:42px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:#f3f4f6;
  text-decoration:none;
  color:#111;
  font-weight:900;
}
h2{ margin:0; }
.muted{ margin:4px 0 0 0; color:#6b7280; font-size:13px; }

.empty{
  margin-top:12px;
  border:1px dashed #e5e7eb;
  border-radius:16px;
  padding:18px;
  text-align:center;
}
.ico{ font-size:34px; }
.t1{ font-weight:900; margin-top:6px; }
.t2{ color:#6b7280; font-size:13px; margin-top:6px; }

.btn{
  display:inline-block;
  margin-top:12px;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight:900;
  padding:12px 14px;
  border-radius:12px;
}
</style>
