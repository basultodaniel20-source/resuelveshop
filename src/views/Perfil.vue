<template>
  <div class="perfil">
    <!-- Top bar móvil -->
    <div class="topbar">
      <button class="burger" @click="drawer = true">☰</button>
      <h2>Mi cuenta</h2>
      <div class="email-mini" v-if="email">{{ email }}</div>
    </div>

    <!-- Drawer móvil -->
    <div v-if="drawer" class="overlay" @click="drawer = false"></div>
    <aside class="sidebar" :class="{ open: drawer }">
      <div class="userbox">
        <div class="user-email">{{ email }}</div>
      </div>

      <button
        class="navbtn"
        :class="{ active: tab === 'datos' }"
        @click="tab = 'datos'; drawer = false"
      >
        📦 Mis datos
      </button>

      <button class="navbtn muted" disabled>
        🛒 Mis pedidos (próximamente)
      </button>

      <button class="navbtn danger" @click="cerrarSesion">
        🚪 Cerrar sesión
      </button>
    </aside>

    <!-- Contenido -->
    <main class="content">
      <div class="card" v-if="loading">
        Cargando...
      </div>

      <div class="card" v-else>
        <h3 class="cardtitle">📍 Datos de entrega</h3>

        <div class="grid">
          <label>
            Nombre completo
            <input v-model="form.nombre" placeholder="Tu nombre" />
          </label>

          <label>
            Teléfono
            <input v-model="form.telefono" placeholder="Tu teléfono" />
          </label>

          <label class="full">
            Dirección
            <textarea v-model="form.direccion" placeholder="Dirección completa"></textarea>
          </label>
        </div>

        <button class="save" @click="guardar" :disabled="saving">
          💾 {{ saving ? "Guardando..." : "Guardar cambios" }}
        </button>

        <p v-if="msg" class="msg" :class="{ ok: msgOk, bad: !msgOk }">
          {{ msg }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const drawer = ref(false)
const tab = ref("datos")

const loading = ref(true)
const saving = ref(false)
const msg = ref("")
const msgOk = ref(true)

const email = ref("")

const form = reactive({
  nombre: "",
  telefono: "",
  direccion: "",
})

async function cargarPerfil() {
  loading.value = true
  msg.value = ""

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    router.push("/login")
    return
  }

  email.value = user.email || ""

  // Traer perfil
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion")
    .eq("id", user.id)
    .maybeSingle()

  // Si no existe aún, lo creamos vacío
  if (!data && !error) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      nombre: "",
      telefono: "",
      direccion: "",
    })
  }

  if (data) {
    form.nombre = data.nombre || ""
    form.telefono = data.telefono || ""
    form.direccion = data.direccion || ""
  }

  loading.value = false
}

async function guardar() {
  saving.value = true
  msg.value = ""

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    router.push("/login")
    return
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      nombre: form.nombre,
      telefono: form.telefono,
      direccion: form.direccion,
    })

  if (error) {
    msgOk.value = false
    msg.value = "Error al guardar. Revisa políticas RLS de profiles."
    console.error(error)
  } else {
    msgOk.value = true
    msg.value = "Guardado ✅"
  }

  saving.value = false
}

async function cerrarSesion() {
  await supabase.auth.signOut()
  router.push("/")
}

onMounted(cargarPerfil)
</script>

<style scoped>
.perfil {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 14px;
}

.topbar {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: white;
  border-radius: 14px;
}

.burger {
  border: none;
  background: #f1f1f1;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 18px;
}

.email-mini {
  margin-left: auto;
  font-size: 12px;
  opacity: .7;
}

.sidebar {
  background: white;
  border-radius: 16px;
  padding: 14px;
  height: fit-content;
  position: sticky;
  top: 90px;
}

.userbox {
  padding: 12px;
  border-radius: 14px;
  background: #f6f7f8;
  margin-bottom: 10px;
}

.user-email {
  font-weight: 700;
  word-break: break-all;
}

.navbtn {
  width: 100%;
  text-align: left;
  border: 1px solid #ececec;
  background: white;
  padding: 12px 12px;
  border-radius: 12px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 700;
}

.navbtn.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.navbtn.muted {
  opacity: .45;
  cursor: not-allowed;
}

.navbtn.danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.content .card {
  background: white;
  border-radius: 16px;
  padding: 18px;
}

.cardtitle {
  margin: 0 0 14px 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
}

input, textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.full {
  grid-column: 1 / -1;
}

.save {
  margin-top: 14px;
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.msg {
  margin-top: 10px;
  font-weight: 700;
}
.msg.ok { color: #1a7f37; }
.msg.bad { color: #b42318; }

/* MÓVIL */
@media (max-width: 900px) {
  .perfil {
    grid-template-columns: 1fr;
  }

  .topbar {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 300px;
    max-width: 85vw;
    transform: translateX(-110%);
    transition: transform .2s ease;
    z-index: 9999;
    border-radius: 0 16px 16px 0;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    z-index: 9998;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
