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
  if (path === "/") return route.path === "/"
  return route.path.startsWith(path)
}
</script>

<style scoped>
.bottom-nav{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  /* ✅ Más compacta */
  height: 64px;

  /* ✅ Respeta el “home indicator” del iPhone sin agrandar demasiado */
  padding: 6px 10px calc(6px + env(safe-area-inset-bottom));

  background: #fff;
  border-top: 1px solid #eee;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;

  z-index: 9999;
  box-shadow: 0 -10px 25px rgba(0,0,0,0.08);
}

.item{
  text-decoration: none;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-weight: 800;
  font-size: 12px;
  gap: 2px;
}

.item .icon{
  font-size: 24px;
  line-height: 1;
}

.item.active{
  color: #28a745;
}

/* BOTÓN CENTRAL */
.center{
  /* ✅ Menos “salto” hacia arriba */
  transform: translateY(-18px);
}

.center .circle{
  /* ✅ Botón central más pequeño */
  width: 56px;
  height: 56px;

  background: #28a745;
  color: #fff;
  border-radius: 50%;

  display: grid;
  place-items: center;
  font-size: 24px;

  box-shadow: 0 12px 24px rgba(0,0,0,0.18);

  /* ✅ Borde más fino */
  border: 4px solid #fff;
  position: relative;
}

.center .txt{
  margin-top: 2px;
  font-size: 12px;
  font-weight: 900;
}

.badge{
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;

  border-radius: 999px;
  background: #111;
  color: #fff;

  font-size: 12px;
  font-weight: 900;

  display: grid;
  place-items: center;

  border: 3px solid #fff;
}

/* SOLO PC */
@media (min-width: 900px){
  .bottom-nav{ display:none; }
}
</style>
