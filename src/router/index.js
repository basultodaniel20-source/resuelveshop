import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import CarritoView from "../views/CarritoView.vue"
import ProductoDetalle from "../views/ProductoDetalle.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Perfil from "../views/Perfil.vue"
import Checkout from "../views/Checkout.vue"
import Pago from "../views/Pago.vue"
import ResetPassword from "../views/ResetPassword.vue"
import AccountAddresses from "../views/AccountAddresses.vue"
import AccountOrders from "../views/AccountOrders.vue"
import { supabase } from "../supabase"

const routes = [
  { path: "/", component: Home },
  { path: "/categoria/:categoria", component: Home, props: true },
  { path: "/carrito", component: CarritoView },

  {
    path: "/producto/:id",
    name: "ProductoDetalle",
    component: ProductoDetalle,
    props: true,
  },

  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // ✅ Reset público (clave)
  { path: "/reset-password", component: ResetPassword },

  // ✅ Subrutas de "Mi cuenta" (primero)
  { path: "/account/addresses", component: AccountAddresses, meta: { requiresAuth: true } },
  { path: "/account/orders", component: AccountOrders, meta: { requiresAuth: true } },

  // ✅ Mi cuenta
  { path: "/account", component: Perfil, meta: { requiresAuth: true } },

  // ✅ Mantener compatibilidad
  { path: "/perfil", redirect: "/account" },

  { path: "/checkout", component: Checkout, meta: { requiresAuth: true } },
  { path: "/pago", component: Pago, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Guard: protege solo lo que tiene requiresAuth
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (!user) {
    // evita redirect raro si ya estás yendo a login
    if (to.path === "/login") return true
    return { path: "/login", query: { redirect: to.fullPath } }
  }

  return true
})

export default router
