<template>
  <div class="page">
    <div class="card">
      <div class="head">
        <router-link class="back" to="/account/orders">←</router-link>
        <div class="htext">
          <h2>Pedido #{{ shortId(order?.id) }}</h2>
          <p class="muted" v-if="order">
            <span class="pill" :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
            <span class="dot">•</span>
            {{ formatDate(order.created_at) }}
          </p>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="state">⏳ Cargando…</div>
      <div v-else-if="errorMsg" class="state errBox">⚠️ {{ errorMsg }}</div>

      <template v-else-if="order">
        <!-- Resumen -->
        <div class="summary">
          <div class="sumRow">
            <span>Total</span>
            <b>{{ money(order.total, order.currency) }}</b>
          </div>
        </div>

        <!-- Productos -->
        <div class="section">
          <div class="stitle">Productos</div>

          <div class="items">
            <div v-for="(it, idx) in (order.items || [])" :key="idx" class="item">
              <!-- ✅ Foto clicable al detalle del producto -->
              <router-link
                class="imgWrap"
                :to="`/producto/${it.id}`"
                :title="it.nombre"
              >
                <img v-if="it.imagen" :src="it.imagen" class="img" />
                <div v-else class="imgPlaceholder">🛍️</div>
              </router-link>

              <div class="itxt">
                <!-- ✅ Nombre clicable también -->
                <router-link class="iname" :to="`/producto/${it.id}`">
                  {{ it.nombre }}
                </router-link>
                <div class="isub">
                  x{{ it.cantidad }} · {{ money(it.precio, order.currency) }}
                </div>
              </div>

              <div class="iline">
                {{ money((it.precio || 0) * (it.cantidad || 0), order.currency) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Envío -->
        <div class="section">
          <div class="stitle">Envío</div>
          <div class="ship">
            <div><b>Nombre:</b> {{ order.shipping?.nombre || "-" }}</div>
            <div><b>Teléfono:</b> {{ order.shipping?.telefono || "-" }}</div>
            <div><b>Dirección:</b> {{ order.shipping?.direccion || "-" }}</div>
            <div v-if="order.shipping?.notas"><b>Notas:</b> {{ order.shipping?.notas }}</div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="actions">
  <button class="btn" type="button" @click="repetirCompra">
    🔁 Repetir compra
  </button>

  <router-link class="btn ghost" to="/">Seguir comprando</router-link>
</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { supabase } from "../supabase"

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMsg = ref("")
const order = ref(null)

function shortId(id) {
  if (!id) return ""
  return String(id).split("-")[0].toUpperCase()
}

function statusLabel(s) {
  const v = (s || "").toLowerCase()
  if (v === "paid") return "Pagado"
  if (v === "pending") return "Pendiente"
  if (v === "cancelled") return "Cancelado"
  return s || "Estado"
}

function statusClass(s) {
  const v = (s || "").toLowerCase()
  if (v === "paid") return "ok"
  if (v === "pending") return "warn"
  if (v === "cancelled") return "bad"
  return ""
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

function repetirCompra() {
  if (!order.value?.items?.length) return

  const actual = JSON.parse(localStorage.getItem("carrito") || "[]")

  // Mapa para sumar cantidades por id
  const map = new Map(actual.map((p) => [String(p.id), { ...p }]))

  for (const it of order.value.items) {
    const id = String(it.id)
    const existing = map.get(id)

    if (existing) {
      existing.cantidad = (existing.cantidad || 0) + (it.cantidad || 0)
      map.set(id, existing)
    } else {
      map.set(id, {
        id: it.id,
        nombre: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
        imagen: it.imagen || null,
      })
    }
  }

  localStorage.setItem("carrito", JSON.stringify(Array.from(map.values())))
  window.dispatchEvent(new Event("carrito-actualizado"))
  router.push("/carrito")
}

onMounted(async () => {
  loading.value = true
  errorMsg.value = ""

  const { data: u } = await supabase.auth.getUser()
  if (!u.user) {
    router.push({ path: "/login", query: { redirect: route.fullPath } })
    return
  }

  const id = route.params.id

    // ✅ detectar si soy admin
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", u.user.id)
    .single()

  const isAdmin = !!prof?.is_admin

  // ✅ Si soy admin, puedo ver cualquier pedido (no filtro por user_id)
  let q = supabase
    .from("orders")
    .select("id,status,total,currency,items,shipping,created_at,user_id")
    .eq("id", id)

  // ✅ Si NO soy admin, solo veo mis pedidos
  if (!isAdmin) q = q.eq("user_id", u.user.id)

  const { data, error } = await q.single()


  loading.value = false

  if (error || !data) {
    console.error(error)
    errorMsg.value = "No se encontró el pedido o no tienes acceso."
    return
  }

  order.value = data
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
  max-width:760px;
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
.htext h2{ margin:0; }
.muted{ margin:6px 0 0 0; color:#6b7280; font-size:13px; display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.dot{ opacity:.5; }

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

.summary{
  border:1px solid #eee;
  border-radius:14px;
  padding:12px;
  margin-top:10px;
  background:#fcfcfd;
}
.sumRow{ display:flex; justify-content:space-between; align-items:center; font-weight:900; }

.section{
  margin-top:12px;
  border:1px solid #eee;
  border-radius:14px;
  padding:12px;
}
.stitle{ font-weight:900; margin-bottom:10px; }

.items{ display:grid; gap:10px; }
.item{
  display:grid;
  grid-template-columns: 54px 1fr auto;
  gap:10px;
  align-items:center;
}
.imgWrap{
  width:54px; height:54px;
  border-radius:14px;
  border:1px solid #eee;
  background:#fff;
  display:grid;
  place-items:center;
  overflow:hidden;
  text-decoration:none;
}
.img{
  width:100%;
  height:100%;
  object-fit:contain;
}
.imgPlaceholder{ font-size:22px; opacity:.7; }

.itxt{ min-width:0; }
.iname{
  font-weight:900;
  color:#111;
  text-decoration:none;
}
.iname:hover{ text-decoration:underline; }
.isub{ color:#6b7280; font-size:12px; margin-top:2px; }

.iline{ font-weight:900; white-space:nowrap; }

.ship{
  display:grid;
  gap:6px;
  font-size:14px;
}
.ship b{ font-weight:900; }

.actions{
  margin-top:12px;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}
.btn{
  display:inline-block;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight:900;
  padding:12px 14px;
  border-radius:12px;
  border:none;
}
.btn.ghost{
  background:white;
  color:#111;
  border:1px solid #eee;
}
</style>
