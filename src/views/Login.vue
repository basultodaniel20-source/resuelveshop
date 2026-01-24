<template>
  <div class="auth">
    <h2>Iniciar sesión</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Contraseña" />

    <button @click="login">Entrar</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { supabase } from "../supabase"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const error = ref("")

const router = useRouter()

async function login() {
  error.value = ""

  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (err) {
    error.value = err.message
  } else {
    router.push("/")
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

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #369870;
  transform: scale(1.05);
}
button:active {
  transform: scale(0.95);
}

</style>
