<template>
  <div style="max-width:600px;margin:40px auto;background:white;padding:20px;border-radius:16px;">
    <h2>Pago</h2>

    <div v-if="!data">
      <p>No hay datos de pedido.</p>
    </div>

    <div v-else>
      <p><b>Cliente:</b> {{ data.nombre }}</p>
      <p><b>Dirección:</b> {{ data.direccion }}</p>

      <h3>Total: {{ total }} €</h3>

      <button @click="pagar" :disabled="procesando"> 
        {{ procesando ? "Procesando..." : "Pagar por Bizum" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const data = ref(null)
const procesando = ref(false)

onMounted(() => {
  const guardado = localStorage.getItem("checkout")
  if (guardado) {
    data.value = JSON.parse(guardado)
  }
})

const total = computed(() => {
  if (!data.value || !data.value.productos) return 0
  return data.value.productos.reduce(
    (s, i) => s + i.precio * i.cantidad,
    0
  )
})
async function pagar() {
  if (procesando.value) return
  procesando.value = true

  if (!data.value) {
    alert("No hay datos del pedido")
    procesando.value = false
    return
  }

  try {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      alert("Debes iniciar sesión")
      router.push({ path: "/login", query: { redirect: "/pago" } })
      return
    }

    // ✅ Debe venir del checkout
    const orderId = data.value.order_id
    if (!orderId) {
      alert("Falta el ID del pedido. Vuelve al checkout.")
      router.push("/checkout")
      return
    }

    // ✅ Aquí simulas pago OK (Bizum real lo harías con backend)
    const { error } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error Supabase:", error)
      alert("Error al confirmar el pago")
      return
    }

    alert("✅ Pago realizado. Pedido confirmado.")

    localStorage.removeItem("carrito")
localStorage.removeItem("checkout")

// 🔔 Avisar a la app de que el carrito cambió
window.dispatchEvent(new Event("carrito-actualizado"))


    router.push("/account/orders")
  } catch (e) {
    console.error("Error inesperado:", e)
    alert("Error inesperado")
  } finally {
    procesando.value = false
  }
}

</script>

