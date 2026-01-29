<template>
  <div class="page">
    <div class="card">
      <div class="head">
        <router-link class="back" to="/">←</router-link>
        <div>
          <h2>🛠️ Admin · Pedidos</h2>
          <p class="muted">Gestión de pedidos (solo admin).</p>
        </div>
        <button class="refresh" @click="cargar" type="button">↻</button>
      </div>

      <div v-if="loading" class="state">⏳ Cargando…</div>

      <div v-else-if="errorMsg" class="state errBox">
        ⚠️ {{ errorMsg }}
      </div>

      <div v-else class="list">
        <div v-if="!orders.length" class="state">
          No hay pedidos todavía.
        </div>

        <div v-for="o in orders" :key="o.id" class="row">
          <div class="left">
            <div class="t1">
              <b>#{{ shortId(o.id) }}</b>
              <span class="mail">{{ o.user_id }}</span>
            </div>

            <div class="t2">
              <span class="pill">{{ formatDate(o.created_at) }}</span>
              <span class="pill money">{{ money(o.total, o.currency) }}</span>
            </div>
          </div>

          <div class="right">
            <select class="select" v-model="o.status" @change="cambiarEstado(o)">
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="preparing">preparing</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>

            <router-link class="btn ghost" :to="`/account/orders/${o.id}`">
              Ver
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "../supabase"

const loading = ref(true)
const errorMsg = ref("")
const orders = ref([])

function shortId(id) {
  return String(id || "").split("-")[0].toUpperCase()
}
function formatDate(iso) {
  if (!iso) return "-"
  const d = new Date(iso)
  return d.toLocaleString("es-ES", { year: "numeric", month: "short", day: "2-digit" })
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

  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,status,total,currency,created_at")
    .order("created_at", { ascending: false })

  loading.value = false

  if (error) {
    console.error(error)
    errorMsg.value = "No tienes permisos o falló la carga."
    return
  }

  orders.value = data || []
}

async function cambiarEstado(o) {
  const { error } = await supabase
    .from("orders")
    .update({ status: o.status })
    .eq("id", o.id)

  if (error) {
    console.error(error)
    alert("No se pudo actualizar el estado")
  }
}

onMounted(() => cargar())
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
  max-width:900px;
  background:white;
  border-radius:16px;
  padding:18px;
  box-shadow:0 10px 28px rgba(0,0,0,0.08);
}
.head{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:12px;
}
.back{
  width:42px; height:42px;
  border-radius:12px;
  display:grid; place-items:center;
  background:#f3f4f6;
  text-decoration:none;
  color:#111; font-weight:900;
}
.refresh{
  margin-left:auto;
  border:none;
  background:#f3f4f6;
  width:42px; height:42px;
  border-radius:12px;
  cursor:pointer;
  font-weight:900;
}
.muted{ margin:4px 0 0 0; color:#6b7280; font-size:13px; }

.state{
  margin-top:12px;
  border:1px dashed #e5e7eb;
  border-radius:16px;
  padding:18px;
  text-align:center;
}

.errBox{
  border-style:solid;
  border-color:#fecaca;
  background:#fff1f2;
  color:#991b1b;
  font-weight:900;
}

.list{ display:grid; gap:12px; margin-top:10px; }

.row{
  border:1px solid #eee;
  border-radius:16px;
  padding:14px;
  display:flex;
  gap:12px;
  align-items:center;
  justify-content:space-between;
}

.t1{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.mail{ color:#6b7280; font-size:12px; font-weight:800; }
.t2{ margin-top:6px; display:flex; gap:8px; flex-wrap:wrap; }

.pill{
  display:inline-flex;
  padding:4px 10px;
  border-radius:999px;
  background:#f3f4f6;
  border:1px solid #eee;
  font-size:12px;
  font-weight:900;
}
.pill.money{ background:#ecfdf5; border-color:#bbf7d0; color:#166534; }

.right{ display:flex; gap:10px; align-items:center; }
.select{
  padding:10px 12px;
  border-radius:12px;
  border:1px solid #e5e7eb;
  font-weight:900;
}
.btn{
  display:inline-block;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight:900;
  padding:10px 12px;
  border-radius:12px;
  border:none;
}
.btn.ghost{
  background:white;
  color:#111;
  border:1px solid #eee;
}
</style>
