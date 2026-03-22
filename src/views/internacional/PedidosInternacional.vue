<template>
  <div class="page">
    <div class="card orders-card">
      <div class="topGlow"></div>

      <div class="head">
        <router-link class="back" to="/account" aria-label="Volver a mi cuenta">←</router-link>

        <div class="headText">
          <h2>Mis pedidos</h2>
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
      <div v-else-if="!orders.length" class="state emptyBox">
        <div class="ico">🧾</div>
        <div class="t1">Aún no tienes pedidos</div>
        <div class="t2">Cuando hagas una compra, aparecerá aquí.</div>
        <router-link class="btn" to="/">Ir a la tienda</router-link>
      </div>

      <!-- List -->
      <div v-else class="list">
        <div v-for="o in orders" :key="o.id" class="order">
          <router-link class="order-top" :to="`/account/orders/${o.id}`">
            <div class="left">
              <div class="oid">Pedido #{{ shortId(o.id) }}</div>

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
import { supabase } from "../../supabase"

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
  if (v === "pagado") return "Pagado"
  if (v === "pendiente") return "Pendiente"
  if (v === "cancelado") return "Cancelado"
  if (v === "preparado") return "Preparado"
  return s || "Estado"
}

function statusClass(s) {
  const v = (s || "").toLowerCase()
  if (v === "pagado") return "ok"
  if (v === "pendiente") return "warn"
  if (v === "cancelado") return "bad"
  if (v === "preparado") return "info"
  return ""
}

function formatDate(iso) {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  } catch {
    return "-"
  }
}

function money(n, cur = "EUR") {
  const num = Number(n || 0)
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: cur,
    }).format(num)
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
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
  display: block;
  padding: 18px;
  padding-top: 0;
  min-height: auto;
}

.orders-card{
  position: relative;
  overflow: hidden;
}

.topGlow{
  position: absolute;
  inset: 0 auto auto 0;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(34,197,94,0.11), transparent 65%);
  pointer-events: none;
}

.card{
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 24px;
  padding: 22px;
  box-shadow:
    0 18px 40px rgba(0,0,0,0.08),
    0 6px 16px rgba(0,0,0,0.04);
}

.head{
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.back{
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f3f4f6 0%, #e9edf2 100%);
  text-decoration: none;
  color: #111827;
  font-weight: 1000;
  font-size: 24px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
  transition: transform .16s ease, box-shadow .16s ease;
}

.back:hover{
  transform: translateY(-1px);
  box-shadow:
    0 10px 20px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,0.85);
}

.headText h2{
  margin: 0;
  font-size: 30px;
  line-height: 1.03;
  font-weight: 1000;
  letter-spacing: -0.7px;
  color: #111827;
}

.muted{
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
  max-width: 420px;
}

/* states */
.state{
  position: relative;
  z-index: 1;
  margin-top: 14px;
  border-radius: 20px;
  padding: 26px 20px;
  text-align: center;
  border: 1px solid rgba(0,0,0,0.06);
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
  box-shadow:
    0 8px 20px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.emptyBox{
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
}

.errBox{
  border-color: rgba(239,68,68,0.16);
  background: linear-gradient(180deg, #fff8f8 0%, #fff1f2 100%);
}

.ico{
  font-size: 36px;
}

.t1{
  margin-top: 8px;
  font-weight: 1000;
  font-size: 18px;
  color: #111827;
}

.t2{
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  margin-top: 8px;
  font-weight: 700;
}

/* list */
.list{
  position: relative;
  z-index: 1;
  margin-top: 14px;
  display: grid;
  gap: 14px;
}

.order{
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
  box-shadow:
    0 8px 20px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}

.order:hover{
  transform: translateY(-2px);
  box-shadow:
    0 14px 28px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.order-top{
  width: 100%;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  text-align: left;
  text-decoration: none;
  color: #111;
  background: transparent;
}

.left{
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.oid{
  font-weight: 1000;
  font-size: 17px;
  line-height: 1.1;
  color: #111827;
}

.meta{
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.date{
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.right{
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.total{
  font-weight: 1000;
  font-size: 18px;
  color: #111827;
}

.chev{
  opacity: .45;
  font-size: 24px;
  line-height: 1;
  font-weight: 1000;
}

/* status pill */
.pill{
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
  border: 1px solid #eee;
  background: #f3f4f6;
  color: #111;
  letter-spacing: .1px;
}

.pill.ok{
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #166534;
}

.pill.warn{
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.pill.bad{
  background: #fff1f2;
  border-color: #fecaca;
  color: #991b1b;
}

.pill.info{
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  min-height: 48px;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  text-decoration: none;
  font-weight: 1000;
  font-size: 15px;
  padding: 12px 18px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  box-shadow:
    0 14px 28px rgba(34,197,94,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);
  transition: transform .16s ease, box-shadow .16s ease;
}

.btn:hover{
  transform: translateY(-1px);
  box-shadow:
    0 18px 34px rgba(34,197,94,0.34),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

@media (min-width: 900px){
  .page{
    padding-top: 18px;
    padding-bottom: 20px;
  }

  .card{
    padding: 26px;
  }

  .headText h2{
    font-size: 34px;
  }
}

@media (max-width: 640px){
  .card{
    border-radius: 22px;
    padding: 18px;
  }

  .head{
    gap: 12px;
  }

  .back{
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 14px;
    font-size: 22px;
  }

  .headText h2{
    font-size: 24px;
  }

  .muted{
    font-size: 13px;
  }

  .state{
    padding: 22px 16px;
    border-radius: 18px;
  }

  .t1{
    font-size: 16px;
  }

  .t2{
    font-size: 13px;
  }

  .order{
    border-radius: 18px;
  }

  .order-top{
    padding: 14px;
    gap: 10px;
    align-items: flex-start;
  }

  .oid{
    font-size: 15px;
  }

  .date{
    font-size: 12px;
  }

  .pill{
    font-size: 11px;
    padding: 5px 10px;
  }

  .right{
    gap: 8px;
  }

  .total{
    font-size: 15px;
  }

  .chev{
    font-size: 20px;
  }

  .btn{
    min-height: 46px;
    border-radius: 14px;
    font-size: 14px;
    padding: 11px 16px;
  }
}
</style>