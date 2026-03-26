<template>
  <div class="thanks-page">
    <div class="thanks-wrap">
      <section class="hero card">
        <div class="hero-icon">✓</div>

        <p class="eyebrow">Pedido confirmado · ResuelveShop Internacional</p>
        <h1>¡Gracias por tu pedido!</h1>
        <p class="muted intro">
          Hemos registrado tu pedido correctamente. Ahora revisaremos el pago y procesaremos
          tu compra para continuar con la entrega.
        </p>

        <div class="hero-actions">
          <router-link to="/" class="btn primary">Ir al inicio</router-link>
          <router-link to="/internacional/carrito" class="btn ghost">
            Seguir comprando
          </router-link>
        </div>
      </section>

      <div class="thanks-layout">
        <section class="main card">
          <div class="section-head">
            <div>
              <p class="badge">Resumen</p>
              <h2>Detalles del pedido</h2>
            </div>
          </div>

          <div class="order-box">
            <div class="order-row">
              <span>Número de pedido</span>
              <strong>#{{ orderId || "Pendiente" }}</strong>
            </div>

            <div class="order-row">
              <span>Estado</span>
              <strong class="status pending">Pendiente de verificación</strong>
            </div>

            <div class="order-row">
              <span>Método de pago</span>
              <strong>{{ metodoPagoLabel }}</strong>
            </div>

            <div class="order-row" v-if="paymentReference">
              <span>Referencia</span>
              <strong class="multiline">{{ paymentReference }}</strong>
            </div>

            <div class="order-row">
              <span>Total</span>
              <strong class="total">{{ total.toFixed(2) }} €</strong>
            </div>
          </div>

          <div class="section-head mt">
            <div>
              <p class="badge shipping">Siguiente paso</p>
              <h2>¿Qué ocurre ahora?</h2>
            </div>
          </div>

          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Revisamos tu pago</strong>
                <p>Comprobamos el Bizum o la transferencia para validar el pedido.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Preparamos tu compra</strong>
                <p>Organizamos los productos y la logística de entrega.</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Continuamos con la entrega</strong>
                <p>Tu pedido seguirá su flujo una vez verificado el pago.</p>
              </div>
            </div>
          </div>

          <div class="notice success">
            <strong>Pedido registrado correctamente.</strong>
            <p>Guarda el número de pedido por si necesitas consultarlo más adelante.</p>
          </div>
        </section>

        <aside class="side card">
          <div class="section-head">
            <div>
              <p class="badge payment">Compra</p>
              <h3>Resumen final</h3>
            </div>
          </div>

          <div v-if="productos.length" class="products">
            <div
              v-for="item in productos"
              :key="`${item.id}-${item.nombre}`"
              class="product"
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
                <p>{{ Number(item.precio || 0).toFixed(2) }} € c/u</p>
              </div>

              <div class="product-total">
                {{ (Number(item.precio || 0) * Number(item.cantidad || 0)).toFixed(2) }} €
              </div>
            </div>
          </div>

          <div class="summary-lines">
            <div class="summary-line">
              <span>Subtotal</span>
              <span>{{ subtotal.toFixed(2) }} €</span>
            </div>

            <div class="summary-line">
              <span>Envío</span>
              <span>{{ envio.toFixed(2) }} €</span>
            </div>

            <div class="summary-line">
              <span>Artículos</span>
              <span>{{ cantidadTotal }}</span>
            </div>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>{{ total.toFixed(2) }} €</span>
          </div>

          <div class="help-box">
            <strong>¿Necesitas ayuda?</strong>
            <p>
              Si ya hiciste el pago y necesitas soporte o confirmar datos del pedido,
              puedes contactarnos por tu canal de atención habitual.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const orderId = computed(() => route.query.order || "")

const pedidoGuardado = ref(null)
const pedidoFinal = ref(null)

onMounted(() => {
  try {
    pedidoGuardado.value = JSON.parse(
      localStorage.getItem("checkout_pending_internacional") || "null"
    )
  } catch {
    pedidoGuardado.value = null
  }

  try {
    pedidoFinal.value = JSON.parse(
      localStorage.getItem("ultimo_pedido_internacional") || "null"
    )
  } catch {
    pedidoFinal.value = null
  }
})

const sourcePedido = computed(() => pedidoFinal.value || pedidoGuardado.value || null)

const productos = computed(() => sourcePedido.value?.productos || [])
const subtotal = computed(() => Number(sourcePedido.value?.subtotal || 0))
const envio = computed(() => Number(sourcePedido.value?.envio || 0))
const total = computed(() => {
  if (sourcePedido.value?.total != null) return Number(sourcePedido.value.total)
  return subtotal.value + envio.value
})

const cantidadTotal = computed(() =>
  productos.value.reduce((s, i) => s + Number(i.cantidad || 0), 0)
)

const metodoPago = computed(
  () =>
    sourcePedido.value?.payment_method ||
    localStorage.getItem("metodo_pago_internacional") ||
    "bizum"
)

const metodoPagoLabel = computed(() =>
  metodoPago.value === "bizum" ? "Bizum" : "Transferencia"
)

const paymentReference = computed(() => {
  return (
    sourcePedido.value?.payment_reference ||
    sourcePedido.value?.metadata?.payment_reference ||
    (orderId.value ? `RESUELVE-${orderId.value}` : "")
  )
})
</script>

<style scoped>
.thanks-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(41, 182, 246, 0.08), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%);
  padding: 40px 18px 60px;
}

.thanks-wrap {
  max-width: 1220px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06);
}

.hero {
  padding: 34px;
  text-align: center;
  margin-bottom: 24px;
}

.hero-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 14px 28px rgba(34, 197, 94, 0.25);
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 800;
  color: #0f766e;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  color: #0f172a;
}

.muted {
  color: #64748b;
}

.intro {
  max-width: 740px;
  margin: 14px auto 0;
  font-size: 1rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.btn {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  transition: 0.2s ease;
}

.btn.primary {
  background: #0f172a;
  color: #fff;
}

.btn.primary:hover {
  transform: translateY(-1px);
}

.btn.ghost {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #dbe4f0;
}

.thanks-layout {
  display: grid;
  grid-template-columns: 1.5fr 0.95fr;
  gap: 24px;
  align-items: start;
}

.main,
.side {
  padding: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-head h2,
.section-head h3 {
  margin: 4px 0 0;
  color: #0f172a;
}

.badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef6ff;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 800;
}

.badge.shipping {
  background: #ecfdf5;
  color: #15803d;
}

.badge.payment {
  background: #fff7ed;
  color: #c2410c;
}

.order-box,
.help-box,
.notice {
  border: 1px solid #e7edf5;
  border-radius: 22px;
  padding: 18px;
  background: #fbfdff;
}

.order-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
}

.order-row:last-child {
  border-bottom: 0;
}

.order-row span {
  color: #64748b;
}

.order-row strong {
  color: #0f172a;
  text-align: right;
}

.order-row .total {
  font-size: 1.2rem;
}

.multiline {
  white-space: normal;
  word-break: break-word;
}

.status.pending {
  color: #b45309;
}

.mt {
  margin-top: 26px;
}

.steps {
  display: grid;
  gap: 14px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid #e8edf5;
  background: #fff;
}

.step-number {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: #fff;
  font-weight: 800;
}

.step p {
  margin: 4px 0 0;
  color: #64748b;
}

.notice.success {
  margin-top: 20px;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.notice.success p {
  margin: 8px 0 0;
  color: #166534;
}

.products {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}

.product {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid #e8edf5;
  background: #fcfdff;
}

.product-thumb {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: #f1f5f9;
}

.product-thumb.placeholder {
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #334155;
}

.product-info h4 {
  margin: 0 0 6px;
  color: #0f172a;
}

.product-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

.product-total {
  font-weight: 800;
  color: #0f172a;
}

.summary-lines {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.summary-line,
.summary-total {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.summary-line {
  color: #475569;
}

.summary-total {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e8edf5;
  font-size: 1.2rem;
  font-weight: 900;
  color: #0f172a;
}

.help-box {
  margin-top: 18px;
  background: #f8fafc;
}

.help-box p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.65;
}

@media (max-width: 980px) {
  .thanks-layout {
    grid-template-columns: 1fr;
  }

  .hero,
  .main,
  .side {
    padding: 22px;
  }
}

@media (max-width: 640px) {
  .thanks-page {
    padding: 22px 12px 44px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .product {
    grid-template-columns: 60px 1fr;
  }

  .product-total {
    grid-column: 2;
    justify-self: end;
  }

  .order-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-row strong {
    text-align: left;
  }
}
</style>