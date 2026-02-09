<template>
  <div class="page">
    <div class="card">
      <div class="head">
        <router-link class="back" to="/account">←</router-link>
        <div>
          <h2>📦 Mis pedidos</h2>
          <p class="muted">Historial de tus compras en ResuelveShop.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state">
        <div class="ico">⏳</div>
        <div class="t1">Cargando pedidos…</div>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="state errBox">
        <div class="ico">⚠️</div>
        <div class="t1">No se pudieron cargar</div>
        <div class="t2">{{ errorMsg }}</div>
        <button class="btn" @click="cargar">Reintentar</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!orders.length" class="state">
        <div class="ico">🧾</div>
        <div class="t1">Aún no tienes pedidos</div>
        <div class="t2">Cuando hagas una compra, aparecerá aquí.</div>
        <router-link class="btn" to="/">Ir a la tienda</router-link>
      </div>

      <!-- List -->
      <div v-else class="list">
        <div v-for="o in orders" :key="o.id" class="order">
          <!-- 👉 Ahora todo el pedido es un link al detalle -->
          <router-link class="order-top" :to="`/account/orders/${o.id}`">
            <div class="left">
              <div class="oid">#{{ shortId(o.id) }}</div>
              <div class="meta">
                <span class="pill" :class="statusClass(o.status)">
                  {{ statusLabel(o.status) }}
                </span>
                <span class="date">{{ formatDate(o.created_at) }}</span>
              </div>
            </div>

            <div class="right">
              <div class="total">{{ money(o.total, o.currency) }}</div>
              <div class="chev">›</div>
            </div>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const loading = ref(true)
const errorMsg = ref("")
const orders = ref([])

function shortId(id) {
  if (!id) return ""
  return String(id).split("-")[0].toUpperCase()
}

function statusLabel(s) {
  const v = (s || "").toLowerCase()
  if (v === "Pagado") return "Pagado"
  if (v === "Pendiente") return "Pendiente"
  if (v === "Cancelado") return "Cancelado"
  return s || "Estado"
}

function statusClass(s) {
  const v = (s || "").toLowerCase()
  if (v === "Pagado") return "ok"
  if (v === "Pendiente") return "warn"
  if (v === "Cancelado") return "bad"
  return ""
}

function formatDate(iso) {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleString("es-ES", { year: "numeric", month: "short", day: "2-digit" })
  } catch {
    return "-"
  }
}

function money(n, cur = "EUR") {
  const num = Number(n || 0)
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: cur }).format(num)
  } catch {
    return `${num.toFixed(2)} ${cur}`
  }
}

async function cargar() {
  loading.value = true
  errorMsg.value = ""

  const { data: u } = await supabase.auth.getUser()
  const user = u.user
  if (!user) {
    router.push({ path: "/login", query: { redirect: "/account/orders" } })
    return
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id,status,total,currency,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  loading.value = false

  if (error) {
    console.error(error)
    errorMsg.value = "Intenta de nuevo en unos segundos."
    return
  }

  orders.value = data || []
}

onMounted(() => {
  cargar()
})
</script>

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
  max-width:680px;
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

/* states */
.state{
  margin-top:12px;
  border:1px dashed #e5e7eb;
  border-radius:16px;
  padding:18px;
  text-align:center;
}
.errBox{
  border-style: solid;
  border-color:#fecaca;
  background:#fff1f2;
}
.ico{ font-size:34px; }
.t1{ font-weight:900; margin-top:6px; }
.t2{ color:#6b7280; font-size:13px; margin-top:6px; }

/* list */
.list{ margin-top:10px; display:grid; gap:12px; }
.order{
  border:1px solid #eee;
  border-radius:16px;
  overflow:hidden;
}

.order-top{
  width:100%;
  padding:14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  text-align:left;
  text-decoration:none;
  color:#111;
  background:white;
}
.order-top:hover{ background:#fafafa; }

.left{ display:flex; flex-direction:column; gap:6px; }
.oid{ font-weight:900; }
.meta{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.date{ color:#6b7280; font-size:12px; font-weight:700; }

.right{ display:flex; align-items:center; gap:10px; }
.total{ font-weight:900; }
.chev{ opacity:.6; font-size:18px; }

/* status pill */
.pill{
  display:inline-flex;
  align-items:center;
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  border:1px solid #eee;
  background:#f3f4f6;
  color:#111;
}
.pill.ok{ background:#ecfdf5; border-color:#bbf7d0; color:#166534; }
.pill.warn{ background:#fffbeb; border-color:#fde68a; color:#92400e; }
.pill.bad{ background:#fff1f2; border-color:#fecaca; color:#991b1b; }

.btn{
  display:inline-block;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight:900;
  padding:12px 14px;
  border-radius:12px;
  border:none;
  cursor:pointer;
}
</style>
