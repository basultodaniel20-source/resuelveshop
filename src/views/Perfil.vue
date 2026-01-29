<template>
  <div class="account-page">
    <div class="card">
      <div class="head">
        <div class="avatar">{{ initials }}</div>
        <div class="head-text">
          <h2>Mi cuenta</h2>
          <p class="muted">{{ user?.email }}</p>
        </div>
      </div>

      <div class="menu">
        <router-link to="/account/addresses" class="item">
          <span class="left">
            <span class="ico">📍</span>
            <span>Mis direcciones</span>
          </span>
          <span class="chev">›</span>
        </router-link>

        <router-link to="/account/orders" class="item">
          <span class="left">
            <span class="ico">📦</span>
            <span>Mis pedidos</span>
          </span>
          <span class="chev">›</span>
        </router-link>

        <button class="item danger" @click="logout" type="button">
          <span class="left">
            <span class="ico">🚪</span>
            <span>Cerrar sesión</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const router = useRouter()
const user = ref(null)

const initials = computed(() => {
  const email = (user.value?.email || "RS").trim()
  return email.slice(0, 2).toUpperCase()
})

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
  if (!user.value) router.push("/login")
})

async function logout() {
  await supabase.auth.signOut()
  router.push("/")
}
</script>

<style scoped>
.account-page {
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 18px;
  background: #f5f6f8;
}

.card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}

/* Header */
.head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
  margin-bottom: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 900;
  background: #e8f5e9;
  color: #14532d;
  border: 1px solid rgba(40, 167, 69, 0.25);
  user-select: none;
}

.head-text {
  min-width: 0;
}

.head-text h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
}

.muted {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 340px;
}

/* Menu */
.menu {
  display: grid;
  gap: 12px;
}

.item {
  text-decoration: none;
  border: 1px solid #eee;
  background: white;
  padding: 14px;
  border-radius: 14px;
  font-weight: 900;
  color: #111;

  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.item:hover {
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.left {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.ico {
  width: 26px;
  display: inline-flex;
  justify-content: center;
}

.chev {
  opacity: 0.55;
  font-size: 18px;
}

.item.danger {
  border-color: #fecaca;
  background: #fff1f2;
  color: #991b1b;
  cursor: pointer;
}

.item.danger:hover {
  box-shadow: 0 10px 22px rgba(153, 27, 27, 0.08);
}
</style>
