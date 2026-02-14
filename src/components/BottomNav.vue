
<template>
  <nav class="bottom-nav" aria-label="Navegación inferior">
    <router-link to="/" class="item" :class="{ active: isActive('/') }">
      <Home class="icon" />
      <span class="txt">Inicio</span>
    </router-link>

    <router-link to="/" class="item" :class="{ active: isActive('/categoria') }">
      <LayoutGrid class="icon" />
      <span class="txt">Catálogo</span>
    </router-link>

    <!-- BOTÓN CENTRAL -->
    <router-link to="/carrito" class="item center" :class="{ active: isActive('/carrito') }">
      <div class="circle" aria-label="Carrito">
        <ShoppingCart class="iconCenter" />
        <span v-if="total > 0" class="badge">{{ total }}</span>
      </div>
      <span class="txt">Carrito</span>
    </router-link>

    <router-link to="/account/orders" class="item" :class="{ active: isActive('/account/orders') }">
      <Package class="icon" />
      <span class="txt">Pedidos</span>
    </router-link>

    <router-link to="/account" class="item" :class="{ active: isActive('/account') }">
      <User class="icon" />
      <span class="txt">Cuenta</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { Home, LayoutGrid, ShoppingCart, Package, User } from "lucide-vue-next"

defineProps({
  total: { type: Number, default: 0 }
})

const route = useRoute()
const router = useRouter()

function isActive(path) {
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

  height: 78px;
  padding: 10px 12px 14px;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: end;

  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-top: 1px solid rgba(0,0,0,0.06);
  z-index: 9999;
}

.item{
  text-decoration: none;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.2px;
  user-select: none;
}

.icon{
  width: 22px;
  height: 22px;
  stroke-width: 2.2;
  opacity: 0.9;
}

.item.active{
  color: #28a745;
}

.item:active{
  transform: scale(0.98);
}

/* Botón central */
.center{
  transform: translateY(-18px);
}

.circle{
  width: 60px;
  height: 60px;
  border-radius: 999px;
  background: #28a745;
  display: grid;
  place-items: center;
  position: relative;
  border: 5px solid rgba(255,255,255,0.95);
  box-shadow: 0 14px 30px rgba(0,0,0,0.20);
  transition: transform .15s ease;
}

.center:active .circle{
  transform: scale(0.97);
}

.iconCenter{
  width: 26px;
  height: 26px;
  color: white;
  stroke-width: 2.4;
}

/* Badge */
.badge{
  position: absolute;
  top: -6px;
  right: -6px;

  min-width: 22px;
  height: 22px;
  padding: 0 7px;

  border-radius: 999px;
  background: #111;
  color: #fff;

  font-size: 12px;
  font-weight: 1000;

  display: grid;
  place-items: center;

  border: 2px solid rgba(255,255,255,0.95);
}

/* SOLO MÓVIL */
@media (min-width: 900px){
  .bottom-nav{ display:none; }
}
</style>
