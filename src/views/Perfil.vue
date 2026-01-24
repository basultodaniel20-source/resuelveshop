<template>
  <div class="perfil-page">
    <!-- Top bar (solo móvil) -->
    <div class="topbar">
      <button class="hamb-btn" @click="drawer = true" aria-label="Abrir menú">
        ☰
      </button>

      <div class="topbar-title">
        <span class="avatar">👤</span>
        <span>Mi cuenta</span>
      </div>

      <router-link to="/carrito" class="topbar-cart">
        🛒
      </router-link>
    </div>

    <!-- Overlay + Drawer (móvil) -->
    <div v-if="drawer" class="overlay" @click="drawer = false"></div>
    <aside class="drawer" :class="{ open: drawer }">
      <div class="drawer-head">
        <div class="drawer-user">
          <div class="drawer-avatar">👤</div>
          <div class="drawer-info">
            <div class="drawer-email">{{ user?.email }}</div>
            <div class="drawer-sub">Cuenta</div>
          </div>
        </div>

        <button class="drawer-close" @click="drawer = false" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <nav class="drawer-nav">
        <button
          class="nav-item"
          :class="{ active: tab === 'datos' }"
          @click="tab = 'datos'; drawer = false"
        >
          📦 Mis datos
        </button>

        <button
          class="nav-item"
          :class="{ active: tab === 'pedidos' }"
          @click="tab = 'pedidos'; drawer = false"
        >
          🧾 Mis pedidos
          <span class="badge">NEW</span>
        </button>

        <router-link class="nav-item" to="/" @click="drawer = false">
          🏠 Inicio
        </router-link>

        <router-link class="nav-item" to="/carrito" @click="drawer = false">
          🛒 Carrito
        </router-link>

        <button class="nav-item danger" @click="cerrarSesion">
          🚪 Cerrar sesión
        </button>
      </nav>
    </aside>

    <!-- Layout escritorio -->
    <div class="layout">
      <!-- Sidebar (escritorio/tablet) -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="user-block">
            <div class="user-avatar">👤</div>
            <div class="user-meta">
              <div class="user-email">{{ user?.email }}</div>
              <div class="user-sub">Cuenta</div>
            </div>
          </div>

          <div class="sidebar-actions">
            <button class="side-btn" :class="{ active: tab === 'datos' }" @click="tab='datos'">
              📦 Mis datos
            </button>
            <button class="side-btn" :class="{ active: tab === 'pedidos' }" @click="tab='pedidos'">
              🧾 Mis pedidos
              <span class="badge">NEW</span>
            </button>

            <div class="sep"></div>

            <router-link class="side-btn ghost" to="/">
              🏠 Inicio
            </router-link>
            <router-link class="side-btn ghost" to="/carrito">
              🛒 Carrito
            </router-link>

            <button class="side-btn danger" @click="cerrarSesion">
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="main">
        <div class="main-card">
          <div class="main-head">
            <h2>{{ tab === 'datos' ? "Datos de entrega" : "Mis pedidos" }}</h2>
            <p class="muted" v-if="tab === 'datos'">
              Guarda tus datos para que el checkout sea más rápido.
            </p>
            <p class="muted" v-else>
              Aquí verás tus pedidos. (Si aún no lo tienes, te lo activo en el siguiente paso.)
            </p>
          </div>

          <!-- DATOS -->
          <form v-if="tab === 'datos'" class="form" @submit.prevent="guardar">
            <div class="grid">
              <div class="field">
                <label>Nombre completo</label>
                <input v-model="form.nombre" placeholder="Tu nombre" required />
              </div>

              <div class="field">
                <label>Teléfono</label>
                <input v-model="form.telefono" placeholder="Tu teléfono" required />
              </div>

              <div class="field full">
                <label>Dirección</label>
                <textarea v-model="form.direccion" placeholder="Dirección completa" rows="3" required />
              </div>
            </div>

            <button class="save" type="submit" :disabled="saving">
              💾 {{ saving ? "Guardando..." : "Guardar cambios" }}
            </button>

            <p class="ok" v-if="okMsg">{{ okMsg }}</p>
            <p class="err" v-if="errMsg">{{ errMsg }}</p>
          </form>

          <!-- PEDIDOS -->
          <div v-else class="pedidos">
            <div class="empty">
              <div class="empty-ico">🧾</div>
              <div class="empty-title">Próximamente</div>
              <div class="empty-text">
                Ya estás listo. En el próximo paso te activo el listado de pedidos aquí.
              </div>
              <button class="save" @click="tab='datos'">
                Volver a mis datos
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const user = ref(null)
const drawer = ref(false)
const tab = ref("datos")

const saving = ref(false)
const okMsg = ref("")
const errMsg = ref("")

const form = ref({
  nombre: "",
  telefono: "",
  direccion: "",
})

async function cargarPerfil() {
  const { data: u } = await supabase.auth.getUser()
  user.value = u.user

  if (!user.value) {
    router.push("/login")
    return
  }

  // Traer profile actual
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion")
    .eq("id", user.value.id)
    .single()

  if (!error && data) {
    form.value.nombre = data.nombre || ""
    form.value.telefono = data.telefono || ""
    form.value.direccion = data.direccion || ""
  }
}

async function guardar() {
  if (!user.value) return

  saving.value = true
  okMsg.value = ""
  errMsg.value = ""

  const payload = {
    id: user.value.id,
    email: user.value.email,
    nombre: form.value.nombre,
    telefono: form.value.telefono,
    direccion: form.value.direccion,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("profiles").upsert(payload)

  saving.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo guardar. Intenta de nuevo."
    return
  }

  okMsg.value = "✅ Guardado correctamente"
}

async function cerrarSesion() {
  await supabase.auth.signOut()
  router.push("/")
}

onMounted(() => {
  cargarPerfil()
})
</script>

<style scoped>
/* Página */
.perfil-page {
  padding: 18px;
  background: #f5f6f8;
  min-height: calc(100vh - 0px);
}

/* Topbar (móvil) */
.topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  margin-bottom: 14px;
}

.hamb-btn {
  border: none;
  background: #f0f0f0;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  font-size: 18px;
  cursor: pointer;
}

.topbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #e8f5e9;
  display: grid;
  place-items: center;
}

.topbar-cart {
  text-decoration: none;
  background: #28a745;
  color: white;
  font-weight: 800;
  border-radius: 999px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
}

/* Drawer (móvil) */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 5000;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 82%;
  max-width: 320px;
  height: 100vh;
  background: white;
  z-index: 6000;
  transform: translateX(-105%);
  transition: transform .18s ease;
  box-shadow: 20px 0 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
}

.drawer.open { transform: translateX(0); }

.drawer-head {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.drawer-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #e8f5e9;
  display: grid;
  place-items: center;
  font-size: 18px;
}

.drawer-email {
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
}

.drawer-sub {
  color: #6b7280;
  font-size: 12px;
}

.drawer-close {
  border: none;
  background: #f0f0f0;
  border-radius: 12px;
  width: 38px;
  height: 38px;
  cursor: pointer;
}

.drawer-nav {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  width: 100%;
  text-align: left;
  border: 1px solid #eee;
  background: white;
  padding: 12px 12px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  color: #111;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-item.active {
  border-color: #28a745;
  background: #e8f5e9;
}

.nav-item.danger {
  border-color: #fecaca;
  background: #fff1f2;
  color: #991b1b;
}

.badge {
  margin-left: auto;
  background: #111;
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
}

/* Layout escritorio */
.layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;
  align-items: start;
}

.sidebar-card,
.main-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.user-block {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #e8f5e9;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.user-email {
  font-weight: 900;
  font-size: 14px;
}

.user-sub {
  font-size: 12px;
  color: #6b7280;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-btn {
  border: none;
  border-radius: 14px;
  padding: 12px;
  font-weight: 900;
  text-align: left;
  cursor: pointer;
  background: #f3f4f6;
  color: #111;
  display: flex;
  align-items: center;
  gap: 10px;
}

.side-btn.active {
  background: #28a745;
  color: white;
}

.side-btn.ghost {
  background: #fff;
  border: 1px solid #eee;
  text-decoration: none;
}

.side-btn.danger {
  background: #dc3545;
  color: white;
}

.sep {
  height: 1px;
  background: #eee;
  margin: 6px 0;
}

.main-head h2 {
  margin: 0;
  font-size: 20px;
}

.muted {
  margin: 6px 0 0 0;
  color: #6b7280;
  font-size: 13px;
}

.form {
  margin-top: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  margin-bottom: 6px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 15px;
}

.field input:focus,
.field textarea:focus {
  border-color: #28a745;
}

.field.full {
  grid-column: 1 / -1;
}

.save {
  margin-top: 14px;
  background: #28a745;
  border: none;
  color: white;
  font-weight: 900;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
}

.save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ok {
  margin-top: 10px;
  color: #166534;
  font-weight: 800;
}

.err {
  margin-top: 10px;
  color: #991b1b;
  font-weight: 800;
}

/* Pedidos placeholder */
.pedidos .empty {
  margin-top: 12px;
  padding: 18px;
  border: 1px dashed #e5e7eb;
  border-radius: 16px;
  text-align: center;
}
.empty-ico { font-size: 34px; }
.empty-title { font-weight: 900; margin-top: 6px; }
.empty-text { color: #6b7280; font-size: 13px; margin-top: 6px; }

/* Responsive */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .topbar {
    display: flex;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
