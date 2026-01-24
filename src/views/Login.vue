<template>
  <div class="auth-page">
    <div class="card">
      <h2>Iniciar sesión</h2>
      <p class="muted">Accede para finalizar pedidos y guardar tus datos.</p>

      <form class="form" @submit.prevent="login">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <p class="err" v-if="errMsg">{{ errMsg }}</p>
      </form>

      <div class="links">
        <button class="link-btn" @click="mostrarReset = true" type="button">
          ¿Olvidaste tu contraseña?
        </button>

        <router-link class="link" to="/register">
          ¿No tienes cuenta? <b>Crear cuenta</b>
        </router-link>
      </div>
    </div>

    <!-- MODAL RESET -->
    <div v-if="mostrarReset" class="overlay" @click="cerrarReset"></div>

    <div v-if="mostrarReset" class="modal">
      <div class="modal-card">
        <div class="modal-head">
          <h3>Recuperar contraseña</h3>
          <button class="x" @click="cerrarReset" type="button">✕</button>
        </div>

        <p class="muted">
          Te enviamos un enlace a tu email para crear una nueva contraseña.
        </p>

        <div class="field">
          <label>Email</label>
          <input v-model="resetEmail" type="email" placeholder="tu@email.com" />
        </div>

        <button class="btn" @click="enviarReset" :disabled="resetLoading" type="button">
          {{ resetLoading ? "Enviando..." : "Enviar enlace" }}
        </button>

        <p class="ok" v-if="resetOk">{{ resetOk }}</p>
        <p class="err" v-if="resetErr">{{ resetErr }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()
const route = useRoute()

const email = ref("")
const password = ref("")
const loading = ref(false)
const errMsg = ref("")

// Reset modal
const mostrarReset = ref(false)
const resetEmail = ref("")
const resetLoading = ref(false)
const resetOk = ref("")
const resetErr = ref("")

function cerrarReset() {
  mostrarReset.value = false
  resetOk.value = ""
  resetErr.value = ""
  resetLoading.value = false
}

async function login() {
  loading.value = true
  errMsg.value = ""

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    errMsg.value = error.message || "No se pudo iniciar sesión"
    return
  }

  // ✅ REDIRECT: si venías desde checkout (o cualquier otra)
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/"
  router.push(redirect)
}

async function enviarReset() {
  resetLoading.value = true
  resetOk.value = ""
  resetErr.value = ""

  const mail = (resetEmail.value || email.value || "").trim()
  if (!mail) {
    resetErr.value = "Pon tu email."
    resetLoading.value = false
    return
  }

  // 👇 Esto manda el email de recuperación y abrirá /reset-password
const PROD_URL = "https://resuelveshop.com" // elige 1 canónico

const redirectTo = import.meta.env.PROD
  ? `${PROD_URL}/reset-password`
  : `${window.location.origin}/reset-password`

const { error } = await supabase.auth.resetPasswordForEmail(mail, { redirectTo })

  resetLoading.value = false

  if (error) {
    resetErr.value = error.message || "No se pudo enviar el enlace"
    return
  }

  resetOk.value = "✅ Listo. Revisa tu email (incluye spam)."
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 18px;
  position: relative;
}
.card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
}
h2 { margin: 0 0 6px 0; }
.muted { margin: 0 0 14px 0; color: #6b7280; font-size: 13px; }
.form { display: flex; flex-direction: column; gap: 12px; }
.field label { font-size: 12px; font-weight: 900; color: #374151; display: block; margin-bottom: 6px; }
.field input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 15px;
}
.field input:focus { border-color: #28a745; }
.btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .12s ease, opacity .12s ease;
}
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: .7; cursor: not-allowed; }

.err { margin: 6px 0 0 0; color: #991b1b; font-weight: 900; }
.ok { margin: 10px 0 0 0; color: #166534; font-weight: 900; }

.links {
  margin-top: 14px;
  display: grid;
  gap: 10px;
  text-align: center;
}
.link { text-decoration: none; color: #111; }
.link b { color: #28a745; }
.link-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 900;
  color: #111;
}
.link-btn:hover { color: #28a745; }

/* Modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 5000;
}
.modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 6000;
  padding: 18px;
}
.modal-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.18);
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.modal-head h3 { margin: 0; }
.x {
  border: none;
  background: #f0f0f0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
}
</style>
