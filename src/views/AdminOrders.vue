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

      <!-- Filtros -->
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
          <option value="Preparando">Preparando</option>
          <option value="Enviando">Enviado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div v-if="loading" class="state">⏳ Cargando…</div>

      <div v-else-if="errorMsg" class="state errBox">
        ⚠️ {{ errorMsg }}
      </div>

      <div v-else class="list">
        <div v-if="!filtered.length" class="state">
          No hay pedidos que coincidan.
        </div>

        <div v-for="o in filtered" :key="o.id" class="row">
          <div class="left">
            <div class="t1">
              <b>#{{ shortId(o.id) }}</b>
              <span class="mail">{{ o.user_id }}</span>
            </div>

            <div class="t2">
              <span class="pill">{{ formatDate(o.created_at) }}</span>
              <span class="pill money">{{ money(o.total, o.currency) }}</span>
              <span class="pill status" :class="statusClass(o.status)">{{ o.status }}</span>
            </div>
          </div>

          <div class="right">
            <select class="select mini" v-model="o.status" @change="cambiarEstado(o)">
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Preparado">Preparando</option>
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
              <span class="pill status" :class="statusClass(modal.status)">{{ modal.status }}</span>
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
                <option value="Preparando">Preparando</option>
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
                  <!-- ✅ ahora usa imgFor(it) -->
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

// catálogo local por id (para recuperar imagen si no viene en items)
const byId = new Map(productosData.map((p) => [String(p.id), p]))

function imgFor(it) {
  const p = byId.get(String(it?.id))
  return p?.imagen || null
}

function abrir(o) {
  modal.value = JSON.parse(JSON.stringify(o)) // copia para que el modal sea estable
}

function cerrar() {
  modal.value = null
}

// Cerrar con ESC
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

function statusClass(s) {
  const v = (s || "").toLowerCase()
  if (v === "Pagado") return "ok"
  if (v === "Pendiente") return "warn"
  if (v === "Cancelado") return "bad"
  if (v === "Enviado" || v === "delivered") return "info"
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
  const { error } = await supabase.from("orders").update({ status: o.status }).eq("id", o.id)

  if (error) {
    console.error(error)
    alert("No se pudo actualizar el estado")
    return
  }

  // sincroniza lista
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
  display:grid;
  place-items:center;
  padding:18px;
  background:#f5f6f8;
}
.card{
  width:100%;
  max-width:980px;
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

.filters{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin: 10px 0 12px 0;
}
.input{
  flex:1;
  min-width: 240px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
}
.select{
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-weight: 900;
  background: white;
}
.select.mini{
  padding: 10px 10px;
  border-radius: 12px;
  font-weight: 900;
}

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
.left{ display:flex; flex-direction:column; gap:6px; }
.t1{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.mail{ color:#6b7280; font-size:12px; font-weight:800; }
.t2{ display:flex; gap:8px; flex-wrap:wrap; }

.right{ display:flex; gap:10px; align-items:center; }

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
.pill.status.ok{ background:#ecfdf5; border-color:#bbf7d0; color:#166534; }
.pill.status.warn{ background:#fffbeb; border-color:#fde68a; color:#92400e; }
.pill.status.bad{ background:#fff1f2; border-color:#fecaca; color:#991b1b; }
.pill.status.info{ background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }

.btn{
  display:inline-block;
  background:#28a745;
  color:white;
  text-decoration:none;
  font-weight:900;
  padding:10px 12px;
  border-radius:12px;
  border:none;
  cursor:pointer;
}
.btn.ghost{
  background:white;
  color:#111;
  border:1px solid #eee;
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
  display:grid;
  place-items:center;
  z-index: 8000;
  padding: 16px;
}
.modal-card{
  width: 100%;
  max-width: 760px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
  overflow: hidden;
}
.modal-head{
  padding: 14px 14px;
  border-bottom: 1px solid #eee;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 10px;
}
.mh-title{ font-weight: 900; font-size: 16px; }
.mh-sub{ margin-top: 6px; display:flex; gap:8px; flex-wrap:wrap; }
.x{
  border:none;
  background:#f3f4f6;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor:pointer;
  font-weight: 900;
}
.modal-body{
  padding: 14px;
  background:#fcfcfd;
  display:grid;
  gap: 12px;
  max-height: 70vh;
  overflow:auto;
}
.section{
  background:white;
  border:1px solid #eee;
  border-radius: 14px;
  padding: 12px;
}
.stitle{ font-weight: 900; margin-bottom: 10px; }
.row2{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.mutedSmall{ color:#6b7280; font-size: 12px; font-weight: 800; }
.modal-foot{
  padding: 12px 14px;
  border-top: 1px solid #eee;
  display:flex;
  justify-content:flex-end;
}

/* items */
.items{ display:grid; gap:10px; }
.item{
  display:grid;
  grid-template-columns: 54px 1fr auto;
  gap: 10px;
  align-items:center;
}
.imgWrap{
  width:54px; height:54px;
  border-radius: 14px;
  border:1px solid #eee;
  overflow:hidden;
  display:grid;
  place-items:center;
  background:white;
  text-decoration:none;
}
.img{ width:54px; height:54px; object-fit:contain; }
.imgPh{ width:54px; height:54px; display:grid; place-items:center; font-size:20px; }

.itxt{ min-width:0; }
.iname{ font-weight: 900; }
.plink{ color:#111; text-decoration:none; }
.plink:hover{ text-decoration:underline; }
.isub{ color:#6b7280; font-size:12px; margin-top:2px; }
.iline{ font-weight: 900; white-space:nowrap; }

.mutedBox{
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  color:#6b7280;
  font-weight: 800;
}

.ship{ display:grid; gap:6px; font-size:14px; }
.ship b{ font-weight: 900; }
.actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
</style>
