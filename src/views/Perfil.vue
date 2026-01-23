<template>
  <div class="perfil-page">
    <h2>👤 Mi cuenta</h2>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else-if="user" class="layout">
      
      <!-- COLUMNA IZQUIERDA -->
      <div class="menu">
        <div class="email">{{ user.email }}</div>

        <button class="active">📦 Mis datos</button>
        <button disabled>🛒 Mis pedidos (próximamente)</button>

        <button class="logout" @click="logout">🚪 Cerrar sesión</button>
      </div>

      <!-- COLUMNA DERECHA -->
      <div class="contenido">
        <h3>📍 Datos de entrega</h3>

        <div class="form">
          <label>Nombre completo</label>
          <input v-model="nombre" placeholder="Tu nombre" />

          <label>Teléfono</label>
          <input v-model="telefono" placeholder="Tu teléfono" />

          <label>Dirección</label>
          <textarea v-model="direccion" placeholder="Dirección completa"></textarea>

          <button class="guardar" @click="guardar" :disabled="guardando">
            {{ guardando ? "Guardando..." : "💾 Guardar cambios" }}
          </button>
        </div>
      </div>

    </div>

    <div v-else>
      <p>No hay sesión</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "../supabase"
import { useRouter } from "vue-router"

const router = useRouter()

const user = ref(null)
const loading = ref(true)
const guardando = ref(false)

const nombre = ref("")
const telefono = ref("")
const direccion = ref("")

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  if (!user.value) {
    router.push("/login")
    return
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.value.id)
    .single()

  if (perfil) {
    nombre.value = perfil.nombre || ""
    telefono.value = perfil.telefono || ""
    direccion.value = perfil.direccion || ""
  }

  loading.value = false
})

async function guardar() {
  guardando.value = true

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.value.id,
    nombre: nombre.value,
    telefono: telefono.value,
    direccion: direccion.value,
  })

  guardando.value = false

  if (error) {
    console.error(error)
    alert("Error guardando perfil")
  } else {
    alert("Datos guardados correctamente")
  }
}

async function logout() {
  await supabase.auth.signOut()
  router.push("/")
}
</script>

<style scoped>
.perfil-page {
  max-width: 1000px;
  margin: 40px auto;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

/* MENU IZQUIERDO */
.menu {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu .email {
  font-weight: bold;
  margin-bottom: 10px;
}

.menu button {
  padding: 12px;
  border-radius: 8px;
  border: none;
  text-align: left;
  cursor: pointer;
  background: #f1f1f1;
}

.menu button.active {
  background: #28a745;
  color: white;
}

.menu button.logout {
  margin-top: 20px;
  background: #dc3545;
  color: white;
}

/* CONTENIDO */
.contenido {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.guardar {
  margin-top: 10px;
  background: #28a745;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
