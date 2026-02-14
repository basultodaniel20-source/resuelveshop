<template>
  <nav class="bottom-nav">
    <router-link to="/" class="item" :class="{ active: isActive('/') }">
      <span class="icon">🏠</span>
      <span class="txt">Inicio</span>
    </router-link>

    <router-link
      to="/catalogo"
      class="item"
      :class="{ active: isActive('/catalogo') }"
    >
      <span class="icon">🗂️</span>
      <span class="txt">Catálogo</span>
    </router-link>

    <!-- BOTÓN CENTRAL -->
    <router-link
      to="/carrito"
      class="item center"
      :class="{ active: isActive('/carrito') }"
    >
      <div class="circle">
        🛒
        <span v-if="total > 0" class="badge">{{ total }}</span>
      </div>
      <span class="txt">Carrito</span>
    </router-link>

    <router-link
      to="/account/orders"
      class="item"
      :class="{ active: isActive('/account/orders') }"
    >
      <span class="icon">📦</span>
      <span class="txt">Pedidos</span>
    </router-link>

    <router-link
      to="/account"
      class="item"
      :class="{ active: isActive('/account') }"
    >
      <span class="icon">👤</span>
      <span class="txt">Perfil</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router"

defineProps({
  total: { type: Number, default: 0 },
})

const route = useRoute()

function isActive(path) {
  // ✅ Para que funcione en subrutas tipo /account/orders/ID
  if (path === "/") return route.path === "/"
  return route.path.startsWith(path)
}
</script>

<style scoped>
.bottom-nav{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: white;
  border-top: 1px solid #eee;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  z-index: 9999;
  padding: 10px 10px;

  box-shadow: 0 -10px 25px rgba(0,0,0,0.08);
}

.item{
  text-decoration: none;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 13px;
  gap: 5px;
}

.item .icon{
  font-size: 28px;
  line-height: 1;
}

.item.active{
  color: #28a745;
}

/* BOTÓN CENTRAL */
.center{
  transform: translateY(-28px);
}

.center .circle{
  width: 72px;
  height: 72px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 30px;
  box-shadow: 0 14px 30px rgba(0,0,0,0.20);
  border: 6px solid white;
  position: relative;
}

.center .txt{
  margin-top: 5px;
  font-size: 13px;
  font-weight: 1000;
}

.badge{
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 999px;
  background: #111;
  color: white;
  font-size: 13px;
  font-weight: 1000;
  display: grid;
  place-items: center;
  border: 3px solid white;
}

/* SOLO PC */
@media (min-width: 900px){
  .bottom-nav{ display:none; }
}
</style>
