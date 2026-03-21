<template>
  <div class="page">
    <div class="addresses-wrap">
      <div class="hero-card">
        <div class="topGlow"></div>

        <div class="head hero-head">
          <div class="head-left">
            <router-link class="back" to="/account" aria-label="Volver a mi cuenta">←</router-link>

            <div class="headText">
              <p class="eyebrow">Mi cuenta · Direcciones</p>
              <h2>Mis direcciones</h2>
              <p class="muted">
                Gestiona tu dirección de facturación y varias direcciones de entrega de forma
                rápida, clara y profesional.
              </p>
            </div>
          </div>

          <button class="addBtn" type="button" @click="abrirNuevaEntrega">
            <span>+</span>
            Añadir dirección
          </button>
        </div>
      </div>

      <div class="address-grid">
        <section class="card address-card billing-card">
          <div class="sectionHead">
            <div>
              <p class="badge billing">Facturación</p>
              <h3>Dirección de facturación</h3>
              <p class="sectionMuted">Se usa para facturas y datos del comprador.</p>
            </div>
            <button class="miniBtn" type="button" @click="editandoFacturacion = !editandoFacturacion">
              {{ editandoFacturacion ? 'Cerrar' : 'Editar' }}
            </button>
          </div>

          <div v-if="!editandoFacturacion" class="addressPreview">
            <h4>{{ billingForm.nombre || 'Sin nombre' }}</h4>
            <p>{{ billingForm.telefono || 'Sin teléfono' }}</p>
            <p class="preline">{{ billingForm.direccion || 'Sin dirección guardada' }}</p>
            <div class="pillRow">
              <span class="pill primary">Predeterminada</span>
            </div>
          </div>

          <form v-else class="form" @submit.prevent="guardarFacturacion">
            <div class="field">
              <label>Nombre completo</label>
              <input v-model="billingForm.nombre" placeholder="Tu nombre" required />
            </div>

            <div class="field">
              <label>Teléfono</label>
              <input v-model="billingForm.telefono" placeholder="Tu teléfono" required />
            </div>

            <div class="field">
              <label>Dirección</label>
              <textarea
                v-model="billingForm.direccion"
                placeholder="Dirección completa"
                rows="4"
                required
              />
            </div>

            <button class="btn" type="submit" :disabled="savingBilling">
              <span v-if="savingBilling" class="spinner" aria-hidden="true"></span>
              {{ savingBilling ? "Guardando..." : "Guardar facturación" }}
            </button>
          </form>
        </section>

        <section class="card address-card shipping-card">
          <div class="sectionHead shippingTop">
            <div>
              <p class="badge shipping">Entregas</p>
              <h3>Direcciones de entrega</h3>
              <p class="sectionMuted">
                Aquí puedes agregar, modificar o eliminar direcciones de destinatarios.
              </p>
            </div>
            <div class="counter">{{ shippingAddresses.length }} guardadas</div>
          </div>

          <div v-if="loadingShipping" class="emptyState">Cargando direcciones...</div>

          <div v-else-if="!shippingAddresses.length" class="emptyState">
            <strong>Aún no tienes direcciones de entrega.</strong>
            <span>Añade la primera para usarla más rápido en el checkout.</span>
          </div>

          <div v-else class="shippingList">
            <article
              v-for="item in shippingAddresses"
              :key="item.id"
              class="shippingItem"
              :class="{ active: item.predeterminada }"
            >
              <div class="shippingItemHead">
                <div>
                  <h4>{{ item.alias || 'Dirección de entrega' }}</h4>
                  <p class="recipient">{{ item.nombre }}</p>
                </div>

                <span v-if="item.predeterminada" class="pill success">Principal</span>
              </div>

              <div class="shippingBody">
                <p>{{ item.telefono }}</p>
                <p class="preline">{{ item.direccion }}</p>
              </div>

              <div class="shippingActions">
                <button class="miniBtn" type="button" @click="editarEntrega(item)">Editar</button>
                <button
                  class="miniBtn"
                  type="button"
                  @click="marcarPredeterminada(item)"
                  :disabled="item.predeterminada || savingShipping"
                >
                  Principal
                </button>
                <button
                  class="miniBtn danger"
                  type="button"
                  @click="eliminarEntrega(item.id)"
                  :disabled="savingShipping"
                >
                  Eliminar
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <div v-if="showShippingModal" class="modalOverlay" @click.self="cerrarModalEntrega">
        <div class="modalCard">
          <div class="sectionHead modalHead">
            <div>
              <p class="badge shipping">Entrega</p>
              <h3>{{ shippingForm.id ? 'Editar dirección' : 'Nueva dirección de entrega' }}</h3>
              <p class="sectionMuted">Guarda destinatarios reales como en una tienda online profesional.</p>
            </div>
            <button class="miniBtn" type="button" @click="cerrarModalEntrega">Cerrar</button>
          </div>

          <form class="modalForm" @submit.prevent="guardarEntrega">
            <div class="field half">
              <label>Alias</label>
              <input v-model="shippingForm.alias" placeholder="Ej: Mamá Villa Clara" required />
            </div>

            <div class="field half">
              <label>Nombre del destinatario</label>
              <input v-model="shippingForm.nombre" placeholder="Nombre completo" required />
            </div>

            <div class="field half">
              <label>Teléfono</label>
              <input v-model="shippingForm.telefono" placeholder="Teléfono" required />
            </div>

            <div class="field full">
              <label>Dirección</label>
              <textarea
                v-model="shippingForm.direccion"
                placeholder="Dirección completa de entrega"
                rows="4"
                required
              />
            </div>

            <label class="checkRow full">
              <input v-model="shippingForm.predeterminada" type="checkbox" />
              <span>Marcar como dirección principal de entrega</span>
            </label>

            <button class="btn" type="submit" :disabled="savingShipping">
              <span v-if="savingShipping" class="spinner" aria-hidden="true"></span>
              {{ savingShipping ? 'Guardando...' : (shippingForm.id ? 'Actualizar dirección' : 'Guardar dirección') }}
            </button>
          </form>
        </div>
      </div>

      <p class="ok globalMsg" v-if="okMsg">{{ okMsg }}</p>
      <p class="err globalMsg" v-if="errMsg">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const user = ref(null)
const savingBilling = ref(false)
const savingShipping = ref(false)
const loadingShipping = ref(false)
const okMsg = ref("")
const errMsg = ref("")
const editandoFacturacion = ref(false)
const showShippingModal = ref(false)

const billingForm = ref({
  nombre: "",
  telefono: "",
  direccion: "",
})

const shippingAddresses = ref([])

const shippingForm = ref({
  id: null,
  alias: "",
  nombre: "",
  telefono: "",
  direccion: "",
  predeterminada: false,
})

onMounted(async () => {
  const { data: u } = await supabase.auth.getUser()
  user.value = u.user

  if (!user.value) {
    router.push("/login")
    return
  }

  await cargarFacturacion()
  await cargarEntregas()
})

async function cargarFacturacion() {
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion")
    .eq("id", user.value.id)
    .single()

  if (!error && data) {
    billingForm.value.nombre = data.nombre || ""
    billingForm.value.telefono = data.telefono || ""
    billingForm.value.direccion = data.direccion || ""
  }
}

async function cargarEntregas() {
  loadingShipping.value = true

  const { data, error } = await supabase
    .from("shipping_addresses")
    .select("id, alias, nombre, telefono, direccion, predeterminada")
    .eq("user_id", user.value.id)
    .order("predeterminada", { ascending: false })
    .order("created_at", { ascending: false })

  loadingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudieron cargar las direcciones de entrega."
    return
  }

  shippingAddresses.value = data || []
}

async function guardarFacturacion() {
  if (!user.value) return

  savingBilling.value = true
  limpiarMensajes()

  const payload = {
    id: user.value.id,
    email: user.value.email,
    nombre: billingForm.value.nombre,
    telefono: billingForm.value.telefono,
    direccion: billingForm.value.direccion,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })

  savingBilling.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo guardar la facturación. Intenta de nuevo."
    return
  }

  okMsg.value = "✅ Dirección de facturación guardada"
  editandoFacturacion.value = false
  clearSuccess()
}

function abrirNuevaEntrega() {
  shippingForm.value = {
    id: null,
    alias: "",
    nombre: "",
    telefono: billingForm.value.telefono || "",
    direccion: "",
    predeterminada: shippingAddresses.value.length === 0,
  }
  showShippingModal.value = true
}

function editarEntrega(item) {
  shippingForm.value = {
    id: item.id,
    alias: item.alias || "",
    nombre: item.nombre || "",
    telefono: item.telefono || "",
    direccion: item.direccion || "",
    predeterminada: !!item.predeterminada,
  }
  showShippingModal.value = true
}

function cerrarModalEntrega() {
  showShippingModal.value = false
}

async function guardarEntrega() {
  if (!user.value) return

  savingShipping.value = true
  limpiarMensajes()

  if (shippingForm.value.predeterminada) {
    const { error: resetError } = await supabase
      .from("shipping_addresses")
      .update({ predeterminada: false })
      .eq("user_id", user.value.id)

    if (resetError) {
      savingShipping.value = false
      console.error(resetError)
      errMsg.value = "No se pudo actualizar la dirección principal."
      return
    }
  }

  const payload = {
    user_id: user.value.id,
    alias: shippingForm.value.alias,
    nombre: shippingForm.value.nombre,
    telefono: shippingForm.value.telefono,
    direccion: shippingForm.value.direccion,
    predeterminada: shippingForm.value.predeterminada,
    updated_at: new Date().toISOString(),
  }

  let error

  if (shippingForm.value.id) {
    const response = await supabase
      .from("shipping_addresses")
      .update(payload)
      .eq("id", shippingForm.value.id)
      .eq("user_id", user.value.id)

    error = response.error
  } else {
    const response = await supabase
      .from("shipping_addresses")
      .insert(payload)

    error = response.error
  }

  savingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo guardar la dirección de entrega."
    return
  }

  okMsg.value = shippingForm.value.id
    ? "✅ Dirección de entrega actualizada"
    : "✅ Nueva dirección añadida"

  showShippingModal.value = false
  await cargarEntregas()
  clearSuccess()
}

async function marcarPredeterminada(item) {
  if (!user.value || item.predeterminada) return

  savingShipping.value = true
  limpiarMensajes()

  const { error: resetError } = await supabase
    .from("shipping_addresses")
    .update({ predeterminada: false })
    .eq("user_id", user.value.id)

  if (resetError) {
    savingShipping.value = false
    console.error(resetError)
    errMsg.value = "No se pudo cambiar la dirección principal."
    return
  }

  const { error } = await supabase
    .from("shipping_addresses")
    .update({ predeterminada: true, updated_at: new Date().toISOString() })
    .eq("id", item.id)
    .eq("user_id", user.value.id)

  savingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo marcar como principal."
    return
  }

  okMsg.value = "✅ Dirección principal actualizada"
  await cargarEntregas()
  clearSuccess()
}

async function eliminarEntrega(id) {
  if (!user.value) return

  const confirmar = window.confirm("¿Seguro que quieres eliminar esta dirección?")
  if (!confirmar) return

  savingShipping.value = true
  limpiarMensajes()

  const { error } = await supabase
    .from("shipping_addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.value.id)

  savingShipping.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo eliminar la dirección."
    return
  }

  okMsg.value = "✅ Dirección eliminada"
  await cargarEntregas()
  clearSuccess()
}

function limpiarMensajes() {
  okMsg.value = ""
  errMsg.value = ""
}

function clearSuccess() {
  setTimeout(() => {
    okMsg.value = ""
  }, 2500)
}
</script>

<style scoped>
.page{
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
  display:block;
  padding:18px;
  padding-top:0;
  min-height:auto;
}

.addresses-wrap{
  width:100%;
  max-width:1160px;
  margin:0 auto;
}

.hero-card{
  position:relative;
  overflow:hidden;
  margin:0 auto 18px;
}

.topGlow{
  position:absolute;
  inset:0 auto auto 0;
  width:260px;
  height:260px;
  background: radial-gradient(circle, rgba(34,197,94,0.11), transparent 65%);
  pointer-events:none;
}

.card,
.hero-card,
.modalCard{
  background:rgba(255,255,255,0.94);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,0.65);
  border-radius:24px;
  box-shadow:
    0 18px 40px rgba(0,0,0,0.08),
    0 6px 16px rgba(0,0,0,0.04);
}

.hero-card{
  padding:22px;
}

.address-grid{
  display:grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap:18px;
  align-items:start;
}

.address-card{
  position:relative;
  overflow:hidden;
  padding:22px;
}

.head,
.sectionHead,
.shippingItemHead,
.shippingActions,
.pillRow,
.hero-head{
  position:relative;
  z-index:1;
  display:flex;
  gap:14px;
  align-items:flex-start;
  justify-content:space-between;
}

.head-left{
  display:flex;
  gap:14px;
  align-items:flex-start;
}

.back{
  width:48px;
  height:48px;
  flex:0 0 48px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:linear-gradient(180deg, #f3f4f6 0%, #e9edf2 100%);
  text-decoration:none;
  color:#111827;
  font-weight:1000;
  font-size:24px;
  border:1px solid rgba(0,0,0,0.05);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.85);
  transition:transform .16s ease, box-shadow .16s ease;
}

.back:hover{
  transform:translateY(-1px);
  box-shadow:
    0 10px 20px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,0.85);
}

.eyebrow,
.badge{
  margin:0 0 8px;
  font-size:12px;
  font-weight:1000;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.eyebrow{ color:#16a34a; }
.badge.billing{ color:#2563eb; }
.badge.shipping{ color:#16a34a; }

.headText h2,
.sectionHead h3{
  margin:0;
  color:#111827;
}

.headText h2{
  font-size:30px;
  line-height:1.03;
  font-weight:1000;
  letter-spacing:-0.7px;
}

.muted,
.sectionMuted{
  margin:6px 0 0;
  color:#6b7280;
  font-size:14px;
  line-height:1.45;
  font-weight:700;
}

.addBtn,
.btn,
.miniBtn{
  border:none;
  cursor:pointer;
  transition:transform .16s ease, box-shadow .16s ease, filter .16s ease;
}

.addBtn{
  min-height:50px;
  padding:0 18px;
  border-radius:18px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color:white;
  font-weight:1000;
  font-size:15px;
  box-shadow:0 14px 28px rgba(34,197,94,0.28), inset 0 1px 0 rgba(255,255,255,0.18);
}

.addBtn:hover,
.btn:hover{
  transform:translateY(-1px);
  box-shadow:0 18px 34px rgba(34,197,94,0.34), inset 0 1px 0 rgba(255,255,255,0.18);
}

.miniBtn{
  min-height:40px;
  padding:0 14px;
  border-radius:14px;
  background:linear-gradient(180deg, #f9fafb 0%, #eef2f7 100%);
  color:#1f2937;
  font-weight:900;
  font-size:13px;
  border:1px solid rgba(0,0,0,0.05);
}

.miniBtn:hover{
  transform:translateY(-1px);
}

.miniBtn.danger{
  background:linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  color:#b91c1c;
}

.counter,
.pill{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:34px;
  padding:0 12px;
  border-radius:999px;
  font-weight:900;
  font-size:12px;
}

.counter{
  background:#f3f4f6;
  color:#374151;
  min-height:40px;
}

.pill.primary{
  background:#dbeafe;
  color:#1d4ed8;
}

.pill.success{
  background:#dcfce7;
  color:#166534;
}

.addressPreview,
.shippingItem{
  margin-top:18px;
  border:1px solid #e5e7eb;
  border-radius:20px;
  background:linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  padding:18px;
}

.addressPreview h4,
.shippingItem h4{
  margin:0 0 8px;
  color:#111827;
  font-size:20px;
  font-weight:1000;
}

.addressPreview p,
.shippingBody p,
.recipient{
  margin:4px 0;
  color:#4b5563;
  line-height:1.5;
  font-weight:700;
}

.recipient{
  color:#111827;
}

.preline{
  white-space:pre-line;
}

.shippingList{
  display:grid;
  gap:14px;
  margin-top:18px;
}

.shippingItem.active{
  border-color:rgba(34,197,94,0.4);
  box-shadow:0 10px 22px rgba(34,197,94,0.12);
}

.shippingBody{
  margin:14px 0 16px;
}

.shippingActions{
  flex-wrap:wrap;
  justify-content:flex-start;
  gap:10px;
}

.form,
.modalForm{
  position:relative;
  z-index:1;
  margin-top:18px;
  display:grid;
  gap:14px;
}

.modalForm{
  grid-template-columns:repeat(2, minmax(0, 1fr));
}

.field{
  min-width:0;
}

.field.full{ grid-column:1 / -1; }
.field.half{ grid-column:auto; }

.field label{
  display:block;
  font-size:13px;
  font-weight:1000;
  color:#374151;
  margin-bottom:8px;
}

.field input,
.field textarea{
  width:100%;
  padding:15px 16px;
  border-radius:16px;
  border:1px solid #e5e7eb;
  outline:none;
  font-size:16px;
  font-weight:700;
  color:#111827;
  background:linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.8);
  transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.field textarea{
  resize:vertical;
  min-height:120px;
}

.field input::placeholder,
.field textarea::placeholder{
  color:#9ca3af;
  font-weight:600;
}

.field input:focus,
.field textarea:focus{
  border-color:rgba(34,197,94,0.55);
  box-shadow:
    0 0 0 4px rgba(34,197,94,0.12),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.checkRow{
  grid-column:1 / -1;
  display:flex;
  align-items:center;
  gap:10px;
  font-size:14px;
  font-weight:900;
  color:#374151;
}

.checkRow input{
  width:18px;
  height:18px;
}

.btn{
  margin-top:6px;
  width:100%;
  min-height:52px;
  border-radius:18px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background:linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color:white;
  font-weight:1000;
  font-size:16px;
  box-shadow:
    0 14px 28px rgba(34,197,94,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.btn:disabled,
.miniBtn:disabled{
  opacity:.75;
  cursor:not-allowed;
  transform:none;
}

.spinner{
  width:17px;
  height:17px;
  border-radius:50%;
  border:2px solid rgba(255,255,255,0.42);
  border-top-color:white;
  animation:spin .7s linear infinite;
}

@keyframes spin{
  to{ transform:rotate(360deg); }
}

.modalOverlay{
  position:fixed;
  inset:0;
  z-index:60;
  background:rgba(17,24,39,0.45);
  backdrop-filter:blur(5px);
  display:grid;
  place-items:center;
  padding:18px;
}

.modalCard{
  width:100%;
  max-width:760px;
  padding:22px;
}

.emptyState{
  margin-top:18px;
  border:1px dashed #d1d5db;
  border-radius:20px;
  padding:22px;
  color:#6b7280;
  font-weight:800;
  display:grid;
  gap:6px;
  text-align:center;
}

.globalMsg{
  margin:16px auto 0;
  max-width:1160px;
}

.ok,
.err{
  padding:12px 14px;
  border-radius:16px;
  font-weight:900;
  font-size:14px;
}

.ok{
  color:#166534;
  background:#ecfdf5;
  border:1px solid #bbf7d0;
}

.err{
  color:#991b1b;
  background:#fff1f2;
  border:1px solid #fecaca;
}

@media (min-width: 900px){
  .page{
    padding-top:18px;
    padding-bottom:20px;
  }

  .hero-card,
  .address-card,
  .modalCard{
    padding:26px;
  }

  .headText h2{
    font-size:34px;
  }
}

@media (max-width: 900px){
  .address-grid{
    grid-template-columns:1fr;
  }

  .hero-head{
    flex-direction:column;
    align-items:stretch;
  }

  .addBtn,
  .counter{
    width:100%;
  }
}

@media (max-width: 640px){
  .card,
  .hero-card,
  .modalCard{
    border-radius:22px;
    padding:18px;
  }

  .head,
  .sectionHead,
  .shippingItemHead,
  .shippingActions,
  .modalHead{
    gap:12px;
  }

  .head-left,
  .sectionHead,
  .shippingItemHead,
  .modalHead{
    flex-direction:column;
    align-items:stretch;
  }

  .back{
    width:44px;
    height:44px;
    flex-basis:44px;
    border-radius:14px;
    font-size:22px;
  }

  .headText h2{
    font-size:24px;
  }

  .muted,
  .sectionMuted{
    font-size:13px;
  }

  .field input,
  .field textarea{
    font-size:15px;
    border-radius:14px;
    padding:14px;
  }

  .btn,
  .addBtn,
  .miniBtn{
    min-height:48px;
    border-radius:16px;
    font-size:15px;
  }

  .modalForm{
    grid-template-columns:1fr;
  }

  .field.half,
  .field.full,
  .checkRow{
    grid-column:1 / -1;
  }
}
</style>
