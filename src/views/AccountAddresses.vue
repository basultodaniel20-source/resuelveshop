<template>
  <div class="page">
    <div class="card">
      <div class="head">
        <router-link class="back" to="/account">←</router-link>
        <div>
          <h2>📍 Mis direcciones</h2>
          <p class="muted">Guarda tus datos para que el pago sea más rápido.</p>
        </div>
      </div>

      <form class="form" @submit.prevent="guardar">
        <div class="field">
          <label>Nombre completo</label>
          <input v-model="form.nombre" placeholder="Tu nombre" required />
        </div>

        <div class="field">
          <label>Teléfono</label>
          <input v-model="form.telefono" placeholder="Tu teléfono" required />
        </div>

        <div class="field">
          <label>Dirección</label>
          <textarea v-model="form.direccion" placeholder="Dirección completa" rows="3" required />
        </div>

        <button class="btn" type="submit" :disabled="saving">
          <span v-if="saving" class="spinner" aria-hidden="true"></span>
          {{ saving ? "Guardando..." : "Guardar cambios" }}
        </button>

        <p class="ok" v-if="okMsg">{{ okMsg }}</p>
        <p class="err" v-if="errMsg">{{ errMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()

const user = ref(null)
const saving = ref(false)
const okMsg = ref("")
const errMsg = ref("")

const form = ref({
  nombre: "",
  telefono: "",
  direccion: "",
})

onMounted(async () => {
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
})

async function guardar() {
  if (!user.value) return

  saving.value = true
  okMsg.value = ""
  errMsg.value = ""

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
  setTimeout(() => (okMsg.value = ""), 2500)
}
</script>

<style scoped>
.page{
  min-height: 100dvh;
  background:#f5f6f8;
  display:block;

  /* ✅ pegado arriba */
  padding: 18px;
  padding-top: 0px;

  /* espacio para bottom nav */

}

.card{
  width:100%;
  max-width:520px;
  margin: 0 auto;
  background:white;
  border-radius:16px;
  padding:18px;
  box-shadow:0 10px 28px rgba(0,0,0,0.08);
}

.head{
  display:flex;
  gap:12px;
  align-items:flex-start;
  margin-bottom:12px;
}

.back{
  width:42px;
  height:42px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:#f3f4f6;
  text-decoration:none;
  color:#111;
  font-weight:900;
}

h2{ margin:0; }

.muted{
  margin:4px 0 0 0;
  color:#6b7280;
  font-size:13px;
}

.form{ margin-top:12px; display:grid; gap:12px; }

.field label{
  display:block;
  font-size:12px;
  font-weight:900;
  color:#374151;
  margin-bottom:6px;
}

.field input, .field textarea{
  width:100%;
  padding:12px;
  border-radius:12px;
  border:1px solid #e5e7eb;
  outline:none;
  font-size:15px;
}

.field input:focus, .field textarea:focus{
  border-color:#28a745;
}

.btn{
  margin-top:6px;
  background:#28a745;
  border:none;
  color:white;
  font-weight:900;
  padding:12px 14px;
  border-radius:12px;
  cursor:pointer;
  width:100%;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}

.btn:disabled{ opacity:.75; cursor:not-allowed; }

.spinner{
  width:16px;
  height:16px;
  border-radius:50%;
  border:2px solid rgba(255,255,255,0.45);
  border-top-color:white;
  animation:spin .7s linear infinite;
}

@keyframes spin{ to{ transform:rotate(360deg);} }

.ok{
  color:#166534;
  font-weight:900;
  background:#ecfdf5;
  border:1px solid #bbf7d0;
  padding:10px 12px;
  border-radius:12px;
}

.err{
  color:#991b1b;
  font-weight:900;
  background:#fff1f2;
  border:1px solid #fecaca;
  padding:10px 12px;
  border-radius:12px;
}

/* PC */
@media (min-width: 900px){
  .page{
    padding-top: calc(var(--header-h) - 20px);
    padding-bottom: 20px;
  }
}

</style>
