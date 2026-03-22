<template>
  <div class="account-page">
    <div class="card account-card">
      <div class="topGlow"></div>

      <div class="accountHeader">
        <div class="avatarBox">👤</div>

        <div class="accountInfo">
          <h2>Mi cuenta</h2>
          <p class="muted">{{ user?.email }}</p>
        </div>
      </div>

      <div class="menu">
        <router-link to="/account/addresses" class="item">
          <div class="itemLeft">
            <span class="itemIcon">📍</span>
            <div>
              <div class="itemTitle">Mis direcciones</div>
              <div class="itemSub">Guarda tus datos para comprar más rápido</div>
            </div>
          </div>
          <span class="itemArrow">→</span>
        </router-link>

        <router-link to="/account/orders" class="item">
          <div class="itemLeft">
            <span class="itemIcon">📦</span>
            <div>
              <div class="itemTitle">Mis pedidos</div>
              <div class="itemSub">Consulta el estado de tus compras</div>
            </div>
          </div>
          <span class="itemArrow">→</span>
        </router-link>

        <router-link v-if="isAdmin" to="/admin/orders" class="item admin">
          <div class="itemLeft">
            <span class="itemIcon">🛠️</span>
            <div>
              <div class="itemTitle">Panel Admin</div>
              <div class="itemSub">Gestiona pedidos y administración</div>
            </div>
          </div>
          <span class="itemArrow">→</span>
        </router-link>

        <button class="item danger" @click="logout">
          <div class="itemLeft">
            <span class="itemIcon">🚪</span>
            <div>
              <div class="itemTitle">Cerrar sesión</div>
              <div class="itemSub">Salir de tu cuenta de forma segura</div>
            </div>
          </div>
        </button>
      </div>

      <p v-if="loadingAdmin" class="hint">Comprobando permisos…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../../supabase"

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
  background:
    radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 24%),
    #f5f6f8;
  display: block;
  padding: 18px 18px 24px;
  padding-top: 0;
  min-height: auto;
}

.account-card{
  position: relative;
  overflow: hidden;
}

.topGlow{
  position: absolute;
  inset: 0 auto auto 0;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(34,197,94,0.12), transparent 65%);
  pointer-events: none;
}

.card{
  width: 100%;
  max-width: 460px;
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

.accountHeader{
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.avatarBox{
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 28px;
  background: linear-gradient(180deg, #f3f4f6 0%, #e9edf2 100%);
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}

.accountInfo h2{
  margin: 0;
  font-size: 28px;
  line-height: 1.05;
  font-weight: 1000;
  letter-spacing: -0.7px;
  color: #111827;
}

.muted{
  margin-top: 6px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  word-break: break-word;
}

.menu{
  position: relative;
  z-index: 1;
  margin-top: 10px;
  display: grid;
  gap: 12px;
}

.item{
  text-decoration: none;
  border: 1px solid rgba(0,0,0,0.06);
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
  padding: 16px 18px;
  border-radius: 20px;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-shadow:
    0 8px 20px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}

.item:hover{
  transform: translateY(-2px);
  box-shadow:
    0 14px 28px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.8);
}

.itemLeft{
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.itemIcon{
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 22px;
  background: rgba(34,197,94,0.10);
  border: 1px solid rgba(34,197,94,0.16);
}

.itemTitle{
  font-size: 17px;
  font-weight: 1000;
  line-height: 1.1;
  color: #111827;
}

.itemSub{
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.3;
  color: #6b7280;
  font-weight: 700;
}

.itemArrow{
  font-size: 18px;
  color: #9ca3af;
  font-weight: 1000;
}

.item.admin{
  border-color: rgba(59,130,246,0.18);
  background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
}

.item.admin .itemIcon{
  background: rgba(59,130,246,0.10);
  border-color: rgba(59,130,246,0.18);
}

.item.danger{
  border-color: rgba(239,68,68,0.16);
  background: linear-gradient(180deg, #fff8f8 0%, #fff1f2 100%);
}

.item.danger .itemIcon{
  background: rgba(239,68,68,0.08);
  border-color: rgba(239,68,68,0.14);
}

.item.danger .itemTitle{
  color: #991b1b;
}

.item.danger .itemSub{
  color: #b45309;
}

.hint{
  margin-top: 14px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
}

@media (min-width: 900px){
  .account-page{
    padding-top: 18px;
  }

  .card{
    max-width: 520px;
    padding: 26px;
  }

  .accountInfo h2{
    font-size: 32px;
  }
}

@media (max-width: 640px){
  .card{
    border-radius: 22px;
    padding: 18px;
  }

  .accountInfo h2{
    font-size: 24px;
  }

  .item{
    padding: 14px 15px;
    border-radius: 18px;
  }

  .itemTitle{
    font-size: 15px;
  }

  .itemSub{
    font-size: 12px;
  }

  .itemIcon{
    width: 40px;
    height: 40px;
    flex-basis: 40px;
    font-size: 20px;
  }
}
</style>