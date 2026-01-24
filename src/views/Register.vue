<template>
  <div class="auth-page">
    <div class="card">
      <h2>Crear cuenta</h2>
      <p class="muted">Regístrate para hacer pedidos y guardar tu dirección.</p>

      <form class="form" @submit.prevent="register">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" required />
        </div>

        <button class="btn" type="submit" :disabled="loading">
          {{ loading ? "Creando..." : "Crear cuenta" }}
        </button>

        <p class="ok" v-if="okMsg">{{ okMsg }}</p>
        <p class="err" v-if="errMsg">{{ errMsg }}</p>
      </form>

      <div class="bottom">
        <router-link class="link" to="/login">
          ¿Ya tienes cuenta? <b>Iniciar sesión</b>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()
const email = ref("")
const password = ref("")
const loading = ref(false)
const errMsg = ref("")
const okMsg = ref("")

async function register() {
  loading.value = true
  errMsg.value = ""
  okMsg.value = ""

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    errMsg.value = error.message || "No se pudo crear la cuenta"
    return
  }

  okMsg.value = "✅ Cuenta creada. Ya puedes iniciar sesión."
  setTimeout(() => router.push("/login"), 900)
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 18px;
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
}
.btn:disabled { opacity: .7; cursor: not-allowed; }
.ok { margin: 6px 0 0 0; color: #166534; font-weight: 900; }
.err { margin: 6px 0 0 0; color: #991b1b; font-weight: 900; }
.bottom { margin-top: 14px; text-align: center; }
.link { text-decoration: none; color: #111; }
.link b { color: #28a745; }
</style>
