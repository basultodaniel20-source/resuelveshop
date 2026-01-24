import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import CarritoView from "../views/CarritoView.vue"
import ProductoDetalle from "../views/ProductoDetalle.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Perfil from "../views/Perfil.vue"
import Checkout from "../views/Checkout.vue"
import Pago from "../views/Pago.vue"
import { supabase } from "../supabase"

const routes = [
  { path: "/", component: Home },

  { path: "/categoria/:categoria", component: Home, props: true },

  { path: "/carrito", component: CarritoView },

  // ✅ SOLO UNA RUTA para producto
  {
    path: "/producto/:id",
    name: "ProductoDetalle",
    component: ProductoDetalle,
    props: true,
  },

  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // ✅ Protegidas con login
  { path: "/perfil", component: Perfil, meta: { requiresAuth: true } },
  { path: "/checkout", component: Checkout, meta: { requiresAuth: true } },
  { path: "/pago", component: Pago, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Guard: si no hay sesión, manda a /login
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getUser()
  if (!data.user) return { path: "/login" }

  return true
})

export default router
