<template>
  <div class="page">
    <div class="card">
      <div class="topGlow"></div>

      <div class="head">
        <router-link class="back" to="/" aria-label="Volver al inicio">←</router-link>

        <div class="headText">
          <h2>Admin · Pedidos</h2>
          <p class="muted">Gestión de pedidos y seguimiento del negocio.</p>
        </div>

        <button class="refresh" @click="cargar" type="button" aria-label="Recargar pedidos">
          ↻
        </button>
      </div>

      <!-- MÉTRICAS -->
      <div v-if="!loading && !errorMsg" class="stats">
        <div class="statCard">
          <div class="statIcon">📦</div>
          <div class="statText">
            <div class="statLabel">Total pedidos</div>
            <div class="statValue">{{ stats.totalOrders }}</div>
          </div>
        </div>

        <div class="statCard">
          <div class="statIcon warn">🕒</div>
          <div class="statText">
            <div class="statLabel">Pendientes</div>
            <div class="statValue">{{ stats.pendingOrders }}</div>
          </div>
        </div>

        <div class="statCard">
          <div class="statIcon ok">💶</div>
          <div class="statText">
            <div class="statLabel">Ingresos pagados</div>
            <div class="statValue">{{ money(stats.paidRevenue, "EUR") }}</div>
          </div>
        </div>

        <div class="statCard">
          <div class="statIcon info">📅</div>
          <div class="statText">
            <div class="statLabel">Pedidos hoy</div>
            <div class="statValue">{{ stats.todayOrders }}</div>
          </div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="filters">
        <input
          v-model="q"
          class="input"
          placeholder="Buscar: id, user_id, nombre, teléfono, dirección…"
        />

        <select v-model="fStatus" class="select">
          <option value="all">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="Preparado">Preparado</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div v-if="loading" class="state">
        <div class="stateIcon">⏳</div>
        <div class="stateTitle">Cargando pedidos…</div>
      </div>

      <div v-else-if="errorMsg" class="state errBox">
        <div class="stateIcon">⚠️</div>
        <div class="stateTitle">No se pudieron cargar</div>
        <div class="stateSub">{{ errorMsg }}</div>
        <button class="btn" @click="cargar" type="button">Reintentar</button>
      </div>

      <div v-else class="list">
        <div v-if="!filtered.length" class="state">
          <div class="stateIcon">🧾</div>
          <div class="stateTitle">No hay pedidos que coincidan</div>
          <div class="stateSub">Prueba otro filtro o término de búsqueda.</div>
        </div>

        <div v-for="o in filtered" :key="o.id" class="row">
          <div class="left">
            <div class="t1">
              <b class="oid">#{{ shortId(o.id) }}</b>
              <span class="mail">{{ o.user_id }}</span>
            </div>

            <div class="customer">
              <span>{{ o.shipping?.nombre || "Sin nombre" }}</span>
              <span v-if="o.shipping?.telefono">· {{ o.shipping.telefono }}</span>
            </div>

            <div class="t2">
              <span class="pill">{{ formatDate(o.created_at) }}</span>
              <span class="pill money">{{ money(o.total, o.currency) }}</span>
              <span class="pill status" :class="statusClass(o.status)">
                {{ o.status }}
              </span>
            </div>
          </div>

          <div class="right">
            <select class="select mini" v-model="o.status" @change="cambiarEstado(o)">
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Preparado">Preparado</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            <button class="btn ghost" type="button" @click="abrir(o)">
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="modal" class="overlay" @click="cerrar"></div>

    <div v-if="modal" class="modal" role="dialog" aria-modal="true">
      <div class="modal-card" @click.stop>
        <div class="modal-head">
          <div class="mh-left">
            <div class="mh-title">Pedido #{{ shortId(modal.id) }}</div>
            <div class="mh-sub">
              <span class="pill">{{ formatDate(modal.created_at) }}</span>
              <span class="pill money">{{ money(modal.total, modal.currency) }}</span>
              <span class="pill status" :class="statusClass(modal.status)">
                {{ modal.status }}
              </span>
            </div>
          </div>

          <button class="x" @click="cerrar" type="button">✕</button>
        </div>

        <div class="modal-body">
          <!-- Estado -->
          <div class="section">
            <div class="stitle">Estado</div>
            <div class="row2">
              <select class="select" v-model="modal.status" @change="cambiarEstado(modal)">
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Preparado">Preparado</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>

              <div class="mutedSmall">User: {{ modal.user_id }}</div>
            </div>
          </div>

          <!-- Productos -->
          <div class="section">
            <div class="stitle">Productos</div>

            <div class="items" v-if="(modal.items || []).length">
              <div v-for="(it, idx) in modal.items" :key="idx" class="item">
                <router-link
                  class="imgWrap"
                  :to="it?.id ? `/producto/${it.id}` : '/'"
                  title="Ver producto"
                  @click="cerrar"
                >
                  <img v-if="imgFor(it)" :src="imgFor(it)" class="img" />
                  <div v-else class="imgPh">📦</div>
                </router-link>

                <div class="itxt">
                  <div class="iname">
                    <router-link
                      v-if="it?.id"
                      class="plink"
                      :to="`/producto/${it.id}`"
                      @click="cerrar"
                    >
                      {{ it.nombre }}
                    </router-link>
                    <span v-else>{{ it.nombre }}</span>
                  </div>
                  <div class="isub">
                    x{{ it.cantidad }} · {{ money(it.precio, modal.currency) }}
                  </div>
                </div>

                <div class="iline">
                  {{ money((it.precio || 0) * (it.cantidad || 0), modal.currency) }}
                </div>
              </div>
            </div>

            <div v-else class="mutedBox">Sin items guardados.</div>
          </div>

          <!-- Envío -->
          <div class="section">
            <div class="stitle">Envío</div>

            <div class="ship">
              <div><b>Nombre:</b> {{ modal.shipping?.nombre || "-" }}</div>
              <div><b>Teléfono:</b> {{ modal.shipping?.telefono || "-" }}</div>
              <div><b>Dirección:</b> {{ modal.shipping?.direccion || "-" }}</div>
              <div v-if="modal.shipping?.notas"><b>Notas:</b> {{ modal.shipping?.notas }}</div>
            </div>

            <div class="actions">
              <button class="btn ghost" type="button" @click="copiarDireccion(modal)">
                📋 Copiar dirección
              </button>

              <router-link class="btn ghost" :to="`/account/orders/${modal.id}`" @click="cerrar">
                Ver como cliente
              </router-link>
            </div>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn ghost" type="button" @click="cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue"
import { supabase } from "../supabase"
import { productos as productosData } from "../data/productos.js"

const loading = ref(true)
const errorMsg = ref("")
const orders = ref([])

const q = ref("")
const fStatus = ref("all")

const modal = ref(null)

const byId = new Map(productosData.map((p) => [String(p.id), p]))

function imgFor(it) {
  const p = byId.get(String(it?.id))
  return p?.imagen || null
}

function abrir(o) {
  modal.value = JSON.parse(JSON.stringify(o))
}

function cerrar() {
  modal.value = null
}

function onKey(e) {
  if (e.key === "Escape") cerrar()
}

watch(modal, (v) => {
  if (v) window.addEventListener("keydown", onKey)
  else window.removeEventListener("keydown", onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey)
})

function shortId(id) {
  return String(id || "").split("-")[0].toUpperCase()
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

function statusClass(s) {
  const v = String(s || "").toLowerCase()
  if (v === "pagado") return "ok"
  if (v === "pendiente") return "warn"
  if (v === "cancelado") return "bad"
  if (v === "enviado" || v === "entregado" || v === "preparado") return "info"
  return ""
}

const filtered = computed(() => {
  const text = (q.value || "").trim().toLowerCase()

  return (orders.value || [])
    .filter((o) => (fStatus.value === "all" ? true : String(o.status) === fStatus.value))
    .filter((o) => {
      if (!text) return true

      const hay = [
        o.id,
        o.user_id,
        o.status,
        o.shipping?.nombre,
        o.shipping?.telefono,
        o.shipping?.direccion,
        o.shipping?.notas,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return hay.includes(text)
    })
})
const stats = computed(() => {
  const list = orders.value || []
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  let totalOrders = list.length
  let pendingOrders = 0
  let paidOrders = 0
  let deliveredOrders = 0
  let cancelledOrders = 0
  let paidRevenue = 0
  let todayOrders = 0

  for (const o of list) {
    const status = String(o.status || "").toLowerCase()
    const total = Number(o.total || 0)

    if (status === "pendiente") pendingOrders += 1
    if (status === "pagado") paidOrders += 1
    if (status === "entregado") deliveredOrders += 1
    if (status === "cancelado") cancelledOrders += 1

    if (
      status === "pagado" ||
      status === "preparado" ||
      status === "enviado" ||
      status === "entregado"
    ) {
      paidRevenue += total
    }

    if (o.created_at) {
      const d = new Date(o.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (key === todayKey) todayOrders += 1
    }
  }

  const averageTicket = totalOrders ? paidRevenue / totalOrders : 0

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    deliveredOrders,
    cancelledOrders,
    paidRevenue,
    todayOrders,
    averageTicket,
  }
})

async function cargar() {
  loading.value = true
  errorMsg.value = ""

  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,status,total,currency,items,shipping,created_at")
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
    return
  }

  const idx = orders.value.findIndex((x) => x.id === o.id)
  if (idx >= 0) orders.value[idx].status = o.status
}

async function copiarDireccion(o) {
  const s = o?.shipping
  const texto =
    `Nombre: ${s?.nombre || "-"}\n` +
    `Teléfono: ${s?.telefono || "-"}\n` +
    `Dirección: ${s?.direccion || "-"}\n` +
    (s?.notas ? `Notas: ${s.notas}\n` : "")

  try {
    await navigator.clipboard.writeText(texto)
    alert("✅ Dirección copiada")
  } catch {
    const ta = document.createElement("textarea")
    ta.value = texto
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body.removeChild(ta)
    alert("✅ Dirección copiada")
  }
}

onMounted(() => cargar())
</script>

<style scoped>
.page{
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 20px;
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 26%),
    #f5f6f8;
}

.card{
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1100px;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 22px;
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow:
    0 18px 40px rgba(0,0,0,0.08),
    0 6px 16px rgba(0,0,0,0.04);
}

.topGlow{
  position: absolute;
  inset: 0 auto auto 0;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(34,197,94,0.11), transparent 65%);
  pointer-events: none;
}

.head{
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.headText h2{
  margin: 0;
  font-size: 30px;
  line-height: 1.03;
  font-weight: 1000;
  letter-spacing: -0.7px;
  color: #111827;
}

.back{
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg,#f3f4f6,#e9edf2);
  text-decoration: none;
  color: #111;
  font-weight: 900;
  font-size: 20px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
}

.refresh{
  margin-left: auto;
  border: none;
  background: linear-gradient(180deg,#f3f4f6,#e9edf2);
  width: 48px;
  height: 48px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 900;
  font-size: 18px;
  border: 1px solid rgba(0,0,0,0.05);
}

.muted{
  margin: 5px 0 0 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
}

/* stats */
.stats{
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.statCard{
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 20px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow:
    0 8px 20px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.statIcon{
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  font-size: 22px;
  background: rgba(34,197,94,0.10);
  border: 1px solid rgba(34,197,94,0.16);
}

.statIcon.warn{
  background: #fffbeb;
  border-color: #fde68a;
}

.statIcon.ok{
  background: #ecfdf5;
  border-color: #bbf7d0;
}

.statIcon.info{
  background: #eff6ff;
  border-color: #bfdbfe;
}

.statLabel{
  font-size: 13px;
  color: #6b7280;
  font-weight: 800;
}

.statValue{
  margin-top: 4px;
  font-size: 22px;
  line-height: 1;
  font-weight: 1000;
  color: #111827;
}

/* filtros */
.filters{
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.input{
  flex: 1;
  min-width: 260px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  background: white;
}

.select{
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  font-weight: 900;
  background: white;
}

.select.mini{
  padding: 10px 12px;
  border-radius: 12px;
}

/* estados */
.state{
  position: relative;
  z-index: 1;
  margin-top: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
}

.stateIcon{
  font-size: 34px;
}

.stateTitle{
  margin-top: 8px;
  font-size: 18px;
  font-weight: 1000;
  color: #111827;
}

.stateSub{
  margin-top: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
}

.errBox{
  border-style: solid;
  border-color: #fecaca;
  background: linear-gradient(180deg, #fff8f8 0%, #fff1f2 100%);
}

/* lista */
.list{
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
}

.row{
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg,#ffffff,#fbfbfc);
  box-shadow:
    0 8px 20px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform .15s ease, box-shadow .15s ease;
}

.row:hover{
  transform: translateY(-2px);
  box-shadow:
    0 14px 28px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.left{
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.t1{
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.oid{
  font-size: 17px;
}

.mail{
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
  word-break: break-word;
}

.customer{
  color: #374151;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.3;
}

.t2{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.right{
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}

/* pills */
.pill{
  display: inline-flex;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #eee;
  font-size: 12px;
  font-weight: 900;
}

.pill.money{
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #166534;
}

.pill.status.ok{
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #166534;
}

.pill.status.warn{
  background: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.pill.status.bad{
  background: #fff1f2;
  border-color: #fecaca;
  color: #991b1b;
}

.pill.status.info{
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

/* botones */
.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg,#2fd160,#24b04f);
  color: white;
  font-weight: 900;
  padding: 11px 14px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  box-shadow:
    0 10px 20px rgba(34,197,94,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.btn.ghost{
  background: white;
  color: #111;
  border: 1px solid #e5e7eb;
  box-shadow: none;
}

/* modal */
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 7000;
}

.modal{
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 8000;
  padding: 18px;
}

.modal-card{
  width: 100%;
  max-width: 780px;
  background: white;
  border-radius: 22px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.35);
  overflow: hidden;
}

.modal-head{
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.mh-title{
  font-weight: 1000;
  font-size: 17px;
}

.mh-sub{
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.x{
  border: none;
  background: #f3f4f6;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 900;
}

.modal-body{
  padding: 16px;
  background: #fcfcfd;
  display: grid;
  gap: 14px;
  max-height: 70vh;
  overflow: auto;
}

.section{
  background: white;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 14px;
}

.stitle{
  font-weight: 1000;
  margin-bottom: 10px;
}

.row2{
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.mutedSmall{
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
}

.modal-foot{
  padding: 14px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

/* items */
.items{
  display: grid;
  gap: 10px;
}

.item{
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
}

.imgWrap{
  width: 56px;
  height: 56px;
  border-radius: 14px;
  border: 1px solid #eee;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: white;
  text-decoration: none;
}

.img{
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.imgPh{
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.itxt{
  min-width: 0;
}

.iname{
  font-weight: 1000;
}

.plink{
  color: #111;
  text-decoration: none;
}

.plink:hover{
  text-decoration: underline;
}

.isub{
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
}

.iline{
  font-weight: 1000;
  white-space: nowrap;
}

.mutedBox{
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  color: #6b7280;
  font-weight: 800;
}

.ship{
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.ship b{
  font-weight: 1000;
}

.actions{
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* móvil */
@media (max-width: 900px){
  .stats{
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px){
  .page{
    padding: 14px;
  }

  .card{
    padding: 16px;
    border-radius: 22px;
  }

  .head{
    align-items: flex-start;
  }

  .headText h2{
    font-size: 24px;
  }

  .muted{
    font-size: 13px;
  }

  .row{
    flex-direction: column;
    align-items: flex-start;
  }

  .right{
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .stats{
    grid-template-columns: 1fr;
  }

  .item{
    grid-template-columns: 52px 1fr;
  }

  .iline{
    grid-column: 2 / 3;
  }
}
</style>