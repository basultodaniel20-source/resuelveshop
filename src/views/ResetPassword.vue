<template>
  <div class="auth-page">
    <div class="card">
      <h2>Nueva contraseña</h2>
      <p class="muted">Escribe tu nueva contraseña para terminar el reseteo.</p>

      <div class="field">
        <label>Nueva contraseña</label>
        <input v-model="p1" type="password" placeholder="••••••••" />
      </div>

      <div class="field">
        <label>Repetir contraseña</label>
        <input v-model="p2" type="password" placeholder="••••••••" />
      </div>

      <button class="btn" @click="guardar" :disabled="loading">
        {{ loading ? "Guardando..." : "Guardar contraseña" }}
      </button>

      <p class="ok" v-if="ok">{{ ok }}</p>
      <p class="err" v-if="err">{{ err }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const p1 = ref("")
const p2 = ref("")
const loading = ref(false)
const ok = ref("")
const err = ref("")
const ready = ref(false)

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  ready.value = !!data.session
})

async function guardar() {
  err.value = ""
  ok.value = ""

  if (!ready.value) {
    err.value = "Este enlace no es válido o ya expiró. Pide uno nuevo."
    return
  }

  if (!p1.value || p1.value.length < 6) {
    err.value = "La contraseña debe tener al menos 6 caracteres."
    return
  }
  if (p1.value !== p2.value) {
    err.value = "Las contraseñas no coinciden."
    return
  }

  loading.value = true
  const { error } = await supabase.auth.updateUser({ password: p1.value })
  loading.value = false

  if (error) {
    err.value = error.message || "No se pudo cambiar la contraseña."
    return
  }

  ok.value = "✅ Contraseña actualizada. Ya puedes iniciar sesión."

  await supabase.auth.signOut()
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
.muted { color: #6b7280; font-size: 13px; margin-bottom: 14px; }
.field { margin-bottom: 12px; }
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
.err { margin-top: 10px; color: #991b1b; font-weight: 900; }
.ok { margin-top: 10px; color: #166534; font-weight: 900; }
</style>
