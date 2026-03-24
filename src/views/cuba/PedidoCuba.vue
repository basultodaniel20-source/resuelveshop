<template>
  <section class="orders-page">
    <div class="orders-head">
      <div>
        <p class="eyebrow">Mi cuenta · Cuba</p>
        <h1>Mis pedidos</h1>
        <p class="muted">Aquí verás los pedidos que has enviado desde esta tienda.</p>
      </div>
    </div>

    <div v-if="cargando" class="empty-card">
      <p>Cargando pedidos...</p>
    </div>

    <div v-else-if="pedidos.length === 0" class="empty-card">
      <div class="empty-icon">📦</div>
      <h3>No tienes pedidos todavía</h3>
      <p>Cuando envíes uno por WhatsApp, aparecerá aquí.</p>
      <router-link class="btn primary" to="/cuba/catalogo">
        Ir al catálogo
      </router-link>
    </div>

    <div v-else class="orders-list">
      <article
        v-for="pedido in pedidos"
        :key="pedido.id"
        class="order-card"
      >
        <div class="order-top">
          <div>
            <div class="order-id">{{ pedido.id }}</div>
            <div class="order-date">{{ formatFecha(pedido.fecha) }}</div>
          </div>

          <span class="status">
            {{ pedido.estado || "Pendiente" }}
          </span>
        </div>

        <div class="order-grid">
          <div class="order-block">
            <div class="label">Ubicación</div>
            <div class="value">
              {{ pedido.provincia || "—" }} · {{ pedido.municipio || "—" }}
            </div>
          </div>

          <div class="order-block">
            <div class="label">Total</div>
            <div class="value strong">{{ money(pedido.total) }}</div>
          </div>

          <div class="order-block full">
            <div class="label">Destinatario</div>
            <div class="value">
              {{ pedido.entrega?.nombre || "—" }}
            </div>
          </div>
        </div>

        <div class="products">
          <div
            v-for="item in pedido.productos"
            :key="`${pedido.id}-${item.id}`"
            class="product-row"
          >
            <div class="product-name">{{ item.nombre }}</div>
            <div class="product-meta">
              {{ item.cantidad }} x {{ money(item.precio) }}
            </div>
            <div class="product-total">
              {{ money(item.precio * item.cantidad) }}
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "../../supabase"

const pedidos = ref([])
const cargando = ref(true)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  const todos = JSON.parse(localStorage.getItem("orders_cuba")) || []

  if (!user) {
    pedidos.value = []
    cargando.value = false
    return
  }

  pedidos.value = todos.filter((p) => p.user_id === user.id)
  cargando.value = false
})

function money(value) {
  return `${Number(value || 0).toFixed(2)} €`
}

function formatFecha(value) {
  if (!value) return "—"
  return new Date(value).toLocaleString("es-ES")
}
</script>

<style scoped>
.orders-page{
  padding: 12px 4px 24px;
}

.orders-head{
  margin-bottom: 16px;
}

.eyebrow{
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #16a34a;
}

.orders-head h1{
  margin: 0;
  font-size: 32px;
  line-height: 1.06;
  font-weight: 1000;
  color: #111827;
}

.muted{
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
}

.empty-card{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 22px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.empty-icon{
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 28px;
}

.empty-card h3{
  margin: 0;
  font-size: 22px;
  font-weight: 1000;
}

.empty-card p{
  margin-top: 10px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
}

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
  margin-top: 14px;
}

.btn.primary{
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.orders-list{
  display: grid;
  gap: 14px;
}

.order-card{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.order-top{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.order-id{
  font-size: 14px;
  font-weight: 1000;
  color: #111827;
}

.order-date{
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
}

.status{
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 1000;
}

.order-grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 12px;
  margin-top: 16px;
}

.order-block{
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
}

.order-block.full{
  grid-column: 1 / -1;
}

.label{
  font-size: 12px;
  color: #6b7280;
  font-weight: 900;
}

.value{
  margin-top: 6px;
  font-size: 14px;
  color: #111827;
  font-weight: 900;
}

.value.strong{
  font-size: 18px;
}

.products{
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.product-row{
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eef2f7;
}

.product-name{
  font-size: 14px;
  font-weight: 1000;
  color: #111827;
}

.product-meta{
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
}

.product-total{
  font-size: 14px;
  font-weight: 1000;
  color: #111827;
}

@media (max-width: 640px){
  .orders-head h1{
    font-size: 24px;
  }

  .order-card{
    padding: 14px;
    border-radius: 18px;
  }

  .order-grid{
    grid-template-columns: 1fr;
  }

  .product-row{
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .status{
    font-size: 11px;
    padding: 7px 10px;
  }
}
</style>