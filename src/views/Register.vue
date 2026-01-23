<template>
  <div class="auth">
    <h2>Crear cuenta</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Contraseña" />

    <button @click="registrar">Registrarse</button>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="ok" class="ok">Cuenta creada. Revisa tu email.</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { supabase } from "../supabase"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const error = ref("")
const ok = ref(false)

const router = useRouter()

async function registrar() {
  error.value = ""
  ok.value = false

  const { error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (err) {
    error.value = err.message
  } else {
    ok.value = true
    setTimeout(() => router.push("/login"), 1500)
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 20px;
  border-radius: 12px;
}
.error { color: red; }
.ok { color: green; }
</style>
