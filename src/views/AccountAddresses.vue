<template>
  <div class="page">
    <div class="card address-card">
      <div class="topGlow"></div>

      <div class="head">
        <router-link class="back" to="/account" aria-label="Volver a mi cuenta">←</router-link>

        <div class="headText">
          <h2>Mis direcciones</h2>
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
          <textarea
            v-model="form.direccion"
            placeholder="Dirección completa"
            rows="4"
            required
          />
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

  const payload = {
    id: user.value.id,
    email: user.value.email,
    nombre: form.value.nombre,
    telefono: form.value.telefono,
    direccion: form.value.direccion,
    updated_at: new Date().toISOString(),
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
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
  display: block;
  padding: 18px;
  padding-top: 0;
  min-height: auto;
}

.address-card{
  position: relative;
  overflow: hidden;
}

.topGlow{
  position: absolute;
  inset: 0 auto auto 0;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(34,197,94,0.11), transparent 65%);
  pointer-events: none;
}

.card{
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 24px;
  padding: 22px;
  box-shadow:
    0 18px 40px rgba(0,0,0,0.08),
    0 6px 16px rgba(0,0,0,0.04);
}

.head{
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.back{
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f3f4f6 0%, #e9edf2 100%);
  text-decoration: none;
  color: #111827;
  font-weight: 1000;
  font-size: 24px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.85);
  transition: transform .16s ease, box-shadow .16s ease;
}

.back:hover{
  transform: translateY(-1px);
  box-shadow:
    0 10px 20px rgba(0,0,0,0.05),
    inset 0 1px 0 rgba(255,255,255,0.85);
}

.headText h2{
  margin: 0;
  font-size: 30px;
  line-height: 1.03;
  font-weight: 1000;
  letter-spacing: -0.7px;
  color: #111827;
}

.muted{
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
  max-width: 420px;
}

.form{
  position: relative;
  z-index: 1;
  margin-top: 18px;
  display: grid;
  gap: 14px;
}

.field label{
  display: block;
  font-size: 13px;
  font-weight: 1000;
  color: #374151;
  margin-bottom: 8px;
}

.field input,
.field textarea{
  width: 100%;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
  transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.field textarea{
  resize: vertical;
  min-height: 120px;
}

.field input::placeholder,
.field textarea::placeholder{
  color: #9ca3af;
  font-weight: 600;
}

.field input:focus,
.field textarea:focus{
  border-color: rgba(34,197,94,0.55);
  box-shadow:
    0 0 0 4px rgba(34,197,94,0.12),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.btn{
  margin-top: 6px;
  width: 100%;
  min-height: 52px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: linear-gradient(180deg, #2fd160 0%, #24b04f 100%);
  color: white;
  font-weight: 1000;
  font-size: 16px;
  box-shadow:
    0 14px 28px rgba(34,197,94,0.28),
    inset 0 1px 0 rgba(255,255,255,0.18);

  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
}

.btn:hover{
  transform: translateY(-1px);
  box-shadow:
    0 18px 34px rgba(34,197,94,0.34),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.btn:disabled{
  opacity: .82;
  cursor: not-allowed;
  transform: none;
}

.spinner{
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.42);
  border-top-color: white;
  animation: spin .7s linear infinite;
}

@keyframes spin{
  to{ transform: rotate(360deg); }
}

.ok,
.err{
  padding: 12px 14px;
  border-radius: 16px;
  font-weight: 900;
  font-size: 14px;
}

.ok{
  color: #166534;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
}

.err{
  color: #991b1b;
  background: #fff1f2;
  border: 1px solid #fecaca;
}

@media (min-width: 900px){
  .page{
    padding-top: 18px;
    padding-bottom: 20px;
  }

  .card{
    padding: 26px;
  }

  .headText h2{
    font-size: 34px;
  }
}

@media (max-width: 640px){
  .card{
    border-radius: 22px;
    padding: 18px;
  }

  .head{
    gap: 12px;
  }

  .back{
    width: 44px;
    height: 44px;
    flex-basis: 44px;
    border-radius: 14px;
    font-size: 22px;
  }

  .headText h2{
    font-size: 24px;
  }

  .muted{
    font-size: 13px;
  }

  .field input,
  .field textarea{
    font-size: 15px;
    border-radius: 14px;
    padding: 14px;
  }

  .btn{
    min-height: 48px;
    border-radius: 16px;
    font-size: 15px;
  }
}
</style>