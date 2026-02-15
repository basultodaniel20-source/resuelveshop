<template>
  <div class="account-page">
    <div class="card">
      <h2>👤 Mi cuenta</h2>
      <p class="muted">{{ user?.email }}</p>

      <div class="menu">
        <router-link to="/account/addresses" class="item">
          📍 Mis direcciones
        </router-link>

        <router-link to="/account/orders" class="item">
          📦 Mis pedidos
        </router-link>

        <!-- ✅ SOLO ADMIN -->
        <router-link v-if="isAdmin" to="/admin/orders" class="item admin">
          🛠️ Panel Admin (pedidos)
        </router-link>

        <button class="item danger" @click="logout">
          🚪 Cerrar sesión
        </button>
      </div>

      <p v-if="loadingAdmin" class="hint">Comprobando permisos…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()
const user = ref(null)

const isAdmin = ref(false)
const loadingAdmin = ref(true)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  if (!user.value) {
    router.push("/login")
    return
  }

  // ✅ detectar admin
  const { data: prof, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.value.id)
    .single()

  isAdmin.value = !!prof?.is_admin
  loadingAdmin.value = false

  if (error) {
    console.error(error)
    loadingAdmin.value = false
  }
})

async function logout() {
  await supabase.auth.signOut()
  router.push("/")
}
</script>

<style scoped>
.account-page{
  min-height: 100dvh;
  background:#f5f6f8;

  padding: 12px 18px;
  padding-top: calc(var(--header-h) + 10px);
  padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom));
}

.card{
  width:100%;
  max-width:420px;
  margin: 0 auto;
  background:white;
  border-radius:16px;
  padding:18px;
  box-shadow:0 10px 28px rgba(0,0,0,0.08);
}

.muted{
  margin-top:4px;
  color:#6b7280;
  font-size:13px;
}

.menu{
  margin-top:14px;
  display:grid;
  gap:12px;
}

.item{
  text-decoration:none;
  border:1px solid #eee;
  background:white;
  padding:14px;
  border-radius:14px;
  font-weight:900;
  color:#111;
  text-align:left;
  cursor:pointer;
}

.item.admin{
  border-color:#bfdbfe;
  background:#eff6ff;
}

.item.danger{
  border-color:#fecaca;
  background:#fff1f2;
  color:#991b1b;
}

.hint{
  margin-top:12px;
  font-size:12px;
  color:#6b7280;
  font-weight:800;
}

/* PC */
@media (min-width: 900px){
  .account-page{
    padding-top: calc(var(--header-h) - 20px);
    padding-bottom: 20px;
  }
}
</style>
