<template>
  <div class="perfil-page">
    <!-- Top bar (solo móvil) -->
    <div class="topbar">
      <button class="hamb-btn" @click="drawer = true" aria-label="Abrir menú">
        ☰
      </button>

      <div class="topbar-title">
        <div class="avatar avatar--sm">{{ iniciales }}</div>
        <div class="title-text">
          <div class="t1">Mi cuenta</div>
          <div class="t2">{{ user?.email }}</div>
        </div>
      </div>

      <button class="topbar-logout" @click="cerrarSesion" aria-label="Cerrar sesión">
        🚪
      </button>
    </div>

    <!-- Overlay + Drawer (móvil) -->
    <div v-if="drawer" class="overlay" @click="drawer = false"></div>

    <aside class="drawer" :class="{ open: drawer }" aria-label="Menú">
      <div class="drawer-head">
        <div class="drawer-user">
          <div class="avatar avatar--md">{{ iniciales }}</div>
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
          <span class="badge">PROX</span>
        </button>

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
            <div class="avatar avatar--lg">{{ iniciales }}</div>
            <div class="user-meta">
              <div class="user-name">{{ form.nombre || "Tu cuenta" }}</div>
              <div class="user-email">{{ user?.email }}</div>
            </div>
          </div>

          <div class="sidebar-actions">
            <button class="side-btn" :class="{ active: tab === 'datos' }" @click="tab='datos'">
              📦 Mis datos
            </button>

            <button class="side-btn" :class="{ active: tab === 'pedidos' }" @click="tab='pedidos'">
              🧾 Mis pedidos
              <span class="badge">PROX</span>
            </button>

            <div class="sep"></div>

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
            <div class="head-left">
              <h2>{{ tab === 'datos' ? "Datos de entrega" : "Mis pedidos" }}</h2>

              <p class="muted" v-if="tab === 'datos'">
                Guarda tus datos para que el checkout sea más rápido.
              </p>
              <p class="muted" v-else>
                Aquí verás tus pedidos. (Lo activamos en el siguiente paso.)
              </p>
            </div>

            <!-- Tabs pro -->
            <div class="tabs">
              <button class="pill" :class="{ on: tab==='datos' }" @click="tab='datos'">📦 Datos</button>
              <button class="pill" :class="{ on: tab==='pedidos' }" @click="tab='pedidos'">🧾 Pedidos</button>
            </div>
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
              <span v-if="saving" class="spinner" aria-hidden="true"></span>
              {{ saving ? "Guardando..." : "Guardar cambios" }}
            </button>

            <transition name="fadeUp">
              <p class="ok" v-if="okMsg">{{ okMsg }}</p>
            </transition>

            <transition name="fadeUp">
              <p class="err" v-if="errMsg">{{ errMsg }}</p>
            </transition>
          </form>

          <!-- PEDIDOS -->
          <div v-else class="pedidos">
            <div class="empty">
              <div class="empty-ico">🧾</div>
              <div class="empty-title">Próximamente</div>
              <div class="empty-text">
                Ya estás listo. En el próximo paso te activo el listado real de pedidos aquí.
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
import { ref, onMounted, computed } from "vue"
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

/* ✅ Iniciales */
const iniciales = computed(() => {
  const nombre = (form.value.nombre || "").trim()
  if (nombre) {
    const parts = nombre.split(/\s+/).filter(Boolean)
    const a = parts[0]?.[0] || ""
    const b = parts[1]?.[0] || parts[0]?.[1] || ""
    return (a + b).toUpperCase()
  }
  const email = (user.value?.email || "").trim()
  if (email) return email.slice(0, 2).toUpperCase()
  return "U"
})

async function cargarPerfil() {
  const { data: u } = await supabase.auth.getUser()
  user.value = u.user

  if (!user.value) {
    router.push("/login")
    return
  }

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

  // ✅ Tu columna updated_at es DATE -> YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10)

  const payload = {
    id: user.value.id,
    email: user.value.email,
    nombre: form.value.nombre,
    telefono: form.value.telefono,
    direccion: form.value.direccion,
    updated_at: today,
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })

  saving.value = false

  if (error) {
    console.error(error)
    errMsg.value = "No se pudo guardar. Intenta de nuevo."
    return
  }

  okMsg.value = "✅ Guardado correctamente"
  // auto-ocultar a los 2.5s
  setTimeout(() => { okMsg.value = "" }, 2500)
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
  min-height: 100vh;
}

/* Avatar iniciales */
.avatar {
  display: grid;
  place-items: center;
  font-weight: 900;
  border-radius: 16px;
  background: #e8f5e9;
  color: #14532d;
  border: 1px solid rgba(40,167,69,0.25);
  user-select: none;
}
.avatar--sm { width: 40px; height: 40px; border-radius: 14px; font-size: 14px; }
.avatar--md { width: 44px; height: 44px; border-radius: 14px; font-size: 15px; }
.avatar--lg { width: 54px; height: 54px; border-radius: 18px; font-size: 16px; }

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

.hamb-btn,
.topbar-logout {
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
  font-weight: 900;
  flex: 1;
  min-width: 0;
}

.title-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.t1 { font-size: 14px; }
.t2 {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.drawer-email {
  font-weight: 900;
  font-size: 13px;
  line-height: 1.2;
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  font-weight: 900;
  cursor: pointer;
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

.user-meta { min-width: 0; }
.user-name {
  font-weight: 900;
  font-size: 14px;
}
.user-email {
  font-weight: 700;
  font-size: 12px;
  color: #6b7280;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.side-btn.danger {
  background: #dc3545;
  color: white;
}

.sep {
  height: 1px;
  background: #eee;
  margin: 6px 0;
}

/* Main */
.main-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
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

/* Tabs tipo tienda */
.tabs {
  display: flex;
  gap: 10px;
  background: #f3f4f6;
  padding: 6px;
  border-radius: 999px;
  height: fit-content;
}
.pill {
  border: none;
  background: transparent;
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
}
.pill.on {
  background: white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.06);
}

/* Form */
.form { margin-top: 14px; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 900;
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
  background: white;
}
.field input:focus,
.field textarea:focus { border-color: #28a745; }

.field.full { grid-column: 1 / -1; }

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
  transition: transform .12s ease, opacity .12s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.save:active { transform: scale(0.98); }
.save:disabled { opacity: 0.75; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.45);
  border-top-color: white;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.ok {
  margin-top: 10px;
  color: #166534;
  font-weight: 900;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 12px;
}

.err {
  margin-top: 10px;
  color: #991b1b;
  font-weight: 900;
  background: #fff1f2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 12px;
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

/* Animaciones feedback */
.fadeUp-enter-active, .fadeUp-leave-active {
  transition: all .18s ease;
}
.fadeUp-enter-from, .fadeUp-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Responsive */
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .topbar { display: flex; }
  .grid { grid-template-columns: 1fr; }
}
</style>
