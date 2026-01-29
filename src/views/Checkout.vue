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

    <button class="pagar-btn" :disabled="cargandoPerfil">
  {{ cargandoPerfil ? "Cargando datos..." : "Continuar al pago (Bizum)" }}
</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
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

const cargandoPerfil = ref(true)

const total = computed(() =>
  carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0)
)

onMounted(async () => {
  // ✅ Si no hay usuario, manda a login y vuelve
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) {
    router.push({ path: "/login", query: { redirect: "/checkout" } })
    return
  }

  // ✅ Autocompletar con profiles
  const { data: prof, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion")
    .eq("id", user.id)
    .single()

  cargandoPerfil.value = false

  if (!error && prof) {
    nombre.value = prof.nombre || ""
    telefono.value = prof.telefono || ""
    direccion.value = prof.direccion || ""
  }
})

async function continuar() {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    alert("Debes iniciar sesión")
    router.push({ path: "/login", query: { redirect: "/checkout" } })
    return
  }

  // (Pro) Guardar datos de envío en profiles
  const today = new Date().toISOString().slice(0, 10)
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      nombre: nombre.value,
      telefono: telefono.value,
      direccion: direccion.value,
      updated_at: today,
    },
    { onConflict: "id" }
  )

  // ✅ Crear pedido en Supabase (PENDING)
  const orderPayload = {
    user_id: user.id,
    status: "pending",
    total: total.value,
    currency: "EUR",
    items: carrito.value.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      precio: i.precio,
      cantidad: i.cantidad,
      imagen: i.imagen || null,
    })),
    shipping: {
      nombre: nombre.value,
      telefono: telefono.value,
      direccion: direccion.value,
      notas: notas.value || "",
    },
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select("id")
    .single()

  if (error) {
    console.error(error)
    alert("No se pudo crear el pedido. Intenta de nuevo.")
    return
  }

  // Guardamos checkout local con order_id real
  const pedido = {
    order_id: order.id,
    productos: carrito.value,
    total: total.value,
    direccion: direccion.value,
    telefono: telefono.value,
    nombre: nombre.value,
    notas: notas.value,
  }

  localStorage.setItem("checkout", JSON.stringify(pedido))
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
