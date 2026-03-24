<template>
  <div v-if="visible" class="pending-banner">
    <div class="pending-left">
      <div class="pending-icon">!</div>
      <div>
        <strong>Tienes un pedido pendiente</strong>
      </div>
    </div>

    <div class="pending-actions">
      <button type="button" class="pending-btn ghost" @click="descartar">
        Descartar
      </button>
      <button type="button" class="pending-btn primary" @click="continuarPago">
        Continuar pago
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const visible = ref(false)

function revisarPedidoPendiente() {
  const pending = localStorage.getItem("checkout_pending_internacional")
  visible.value = !!pending
}

function continuarPago() {
  router.push("/internacional/pago")
}

function descartar() {
  localStorage.removeItem("checkout_pending_internacional")
  localStorage.removeItem("metodo_pago_internacional")
  visible.value = false
  window.dispatchEvent(new CustomEvent("pedido-pendiente-actualizado"))
}

onMounted(() => {
  revisarPedidoPendiente()
  window.addEventListener("pedido-pendiente-actualizado", revisarPedidoPendiente)
  window.addEventListener("storage", revisarPedidoPendiente)
})

onBeforeUnmount(() => {
  window.removeEventListener("pedido-pendiente-actualizado", revisarPedidoPendiente)
  window.removeEventListener("storage", revisarPedidoPendiente)
})
</script>

<style scoped>
.pending-banner{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid #d1fae5;
  background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
  box-shadow:
    0 12px 24px rgba(34,197,94,0.08),
    0 4px 10px rgba(15,23,42,0.03);
}

.pending-left{
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.pending-icon{
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 18px;
  flex: 0 0 40px;
}

.pending-left strong{
  display: block;
  color: #111827;
  font-size: 16px;
  font-weight: 1000;
}

.pending-left p{
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 700;
}

.pending-actions{
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pending-btn{
  min-height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 1000;
  cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
}

.pending-btn:hover{
  transform: translateY(-1px);
}

.pending-btn.ghost{
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}

.pending-btn.primary{
  border: none;
  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  box-shadow:
    0 12px 22px rgba(34,197,94,0.20),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

@media (max-width: 640px){
  .pending-banner{
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    border-radius: 16px;
    gap: 12px;
  }

  .pending-left strong{
    font-size: 15px;
  }

  .pending-left p{
    font-size: 12px;
  }

  .pending-actions{
    width: 100%;
    flex-direction: column;
  }

  .pending-btn{
    width: 100%;
    min-height: 40px;
    font-size: 12px;
  }
}
</style>