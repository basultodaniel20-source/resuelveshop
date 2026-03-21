<template>
  <div class="payment-page">
    <div class="payment-wrap">
      <div class="payment-head">
        <div>
          <p class="eyebrow">Pago · ResuelveShop</p>
          <h2>Confirmar y pagar</h2>
          <p class="muted">
            Revisa tus datos y completa el pago de forma segura.
          </p>
        </div>
      </div>

      <div v-if="pedido" class="payment-layout">
        <section class="payment-main card">
          <div class="status-banner">
            <div class="status-icon">✓</div>
            <div>
              <strong>Tu pedido está casi listo</strong>
              <p>
                Solo falta confirmar el pago para procesarlo correctamente.
              </p>
            </div>
          </div>

          <div class="info-section">
            <p class="badge">Cliente</p>
            <h3>Datos del comprador</h3>

            <div class="info-card">
              <div class="info-row">
                <span>Nombre</span>
                <strong>{{ pedido.facturacion?.nombre || pedido.nombre || "—" }}</strong>
              </div>
              <div class="info-row">
                <span>Teléfono</span>
                <strong>{{ pedido.facturacion?.telefono || pedido.telefono || "—" }}</strong>
              </div>
              <div class="info-row column">
                <span>Dirección de facturación</span>
                <strong class="multiline">
                  {{ pedido.facturacion?.direccion || pedido.direccion || "—" }}
                </strong>
              </div>
            </div>
          </div>

          <div class="info-section">
            <p class="badge shipping">Entrega</p>
            <h3>Datos de entrega</h3>

            <div class="info-card highlight">
              <div class="info-row">
                <span>Destinatario</span>
                <strong>{{ pedido.entrega?.nombre || pedido.nombre || "—" }}</strong>
              </div>
              <div class="info-row">
                <span>Teléfono</span>
                <strong>{{ pedido.entrega?.telefono || pedido.telefono || "—" }}</strong>
              </div>
              <div class="info-row column">
                <span>Dirección de entrega</span>
                <strong class="multiline">
                  {{ pedido.entrega?.direccion || pedido.direccion || "—" }}
                </strong>
              </div>
              <div v-if="pedido.entrega?.notas || pedido.notas" class="info-row column">
                <span>Notas</span>
                <strong class="multiline">
                  {{ pedido.entrega?.notas || pedido.notas }}
                </strong>
              </div>
            </div>
          </div>

          <div class="info-section">
            <p class="badge payment">Pago</p>
            <h3>Método de pago</h3>

            <div class="payment-method active">
              <div class="method-left">
                <div class="method-icon">B</div>
                <div>
                  <strong>Bizum</strong>
                  <p>Pago rápido, cómodo y seguro</p>
                </div>
              </div>
              <span class="method-pill">Seleccionado</span>
            </div>

            <button class="pay-btn" @click="pagarBizum" :disabled="procesando">
              <span v-if="procesando" class="spinner"></span>
              {{ procesando ? "Procesando pago..." : "Pagar por Bizum" }}
            </button>

            <p class="secure-note">
              Tu pago se procesará de forma segura. Al confirmar, tu pedido quedará registrado.
            </p>
          </div>
        </section>

        <aside class="payment-summary card">
          <h3 class="summary-title">Resumen final</h3>
          <p class="summary-muted">Detalles de tu compra</p>

          <div class="summary-products">
            <div
              v-for="item in pedido.productos || []"
              :key="item.id"
              class="summary-product"
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
                {{ Number(item.precio) * Number(item.cantidad) }} €
              </div>
            </div>
          </div>

          <div class="summary-lines">
            <div class="summary-line">
              <span>Subtotal</span>
              <span>{{ subtotal }} €</span>
            </div>

            <div class="summary-line">
              <span>Envío</span>
              <span>{{ envio }} €</span>
            </div>

            <div class="summary-line" v-if="cantidadTotal">
              <span>Artículos</span>
              <span>{{ cantidadTotal }}</span>
            </div>
          </div>

          <div class="summary-total">
            <span>Total</span>
            <span>{{ total }} €</span>
          </div>

          <div class="summary-box">
            <p><strong>Pedido:</strong> #{{ pedido.order_id || "Pendiente" }}</p>
            <p><strong>Moneda:</strong> EUR</p>
            <p><strong>Estado:</strong> Pendiente de pago</p>
          </div>
        </aside>
      </div>

      <div v-else class="empty card">
        <h3>No hay datos de pago</h3>
        <p>No encontramos la información del checkout.</p>
        <router-link to="/checkout" class="back-btn">Volver al checkout</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()
const procesando = ref(false)

const pedido = ref(JSON.parse(localStorage.getItem("checkout")) || null)

const subtotal = computed(() => {
  if (!pedido.value) return 0
  if (pedido.value.subtotal != null) return Number(pedido.value.subtotal)
  return (pedido.value.productos || []).reduce(
    (s, i) => s + Number(i.precio || 0) * Number(i.cantidad || 0),
    0
  )
})

const envio = computed(() => Number(pedido.value?.envio || 0))

const total = computed(() => Number(pedido.value?.total || subtotal.value + envio.value))

const cantidadTotal = computed(() =>
  (pedido.value?.productos || []).reduce((s, i) => s + Number(i.cantidad || 0), 0)
)

async function pagarBizum() {
  if (!pedido.value?.order_id) {
    alert("No se encontró el pedido.")
    return
  }

  procesando.value = true

  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", pedido.value.order_id)

  procesando.value = false

  if (error) {
    console.error(error)
    alert("No se pudo actualizar el pago. Intenta de nuevo.")
    return
  }

  localStorage.removeItem("carrito")
  router.push("/gracias")
}
</script>

<style scoped>
.payment-page{
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
}

.payment-wrap{
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 18px;
}

.payment-head{
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

.badge{
  color: #2563eb;
}

.badge.shipping{
  color: #16a34a;
}

.badge.payment{
  color: #7c3aed;
}

.payment-head h2{
  margin: 0;
  font-size: 36px;
  line-height: 1.04;
  font-weight: 1000;
  color: #111827;
  letter-spacing: -.7px;
}

.muted,
.summary-muted,
.secure-note,
.status-banner p,
.method-left p{
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 700;
}

.payment-layout{
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

.payment-main{
  padding: 24px;
}

.payment-summary{
  padding: 22px;
  position: sticky;
  top: 20px;
}

.status-banner{
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
  border: 1px solid #d1fae5;
  margin-bottom: 24px;
}

.status-icon{
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 18px;
  flex: 0 0 42px;
}

.info-section + .info-section{
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #eef2f7;
}

.info-section h3,
.summary-title{
  margin: 0;
  font-size: 24px;
  font-weight: 1000;
  color: #111827;
}

.info-card{
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  padding: 18px;
  display: grid;
  gap: 14px;
}

.info-card.highlight{
  border-color: rgba(34,197,94,0.35);
  box-shadow: 0 10px 22px rgba(34,197,94,0.08);
}

.info-row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.info-row.column{
  display: grid;
  justify-content: stretch;
}

.info-row span{
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
}

.info-row strong{
  color: #111827;
  font-size: 16px;
  font-weight: 1000;
  text-align: right;
}

.multiline{
  white-space: pre-line;
  text-align: left !important;
  line-height: 1.5;
}

.payment-method{
  margin-top: 16px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.payment-method.active{
  border-color: rgba(124,58,237,0.24);
  box-shadow: 0 10px 22px rgba(124,58,237,0.08);
}

.method-left{
  display: flex;
  gap: 12px;
  align-items: center;
}

.method-icon{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
  font-weight: 1000;
  font-size: 20px;
}

.method-pill{
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 12px;
  font-weight: 1000;
  display: inline-flex;
  align-items: center;
}

.pay-btn{
  margin-top: 18px;
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

.pay-btn:hover{
  transform: translateY(-1px);
  box-shadow:
    0 18px 34px rgba(34,197,94,0.34),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.pay-btn:disabled{
  opacity: .82;
  cursor: not-allowed;
  transform: none;
}

.summary-products{
  margin-top: 18px;
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

.summary-box{
  margin-top: 18px;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.summary-box p{
  margin: 6px 0;
  color: #374151;
  font-weight: 700;
}

.empty{
  padding: 28px;
  text-align: center;
}

.back-btn{
  display: inline-flex;
  margin-top: 14px;
  min-height: 46px;
  padding: 0 18px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  text-decoration: none;
  color: white;
  font-weight: 1000;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
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
  .payment-layout{
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .payment-summary{
    position: static;
    order: -1;
    padding: 18px;
  }

  .payment-main{
    padding: 20px;
  }
}

@media (max-width: 640px){
  .payment-page{
    padding: 10px;
    padding-bottom: 150px;
  }

  .payment-wrap{
    padding-top: 6px;
  }

  .payment-head{
    margin-bottom: 12px;
  }

  .payment-main,
  .payment-summary,
  .empty{
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

  .payment-head h2{
    font-size: 20px;
    line-height: 1.08;
    letter-spacing: -0.4px;
  }

  .muted,
  .summary-muted,
  .secure-note,
  .status-banner p,
  .method-left p{
    font-size: 12px;
    line-height: 1.4;
    margin-top: 4px;
  }

  .status-banner{
    padding: 12px;
    border-radius: 16px;
    gap: 10px;
    margin-bottom: 18px;
  }

  .status-icon{
    width: 36px;
    height: 36px;
    border-radius: 12px;
    font-size: 16px;
    flex: 0 0 36px;
  }

  .status-banner strong{
    font-size: 15px;
    line-height: 1.25;
  }

  .info-section + .info-section{
    margin-top: 18px;
    padding-top: 18px;
  }

  .info-section h3,
  .summary-title{
    font-size: 20px;
  }

  .info-card{
    margin-top: 12px;
    padding: 12px;
    border-radius: 16px;
    gap: 8px;
  }

  .info-row{
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-row span{
    font-size: 11.5px;
  }

  .info-row strong{
    font-size: 14px;
    text-align: left;
  }

  .payment-method{
    margin-top: 12px;
    padding: 14px;
    border-radius: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .method-left{
    gap: 10px;
  }

  .method-icon{
    width: 40px;
    height: 40px;
    border-radius: 12px;
    font-size: 17px;
  }

  .method-pill{
    min-height: 28px;
    font-size: 11px;
    padding: 0 10px;
    align-self: flex-start;
  }

  .pay-btn{
    margin-top: 14px;
    min-height: 46px;
    border-radius: 14px;
    font-size: 14px;
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

  .summary-box{
    margin-top: 12px;
    padding: 12px;
    border-radius: 14px;
  }

  .summary-box p{
    font-size: 12px;
    margin: 5px 0;
  }

  .back-btn{
    min-height: 42px;
    border-radius: 12px;
    font-size: 14px;
  }
}
</style>