<template>
  <div class="checkout-page">
    <div class="checkout-wrap">
      <div class="checkout-head">
        <div>
          <p class="eyebrow">Checkout · ResuelveShop Cuba</p>
          <h2>Finalizar pedido</h2>
          <p class="muted">
            Completa los datos y envía tu pedido por WhatsApp.
          </p>
        </div>
      </div>

      <div class="checkout-layout">
        <section class="checkout-main card">
          <form class="form" @submit.prevent="continuarWhatsApp">
            <div class="section">
              <div class="section-head">
                <div>
                  <p class="badge billing">Cliente</p>
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
                  <label>Dirección de referencia</label>
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
                    La provincia y el municipio seleccionados definen la disponibilidad del pedido.
                  </p>
                </div>
              </div>

              <div class="field-grid">
                <div class="field full">
                  <label>Ubicación seleccionada</label>
                  <div class="province-box">
                    <div class="location-lines">
                      <span>📍 {{ provincia || "Sin provincia seleccionada" }}</span>
                      <span>🏙️ {{ municipioSeleccionado || "Sin municipio seleccionado" }}</span>
                    </div>

                    <button
                      type="button"
                      class="change-province-btn"
                      @click="cambiarUbicacion"
                    >
                      Cambiar
                    </button>
                  </div>
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
                  <label>Reparto / zona / barrio (opcional)</label>
                  <input
                    v-model="zona"
                    placeholder="Ej. Micro 3, Reparto Sueño, Vedado..."
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

            <div class="mobile-summary">
              <div class="summary-lines">
                <div class="summary-line">
                  <span>Provincia</span>
                  <span>{{ provincia || "—" }}</span>
                </div>
                <div class="summary-line">
                  <span>Municipio</span>
                  <span>{{ municipioSeleccionado || "—" }}</span>
                </div>
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span>{{ total }} €</span>
                </div>
                <div class="summary-line">
                  <span>Envío</span>
                  <span>{{ envio }} €</span>
                </div>
                <div class="summary-total">
                  <span>Total</span>
                  <span>{{ totalFinal }} €</span>
                </div>
              </div>
            </div>

            <button
              class="pagar-btn"
              :disabled="!provincia || !municipioSeleccionado || enviando || !carrito.length"
            >
              <span v-if="enviando" class="spinner"></span>
              {{ enviando ? "Abriendo WhatsApp..." : "Enviar pedido por WhatsApp" }}
            </button>
          </form>
        </section>

        <aside class="checkout-summary card">
          <div class="summary-top">
            <div>
              <h3 class="summary-title">Resumen del pedido</h3>
              <p class="summary-muted">Verifica tu compra antes de enviarla</p>
            </div>

            <button type="button" class="edit-cart-btn" @click="irAlCarrito">
              <span class="edit-cart-icon"></span>
              <span>Editar carrito</span>
            </button>
          </div>

          <p class="summary-help">
            Toca cualquier producto para volver al carrito y cambiar cantidades.
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
                {{ item.precio * item.cantidad }} €
              </div>
            </button>
          </div>

          <div class="summary-lines">
            <div class="summary-line">
              <span>Provincia</span>
              <span>{{ provincia || "—" }}</span>
            </div>

            <div class="summary-line">
              <span>Municipio</span>
              <span>{{ municipioSeleccionado || "—" }}</span>
            </div>

            <div class="summary-line">
              <span>Subtotal</span>
              <span>{{ total }} €</span>
            </div>

            <div class="summary-line">
              <span>Envío</span>
              <span>{{ envio }} €</span>
            </div>

            <div class="summary-line" v-if="cantidadTotal > 0">
              <span>Artículos</span>
              <span>{{ cantidadTotal }}</span>
            </div>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>{{ totalFinal }} €</span>
          </div>

          <div class="summary-note">
            El pedido se enviará por WhatsApp con todos tus datos y productos.
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../../supabase"

const router = useRouter()
const WHATS_PHONE = "34624569359"

const carrito = ref(JSON.parse(localStorage.getItem("carrito_cuba")) || [])
const provincia = ref(localStorage.getItem("provincia_cuba") || "")
const municipioSeleccionado = ref(localStorage.getItem("municipio_cuba") || "")

const nombre = ref("")
const telefono = ref("")
const direccion = ref("")
const notas = ref("")

const destinatarioNombre = ref("")
const destinatarioTelefono = ref("")
const destinatarioDireccion = ref("")
const zona = ref("")

const cargandoPerfil = ref(true)
const enviando = ref(false)

const total = computed(() =>
  carrito.value.reduce((s, i) => s + Number(i.precio || 0) * Number(i.cantidad || 0), 0)
)

const cantidadTotal = computed(() =>
  carrito.value.reduce((s, i) => s + Number(i.cantidad || 0), 0)
)

const envio = computed(() => 0)
const totalFinal = computed(() => total.value + envio.value)

function recargarCheckout() {
  carrito.value = JSON.parse(localStorage.getItem("carrito_cuba")) || []
  provincia.value = localStorage.getItem("provincia_cuba") || ""
  municipioSeleccionado.value = localStorage.getItem("municipio_cuba") || ""

  if (!provincia.value || !municipioSeleccionado.value) {
    router.push("/cuba/catalogo")
    return
  }

  if (!carrito.value.length) {
    router.push("/cuba/carrito")
  }
}

onMounted(async () => {
  recargarCheckout()

  window.addEventListener("provincia-cuba-actualizada", recargarCheckout)
  window.addEventListener("carrito-actualizado", recargarCheckout)

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    router.push({ path: "/login", query: { redirect: "/cuba/checkout" } })
    return
  }

  await cargarPerfil(user.id)
  cargandoPerfil.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener("provincia-cuba-actualizada", recargarCheckout)
  window.removeEventListener("carrito-actualizado", recargarCheckout)
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

function irAlCarrito() {
  router.push("/cuba/carrito")
}

function cambiarUbicacion() {
  localStorage.removeItem("provincia_cuba")
  localStorage.removeItem("municipio_cuba")
  localStorage.removeItem("carrito_cuba")
  window.dispatchEvent(new CustomEvent("provincia-cuba-actualizada"))
  window.dispatchEvent(new CustomEvent("carrito-actualizado"))
  router.push("/cuba/catalogo")
}

function construirMensaje() {
  const lineasProductos = carrito.value.map((item) => {
    const subtotal = Number(item.precio || 0) * Number(item.cantidad || 0)
    return `- ${item.nombre} x${item.cantidad} = ${subtotal.toFixed(2)} €`
  })

  const mensaje = [
    "Hola, quiero realizar este pedido en ResuelveShop Cuba:",
    "",
    `📍 Provincia: ${provincia.value || "No indicada"}`,
    `🏙️ Municipio: ${municipioSeleccionado.value || "No indicado"}`,
    `📌 Zona / barrio: ${zona.value || "No indicado"}`,
    "",
    "🧾 Datos del comprador:",
    `- Nombre: ${nombre.value}`,
    `- Teléfono: ${telefono.value}`,
    `- Dirección: ${direccion.value}`,
    "",
    "📦 Datos de entrega:",
    `- Destinatario: ${destinatarioNombre.value}`,
    `- Teléfono destinatario: ${destinatarioTelefono.value}`,
    `- Dirección de entrega: ${destinatarioDireccion.value}`,
    "",
    "🛒 Productos:",
    ...lineasProductos,
    "",
    `💰 Subtotal: ${total.value.toFixed(2)} €`,
    `🚚 Envío: ${envio.value.toFixed(2)} €`,
    `✅ Total: ${totalFinal.value.toFixed(2)} €`,
    "",
    `📝 Notas: ${notas.value || "Sin notas"}`
  ].join("\n")

  return mensaje
}

function guardarPedidoLocal(user) {
  const pedidosGuardados = JSON.parse(localStorage.getItem("orders_cuba")) || []

  const nuevoPedido = {
    id: `CUBA-${Date.now()}`,
    fecha: new Date().toISOString(),
    estado: "Pendiente por confirmar",
    tienda: "cuba",
    user_id: user.id,
    user_email: user.email,
    provincia: provincia.value,
    municipio: municipioSeleccionado.value,
    subtotal: total.value,
    envio: envio.value,
    total: totalFinal.value,
    comprador: {
      nombre: nombre.value,
      telefono: telefono.value,
      direccion: direccion.value,
    },
    entrega: {
      nombre: destinatarioNombre.value,
      telefono: destinatarioTelefono.value,
      municipio: municipioSeleccionado.value,
      zona: zona.value,
      direccion: destinatarioDireccion.value,
      notas: notas.value || "",
    },
    productos: carrito.value.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      precio: Number(i.precio || 0),
      cantidad: Number(i.cantidad || 0),
      imagen: i.imagen || null,
      provincias: i.provincias || [],
      municipios: i.municipios || [],
    })),
  }

  pedidosGuardados.unshift(nuevoPedido)
  localStorage.setItem("orders_cuba", JSON.stringify(pedidosGuardados))
  localStorage.setItem("checkout_pending_cuba", JSON.stringify(nuevoPedido))

  return nuevoPedido
}

async function continuarWhatsApp() {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    alert("Debes iniciar sesión")
    router.push({ path: "/login", query: { redirect: "/cuba/checkout" } })
    return
  }

  if (!carrito.value.length) {
    alert("Tu carrito está vacío.")
    router.push("/cuba/carrito")
    return
  }

  if (!provincia.value || !municipioSeleccionado.value) {
    alert("Debes seleccionar provincia y municipio antes de continuar.")
    router.push("/cuba/catalogo")
    return
  }

  const productosInvalidos = carrito.value.filter((item) => {
    const validaProvincia =
      !Array.isArray(item.provincias) || item.provincias.includes(provincia.value)

    const validaMunicipio =
      !Array.isArray(item.municipios) || item.municipios.includes(municipioSeleccionado.value)

    return !validaProvincia || !validaMunicipio
  })

  if (productosInvalidos.length) {
    alert("Hay productos en tu carrito que no están disponibles para la ubicación seleccionada.")
    router.push("/cuba/carrito")
    return
  }

  enviando.value = true

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
    enviando.value = false
    console.error(profileError)
    alert("No se pudo guardar tu perfil antes de continuar.")
    return
  }

  guardarPedidoLocal(user)

  const mensaje = construirMensaje()
  const url = `https://wa.me/${WHATS_PHONE}?text=${encodeURIComponent(mensaje)}`

  localStorage.removeItem("carrito_cuba")
  carrito.value = []
  window.dispatchEvent(new CustomEvent("carrito-actualizado"))

  enviando.value = false
  window.open(url, "_blank")
  router.push("/cuba/account/orders")
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
  box-sizing: border-box;
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

.province-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  min-height: 54px;
}

.location-lines{
  display: grid;
  gap: 6px;
}

.location-lines span{
  font-size: 14px;
  font-weight: 900;
  color: #111827;
}

.change-province-btn{
  border: 1px solid #d1d5db;
  background: white;
  color: #166534;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
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

  .province-box{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .change-province-btn{
    width: 100%;
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