<template>
  <div class="checkout">
    <h2>Finalizar pedido</h2>

    <!-- RESUMEN -->
    <div class="resumen">
      <h3>Tu pedido</h3>

      <div v-for="item in carrito" :key="item.id" class="linea">
        <span>{{ item.nombre }} x{{ item.cantidad }}</span>
        <b>{{ item.precio * item.cantidad }} €</b>
      </div>

      <div class="total">
        Total: <b>{{ total }} €</b>
      </div>
    </div>

    <!-- FORMULARIO -->
    <form class="form" @submit.prevent="continuar">
      <h3>Datos de entrega</h3>

      <input v-model="nombre" placeholder="Nombre completo" required />
      <input v-model="telefono" placeholder="Teléfono" required />
      <textarea v-model="direccion" placeholder="Dirección completa" required></textarea>
      <textarea v-model="notas" placeholder="Notas (opcional)"></textarea>

      <button class="pagar-btn">
        Continuar al pago (Bizum)
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"


const router = useRouter()

// Cargar carrito desde localStorage
const carrito = ref(JSON.parse(localStorage.getItem("carrito")) || [])

if (carrito.value.length === 0) {
  router.push("/carrito")
}

// Formulario
const nombre = ref("")
const telefono = ref("")
const direccion = ref("")
const notas = ref("")

const total = computed(() =>
  carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0)
)
async function continuar() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    alert("Debes iniciar sesión")
    router.push("/login")
    return
  }

  const pedido = {
    productos: carrito.value,
    total: total.value,
    direccion: direccion.value,
    telefono: telefono.value,
    nombre: nombre.value,
    notas: notas.value,
  }

  // ✅ Guardamos SOLO en localStorage
  localStorage.setItem("checkout", JSON.stringify(pedido))

  // 👉 Ir a pago
  router.push("/pago")
}


</script>

<style scoped>
.checkout {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 16px;
}

.resumen {
  margin-bottom: 24px;
}

.linea {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.total {
  margin-top: 12px;
  font-size: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form input,
.form textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.pagar-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
}
</style>
