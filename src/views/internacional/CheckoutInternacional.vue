<template>
  <div class="checkout-page">
    <div class="checkout-wrap">
      <div class="checkout-head">
        <div>
          <p class="eyebrow">Checkout · ResuelveShop Internacional</p>
          <h2>Finalizar pedido</h2>
          <p class="muted">
            Revisa tus datos de facturación y entrega antes de continuar al pago.
          </p>
        </div>
      </div>

      <div class="checkout-layout">
        <section class="checkout-main card">
          <form class="form" @submit.prevent="continuar">
            <div class="section">
              <div class="section-head">
                <div>
                  <p class="badge billing">Facturación</p>
                  <h3>Datos del comprador</h3>
                </div>
              </div>

              <div class="field-grid">
                <div class="field">
                  <label>Nombre completo</label>
                  <input v-model="nombre" placeholder="Nombre completo" required />
                </div>

                <div class="field">
                  <label>Teléfono</label>
                  <input v-model="telefono" placeholder="Teléfono" required />
                </div>

                <div class="field full">
                  <label>Dirección de facturación</label>
                  <textarea
                    v-model="direccion"
                    placeholder="Dirección completa"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <div>
                  <p class="badge shipping">Entrega</p>
                  <h3>Datos de entrega</h3>
                  <p class="section-muted">
                    Usa una dirección guardada o completa los datos manualmente.
                  </p>
                </div>
              </div>

              <div class="field-grid">
                <div class="field full">
                  <label>Direcciones guardadas</label>
                  <select v-model="selectedShippingId" @change="aplicarDireccionGuardada">
                    <option value="">Selecciona una dirección guardada</option>
                    <option
                      v-for="addr in shippingAddresses"
                      :key="addr.id"
                      :value="String(addr.id)"
                    >
                      {{ addr.alias || addr.nombre }}
                      {{ addr.predeterminada ? " · Principal" : "" }}
                    </option>
                  </select>
                </div>

                <div
                  v-if="shippingAddresses.length && selectedAddressPreview"
                  class="saved-preview full"
                >
                  <div class="saved-preview-head">
                    <strong>{{ selectedAddressPreview.alias || "Dirección seleccionada" }}</strong>
                    <span v-if="selectedAddressPreview.predeterminada" class="pill success">
                      Principal
                    </span>
                  </div>
                  <p>{{ selectedAddressPreview.nombre }}</p>
                  <p>{{ selectedAddressPreview.telefono }}</p>
                  <p>{{ selectedAddressPreview.direccion }}</p>
                </div>

                <div class="field">
                  <label>Nombre del destinatario</label>
                  <input
                    v-model="destinatarioNombre"
                    placeholder="Nombre de quien recibe"
                    required
                  />
                </div>

                <div class="field">
                  <label>Teléfono del destinatario</label>
                  <input
                    v-model="destinatarioTelefono"
                    placeholder="Teléfono del destinatario"
                    required
                  />
                </div>

                <div class="field full">
                  <label>Dirección de entrega</label>
                  <textarea
                    v-model="destinatarioDireccion"
                    placeholder="Dirección completa de entrega"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div class="field full">
                  <label>Notas del pedido</label>
                  <textarea
                    v-model="notas"
                    placeholder="Ej: referencia de entrega, horario, persona de contacto..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-head">
                <div>
                  <p class="badge payment">Pago</p>
                  <h3>Método de pago</h3>
                  <p class="section-muted">
                    Selecciona cómo quieres pagar antes de pasar a la pantalla de pago.
                  </p>
                </div>
              </div>

              <div class="payment-methods-grid">
                <button
                  type="button"
                  class="payment-option"
                  :class="{ active: metodoPago === 'bizum' }"
                  @click="metodoPago = 'bizum'"
                >
                  <div class="payment-option-left">
                    <div class="payment-option-icon bizum">B</div>
                    <div>
                      <strong>Bizum</strong>
                      <p>Pago rápido y cómodo</p>
                    </div>
                  </div>
                  <span v-if="metodoPago === 'bizum'" class="payment-pill">Seleccionado</span>
                </button>

                <button
                  type="button"
                  class="payment-option"
                  :class="{ active: metodoPago === 'transferencia' }"
                  @click="metodoPago = 'transferencia'"
                >
                  <div class="payment-option-left">
                    <div class="payment-option-icon transferencia">€</div>
                    <div>
                      <strong>Transferencia bancaria</strong>
                      <p>Recibirás IBAN y concepto en la siguiente pantalla</p>
                    </div>
                  </div>
                  <span
                    v-if="metodoPago === 'transferencia'"
                    class="payment-pill transfer"
                  >
                    Seleccionado
                  </span>
                </button>
              </div>
            </div>

            <div class="mobile-summary">
              <div class="summary-lines">
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span>{{ total.toFixed(2) }} €</span>
                </div>
                <div class="summary-line">
                  <span>Envío</span>
                  <span>{{ envio.toFixed(2) }} €</span>
                </div>
                <div class="summary-line">
                  <span>Método</span>
                  <span>{{ metodoPagoLabel }}</span>
                </div>
                <div class="summary-total">
                  <span>Total</span>
                  <span>{{ totalFinal.toFixed(2) }} €</span>
                </div>
              </div>
            </div>

            <button class="pagar-btn" :disabled="cargandoPerfil || creandoPedido">
              <span v-if="cargandoPerfil || creandoPedido" class="spinner"></span>
              {{
                cargandoPerfil
                  ? "Cargando datos..."
                  : creandoPedido
                    ? "Preparando pedido..."
                    : `Continuar al pago (${metodoPagoLabel})`
              }}
            </button>
          </form>
        </section>

        <aside class="checkout-summary card">
          <div class="summary-top">
            <div>
              <h3 class="summary-title">Resumen del pedido</h3>
              <p class="summary-muted">Verifica tu compra antes de pagar</p>
            </div>

            <button type="button" class="edit-cart-btn" @click="irAlCarrito">
              <span class="edit-cart-icon"></span>
              <span>Editar carrito</span>
            </button>
          </div>

          <p class="summary-help">
            Toca cualquier producto para volver al carrito y cambiar cantidades o combos.
          </p>

          <div v-if="carrito.length" class="summary-products">
            <button
              v-for="item in carrito"
              :key="item.id"
              type="button"
              class="summary-product clickable-product"
              @click="irAlCarrito"
            >
              <img
                v-if="item.imagen"
                :src="item.imagen"
                :alt="item.nombre"
                class="product-thumb"
              />
              <div v-else class="product-thumb placeholder">RS</div>

              <div class="product-info">
                <h4>{{ item.nombre }}</h4>
                <p>Cantidad: {{ item.cantidad }}</p>
                <p>{{ item.precio }} € c/u</p>
              </div>

              <div class="product-total">
                {{ (Number(item.precio) * Number(item.cantidad)).toFixed(2) }} €
              </div>
            </button>
          </div>

          <div class="summary-lines">
            <div class="summary-line">
              <span>Subtotal</span>
              <span>{{ total.toFixed(2) }} €</span>
            </div>

            <div class="summary-line">
              <span>Envío</span>
              <span>{{ envio.toFixed(2) }} €</span>
            </div>

            <div class="summary-line">
              <span>Método</span>
              <span>{{ metodoPagoLabel }}</span>
            </div>

            <div class="summary-line" v-if="cantidadTotal > 0">
              <span>Artículos</span>
              <span>{{ cantidadTotal }}</span>
            </div>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>{{ totalFinal.toFixed(2) }} €</span>
          </div>

          <div class="summary-note">
            Tus datos se usarán para procesar el pedido y coordinar la entrega.
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../../supabase"

const router = useRouter()

const carrito = ref(JSON.parse(localStorage.getItem("carrito_internacional")) || [])

if (carrito.value.length === 0) {
  router.push("/internacional/carrito")
}

const nombre = ref("")
const telefono = ref("")
const direccion = ref("")
const notas = ref("")

const destinatarioNombre = ref("")
const destinatarioTelefono = ref("")
const destinatarioDireccion = ref("")

const cargandoPerfil = ref(true)
const creandoPedido = ref(false)

const shippingAddresses = ref([])
const selectedShippingId = ref("")

const metodoPago = ref(localStorage.getItem("metodo_pago_internacional") || "bizum")

const total = computed(() =>
  carrito.value.reduce((s, i) => s + Number(i.precio || 0) * Number(i.cantidad || 0), 0)
)

const cantidadTotal = computed(() =>
  carrito.value.reduce((s, i) => s + Number(i.cantidad || 0), 0)
)

const envio = computed(() => 0)
const totalFinal = computed(() => total.value + envio.value)

const metodoPagoLabel = computed(() =>
  metodoPago.value === "bizum" ? "Bizum" : "Transferencia"
)

const selectedAddressPreview = computed(() => {
  if (!selectedShippingId.value) return null
  return (
    shippingAddresses.value.find(
      (item) => String(item.id) === String(selectedShippingId.value)
    ) || null
  )
})

watch(metodoPago, (nuevo) => {
  localStorage.setItem("metodo_pago_internacional", nuevo)
})

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    router.push({ path: "/login", query: { redirect: "/internacional/checkout" } })
    return
  }

  await Promise.all([cargarPerfil(user.id), cargarDirecciones(user.id)])
  cargandoPerfil.value = false
})

async function cargarPerfil(userId) {
  const { data: prof, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion")
    .eq("id", userId)
    .single()

  if (!error && prof) {
    nombre.value = prof.nombre || ""
    telefono.value = prof.telefono || ""
    direccion.value = prof.direccion || ""
  }
}

async function cargarDirecciones(userId) {
  const { data, error } = await supabase
    .from("shipping_addresses")
    .select("id, alias, nombre, telefono, direccion, predeterminada")
    .eq("user_id", userId)
    .order("predeterminada", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error cargando direcciones:", error)
    return
  }

  shippingAddresses.value = data || []

  const principal = shippingAddresses.value.find((item) => item.predeterminada)

  if (principal) {
    selectedShippingId.value = String(principal.id)
    aplicarDireccion(principal)
  }
}

function aplicarDireccionGuardada() {
  const selected = shippingAddresses.value.find(
    (item) => String(item.id) === String(selectedShippingId.value)
  )

  if (selected) {
    aplicarDireccion(selected)
  }
}

function aplicarDireccion(item) {
  destinatarioNombre.value = item.nombre || ""
  destinatarioTelefono.value = item.telefono || ""
  destinatarioDireccion.value = item.direccion || ""
}

function irAlCarrito() {
  router.push("/internacional/carrito")
}

async function continuar() {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    alert("Debes iniciar sesión")
    router.push({ path: "/login", query: { redirect: "/internacional/checkout" } })
    return
  }

  if (!carrito.value.length) {
    alert("Tu carrito está vacío.")
    router.push("/internacional/carrito")
    return
  }

  creandoPedido.value = true

  const nowIso = new Date().toISOString()

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      nombre: nombre.value,
      telefono: telefono.value,
      direccion: direccion.value,
      updated_at: nowIso,
    },
    { onConflict: "id" }
  )

  if (profileError) {
    creandoPedido.value = false
    console.error(profileError)
    alert("No se pudo guardar tu perfil antes de continuar.")
    return
  }

  const pedidoTemporal = {
    tienda: "internacional",
    user_id: user.id,
    productos: carrito.value.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      precio: Number(i.precio || 0),
      cantidad: Number(i.cantidad || 0),
      imagen: i.imagen || null,
    })),
    subtotal: total.value,
    envio: envio.value,
    total: totalFinal.value,
    currency: "EUR",
    facturacion: {
      nombre: nombre.value,
      telefono: telefono.value,
      direccion: direccion.value,
    },
    entrega: {
      shipping_address_id: selectedShippingId.value || null,
      nombre: destinatarioNombre.value,
      telefono: destinatarioTelefono.value,
      direccion: destinatarioDireccion.value,
      notas: notas.value || "",
    },
    payment_method: metodoPago.value,
    created_at: nowIso,
  }

  localStorage.setItem("checkout_pending_internacional", JSON.stringify(pedidoTemporal))
  localStorage.setItem("metodo_pago_internacional", metodoPago.value)
  window.dispatchEvent(new CustomEvent("pedido-pendiente-actualizado"))

  creandoPedido.value = false
  router.push("/internacional/pago")
}
</script>

<style scoped>
.checkout-page{
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
}

.checkout-wrap{
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 18px;
}

.checkout-head{
  margin-bottom: 18px;
}

.eyebrow,
.badge{
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.eyebrow{
  color: #16a34a;
}

.checkout-head h2{
  margin: 0;
  font-size: 36px;
  line-height: 1.04;
  font-weight: 1000;
  color: #111827;
  letter-spacing: -.7px;
}

.muted{
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 700;
}

.checkout-layout{
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) 380px;
  gap: 22px;
  align-items: start;
}

.card{
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 24px;
  box-shadow:
    0 18px 40px rgba(0,0,0,0.08),
    0 6px 16px rgba(0,0,0,0.04);
}

.checkout-main{
  padding: 24px;
}

.checkout-summary{
  padding: 22px;
  position: sticky;
  top: 20px;
}

.section + .section{
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #eef2f7;
}

.section-head{
  margin-bottom: 16px;
}

.badge.billing{
  color: #2563eb;
}

.badge.shipping{
  color: #16a34a;
}

.badge.payment{
  color: #7c3aed;
}

.section-head h3,
.summary-title{
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 1000;
}

.section-muted,
.summary-muted,
.summary-note,
.summary-help{
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.form{
  display: flex;
  flex-direction: column;
  gap: 0;
}

.field-grid{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field{
  min-width: 0;
}

.field.full{
  grid-column: 1 / -1;
}

.field label{
  display: block;
  font-size: 13px;
  font-weight: 1000;
  color: #374151;
  margin-bottom: 8px;
}

.field input,
.field textarea,
.field select{
  width: 100%;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
  transition: border-color .16s ease, box-shadow .16s ease;
}

.field textarea{
  resize: vertical;
  min-height: 110px;
}

.field input::placeholder,
.field textarea::placeholder{
  color: #9ca3af;
  font-weight: 600;
}

.field input:focus,
.field textarea:focus,
.field select:focus{
  border-color: rgba(34,197,94,0.55);
  box-shadow:
    0 0 0 4px rgba(34,197,94,0.12),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.saved-preview{
  border: 1px solid #d1fae5;
  background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
  border-radius: 18px;
  padding: 16px;
}

.saved-preview-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.saved-preview p{
  margin: 4px 0;
  color: #374151;
  font-weight: 700;
  line-height: 1.5;
}

.pill{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
}

.pill.success{
  background: #dcfce7;
  color: #166534;
}

.payment-methods-grid{
  display: grid;
  gap: 12px;
}

.payment-option{
  width: 100%;
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  border-radius: 20px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}

.payment-option:hover{
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15,23,42,0.06);
}

.payment-option.active{
  border-color: rgba(124,58,237,0.24);
  box-shadow: 0 10px 22px rgba(124,58,237,0.08);
}

.payment-option-left{
  display: flex;
  gap: 12px;
  align-items: center;
}

.payment-option-icon{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 1000;
  font-size: 20px;
  flex: 0 0 46px;
}

.payment-option-icon.bizum{
  background: linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%);
}

.payment-option-icon.transferencia{
  background: linear-gradient(180deg, #0f766e 0%, #0f9f8f 100%);
}

.payment-option strong{
  display: block;
  color: #111827;
  font-size: 16px;
  font-weight: 1000;
}

.payment-option p{
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.payment-pill{
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 12px;
  font-weight: 1000;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.payment-pill.transfer{
  background: #ccfbf1;
  color: #0f766e;
}

.summary-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.edit-cart-btn{
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #166534;
  border-radius: 12px;
  font-weight: 900;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
}

.edit-cart-btn:hover{
  transform: translateY(-1px);
  background: #f0fdf4;
  box-shadow: 0 10px 20px rgba(34,197,94,0.10);
}

.edit-cart-icon{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transform: rotate(-8deg);
  transition: transform .16s ease;
}

.edit-cart-btn:hover .edit-cart-icon{
  transform: rotate(0deg) scale(1.05);
}

.summary-products{
  margin-top: 18px;
}

.clickable-product{
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: transform .16s ease, background .16s ease, box-shadow .16s ease;
}

.clickable-product:hover{
  background: #f8fafc;
  transform: translateY(-1px);
  border-radius: 16px;
}

.summary-product{
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #eef2f7;
}

.product-thumb{
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.product-thumb.placeholder{
  display: grid;
  place-items: center;
  font-weight: 1000;
  color: #16a34a;
}

.product-info h4{
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 1000;
  color: #111827;
}

.product-info p{
  margin: 2px 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
}

.product-total{
  font-weight: 1000;
  color: #111827;
  font-size: 16px;
}

.summary-lines{
  display: grid;
  gap: 12px;
  padding-top: 18px;
}

.summary-line{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #374151;
  font-weight: 800;
  font-size: 15px;
}

.summary-total{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
}

.summary-total span:first-child{
  font-size: 18px;
  font-weight: 1000;
  color: #111827;
}

.summary-total span:last-child{
  font-size: 30px;
  font-weight: 1000;
  color: #111827;
}

.summary-note{
  margin-top: 16px;
  font-size: 13px;
}

.mobile-summary{
  display: none;
}

.pagar-btn{
  margin-top: 24px;
  width: 100%;
  min-height: 54px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 17px;
  box-shadow:
    0 14px 28px rgba(34,197,94,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);
  transition: transform .16s ease, box-shadow .16s ease;
}

.pagar-btn:hover{
  transform: translateY(-1px);
  box-shadow:
    0 18px 34px rgba(34,197,94,0.34),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.pagar-btn:disabled{
  opacity: .82;
  cursor: not-allowed;
  transform: none;
}

.spinner{
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.42);
  border-top-color: white;
  animation: spin .7s linear infinite;
}

@keyframes spin{
  to{ transform: rotate(360deg); }
}

@media (max-width: 980px){
  .checkout-layout{
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .checkout-summary{
    position: static;
    order: -1;
    padding: 18px;
  }

  .checkout-main{
    padding: 20px;
  }

  .mobile-summary{
    display: block;
    margin-top: 18px;
    padding: 14px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
  }
}

@media (max-width: 640px){
  .checkout-page{
    padding: 10px;
    padding-bottom: 150px;
  }

  .checkout-wrap{
    padding-top: 6px;
  }

  .checkout-head{
    margin-bottom: 12px;
  }

  .checkout-main,
  .checkout-summary{
    padding: 14px;
    border-radius: 18px;
  }

  .card{
    border: 1px solid rgba(229,231,235,0.95);
    box-shadow:
      0 10px 24px rgba(0,0,0,0.06),
      0 3px 8px rgba(0,0,0,0.03);
  }

  .eyebrow,
  .badge{
    font-size: 11px;
    margin-bottom: 6px;
  }

  .checkout-head h2{
    font-size: 20px;
    line-height: 1.08;
    letter-spacing: -0.4px;
  }

  .muted,
  .section-muted,
  .summary-muted,
  .summary-note,
  .summary-help{
    font-size: 12px;
    line-height: 1.4;
    margin-top: 4px;
  }

  .section + .section{
    margin-top: 18px;
    padding-top: 18px;
  }

  .section-head{
    margin-bottom: 12px;
  }

  .section-head h3,
  .summary-title{
    font-size: 20px;
  }

  .field-grid{
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .field label{
    font-size: 12px;
    margin-bottom: 6px;
  }

  .field input,
  .field textarea,
  .field select{
    font-size: 15px;
    padding: 13px 14px;
    border-radius: 14px;
  }

  .field textarea{
    min-height: 96px;
  }

  .saved-preview{
    padding: 12px;
    border-radius: 16px;
  }

  .saved-preview-head{
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }

  .saved-preview p{
    font-size: 12px;
    margin: 3px 0;
  }

  .pill{
    min-height: 28px;
    padding: 0 10px;
    font-size: 11px;
  }

  .payment-option{
    padding: 14px;
    border-radius: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .payment-option-left{
    gap: 10px;
  }

  .payment-option-icon{
    width: 40px;
    height: 40px;
    border-radius: 12px;
    font-size: 17px;
  }

  .payment-pill{
    min-height: 28px;
    font-size: 11px;
    padding: 0 10px;
    align-self: flex-start;
  }

  .summary-top{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .edit-cart-btn{
    min-height: 34px;
    padding: 0 12px;
    border-radius: 12px;
    font-size: 12px;
    width: fit-content;
    gap: 5px;
  }

  .edit-cart-icon{
    font-size: 11px;
  }

  .mobile-summary{
    margin-top: 14px;
    padding: 12px;
    border-radius: 14px;
  }

  .summary-products{
    margin-top: 10px;
  }

  .summary-product{
    grid-template-columns: 42px 1fr auto;
    gap: 8px;
    padding: 8px 0;
  }

  .product-thumb{
    width: 42px;
    height: 42px;
    border-radius: 10px;
  }

  .product-info h4{
    font-size: 13px;
    margin: 0 0 2px;
  }

  .product-info p{
    font-size: 11px;
    margin: 1px 0;
  }

  .product-total{
    font-size: 13px;
  }

  .summary-lines{
    gap: 10px;
    padding-top: 12px;
  }

  .summary-line{
    font-size: 14px;
  }

  .summary-total{
    margin-top: 12px;
    padding: 14px;
    border-top: 1px solid #e5e7eb;
    background: #f8fafc;
    border-radius: 14px;
  }

  .summary-total span:first-child{
    font-size: 16px;
  }

  .summary-total span:last-child{
    font-size: 22px;
  }

  .pagar-btn{
    margin-top: 16px;
    min-height: 46px;
    border-radius: 14px;
    font-size: 14px;
  }
}
</style>