<template>
  <section class="carrito-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">ResuelveShop · Cuba</p>
        <h1>Tu carrito</h1>
        <p class="muted">
          Revisa tus productos antes de continuar al checkout.
        </p>
      </div>
    </div>

    <div v-if="!carrito.length" class="empty">
      <div class="emptyIcon">🛒</div>
      <h3>Tu carrito está vacío</h3>
      <p>Añade productos desde el catálogo para continuar.</p>
      <router-link class="btn primary" to="/cuba/catalogo">
        Ir al catálogo
      </router-link>
    </div>

    <div v-else class="layout">
      <div class="itemsWrap">
        <transition-group name="fade" tag="div" class="itemsList">
          <article
            v-for="item in carrito"
            :key="item.id"
            class="itemCard"
          >
            <router-link
              :to="`/cuba/producto/${item.id}`"
              class="thumb"
            >
              <img :src="item.imagen" :alt="item.nombre" />
            </router-link>

            <div class="info">
              <router-link
                :to="`/cuba/producto/${item.id}`"
                class="titleLink"
              >
                <h3>{{ item.nombre }}</h3>
              </router-link>

              <p class="unitPrice">{{ formatMoney(item.precio) }} c/u</p>

              <div class="lineTotal">
                {{ item.cantidad }} x {{ formatMoney(item.precio) }}
                <strong>= {{ formatMoney(item.precio * item.cantidad) }}</strong>
              </div>
            </div>

            <div class="controls">
              <div class="qtyBox">
                <button @click="menos(item)">−</button>
                <span>{{ item.cantidad }}</span>
                <button @click="mas(item)">+</button>
              </div>

              <button class="removeBtn" @click="eliminar(item)">
                Eliminar
              </button>
            </div>
          </article>
        </transition-group>
      </div>

      <aside class="summaryCard">
        <div class="summaryTitle">Resumen del pedido</div>

        <div class="summaryRow">
          <span>Productos</span>
          <strong>{{ totalItems }}</strong>
        </div>

        <div class="summaryRow">
          <span>Subtotal</span>
          <strong>{{ formatMoney(total) }}</strong>
        </div>

        <div class="summaryRow totalRow">
          <span>Total</span>
          <strong>{{ formatMoney(total) }}</strong>
        </div>

        <router-link class="btn primary full" to="/cuba/checkout">
          Finalizar pedido
        </router-link>

        <router-link class="btn ghost full" to="/cuba/catalogo">
          Seguir comprando
        </router-link>
      </aside>
    </div>

    <div v-if="carrito.length" class="mobileCheckoutBar">
      <div class="mobileTotal">
        <span>Total</span>
        <strong>{{ formatMoney(total) }}</strong>
      </div>

      <router-link class="mobileBtn" to="/cuba/checkout">
        Finalizar
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  carrito: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["agregar", "eliminar"])

function mas(item) {
  emit("agregar", { ...item, cantidad: 1 })
}

function menos(item) {
  if ((item.cantidad || 1) <= 1) {
    emit("eliminar", item)
    return
  }

  const actualizado = { ...item, cantidad: item.cantidad - 1 }
  emit("eliminar", item)
  emit("agregar", actualizado)
}

function eliminar(item) {
  emit("eliminar", item)
}

const total = computed(() =>
  props.carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  )
)

const totalItems = computed(() =>
  props.carrito.reduce((acc, item) => acc + Number(item.cantidad || 0), 0)
)

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} €`
}
</script>

<style scoped>
.carrito-page{
  padding: 10px 4px 28px;
}

.page-head{
  margin-bottom: 14px;
}

.eyebrow{
  margin: 0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 1000;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.page-head h1{
  margin: 6px 0 0;
  font-size: 30px;
  line-height: 1.05;
  font-weight: 1000;
}

.muted{
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
}

.layout{
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 18px;
  align-items: start;
}

.itemsList{
  display: grid;
  gap: 12px;
}

.itemCard{
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.thumb{
  width: 110px;
  height: 110px;
  border-radius: 16px;
  background: #fafafa;
  display: grid;
  place-items: center;
  text-decoration: none;
  border: 1px solid rgba(0,0,0,0.05);
}

.thumb img{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.info{
  min-width: 0;
}

.titleLink{
  text-decoration: none;
  color: inherit;
}

.info h3{
  margin: 0;
  font-size: 17px;
  font-weight: 1000;
  line-height: 1.2;
}

.unitPrice{
  margin: 8px 0 0;
  color: #16a34a;
  font-size: 14px;
  font-weight: 1000;
}

.lineTotal{
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.4;
}

.controls{
  display: grid;
  gap: 10px;
  justify-items: end;
}

.qtyBox{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f5f6f8;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 6px;
  border-radius: 999px;
}

.qtyBox button{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: none;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease;
}

.qtyBox button:hover{
  background: #eceff3;
  transform: translateY(-1px);
}

.qtyBox span{
  min-width: 24px;
  text-align: center;
  font-weight: 1000;
}

.removeBtn{
  border: none;
  background: #fff1f2;
  color: #991b1b;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 1000;
  cursor: pointer;
}

.summaryCard{
  position: sticky;
  top: calc(var(--header-h, 120px) + 10px);
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.summaryTitle{
  font-size: 16px;
  font-weight: 1000;
  margin-bottom: 12px;
}

.summaryRow{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  font-size: 14px;
  color: #374151;
  font-weight: 900;
}

.totalRow{
  border-bottom: none;
  font-size: 16px;
  color: #111827;
  padding-top: 14px;
}

.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 1000;
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: 10px;
}

.btn.full{
  width: 100%;
}

.btn.primary{
  background: #28a745;
  color: white;
}

.btn.ghost{
  background: white;
  color: #111;
  border: 1px solid rgba(0,0,0,0.10);
}

.empty{
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 28px 18px;
  text-align: center;
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.emptyIcon{
  width: 64px;
  height: 64px;
  margin: 0 auto;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 28px;
}

.empty h3{
  margin: 14px 0 0;
  font-size: 22px;
  font-weight: 1000;
}

.empty p{
  margin-top: 10px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 900;
}

.mobileCheckoutBar{
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

@media (max-width: 900px){
  .carrito-page{
    padding-bottom: calc(var(--bottom-nav-h, 76px) + env(safe-area-inset-bottom) + 90px);
  }

  .layout{
    grid-template-columns: 1fr;
  }

  .summaryCard{
    display: none;
  }

  .itemCard{
    grid-template-columns: 88px 1fr;
    gap: 12px;
    align-items: start;
  }

  .thumb{
    width: 88px;
    height: 88px;
  }

  .controls{
    grid-column: 1 / -1;
    justify-items: stretch;
  }

  .qtyBox{
    justify-content: center;
  }

  .removeBtn{
    width: 100%;
  }

  .page-head h1{
    font-size: 24px;
  }

  .mobileCheckoutBar{
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(var(--bottom-nav-h, 76px) + env(safe-area-inset-bottom) + 10px);
    z-index: 9998;
    background: white;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 14px 30px rgba(0,0,0,0.14);
    border-radius: 18px;
    padding: 10px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
  }

  .mobileTotal{
    display: grid;
  }

  .mobileTotal span{
    color: #6b7280;
    font-size: 12px;
    font-weight: 900;
  }

  .mobileTotal strong{
    font-size: 18px;
    font-weight: 1000;
  }

  .mobileBtn{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: #28a745;
    color: white;
    font-weight: 1000;
    border-radius: 14px;
    padding: 12px 14px;
    min-width: 120px;
  }
}
</style>