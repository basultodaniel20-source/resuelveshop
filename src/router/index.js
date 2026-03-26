import { createRouter, createWebHistory } from "vue-router"
import { supabase } from "../supabase"

// Selector inicial
import SelectorInicial from "../views/SelectorInicial.vue"

// Auth común
import Login from "../views/auth/Login.vue"
import Register from "../views/auth/Register.vue"
import ResetPassword from "../views/auth/ResetPassword.vue"

// Internacional
import HomeInternacional from "../views/internacional/HomeInternacional.vue"
import CatalogoInternacional from "../views/internacional/CatalogoInternacional.vue"
import CarritoInternacional from "../views/internacional/CarritoInternacional.vue"
import ProductoDetalleInternacional from "../views/internacional/ProductoDetalleInternacional.vue"
import PerfilInternacional from "../views/internacional/PerfilInternacional.vue"
import CheckoutInternacional from "../views/internacional/CheckoutInternacional.vue"
import PagoInternacional from "../views/internacional/PagoInternacional.vue"
import DireccionesInternacional from "../views/internacional/DireccionesInternacional.vue"
import PedidosInternacional from "../views/internacional/PedidosInternacional.vue"
import PedidosDetallesInternacional from "../views/internacional/PedidosDetallesInternacional.vue"
import GraciasInternacional from "@/views/internacional/GraciasInternacional.vue"

// Cuba
import HomeCuba from "../views/cuba/HomeCuba.vue"
import CatalogoCuba from "../views/cuba/CatalogoCuba.vue"
import CarritoCuba from "../views/cuba/CarritoCuba.vue"
import ProductoCuba from "../views/cuba/ProductoCuba.vue"
import PerfilCuba from "../views/cuba/PerfilCuba.vue"
import CheckoutCuba from "../views/cuba/CheckoutCuba.vue"
import DireccionesCuba from "../views/cuba/DireccionesCuba.vue"
import PedidoCuba from "../views/cuba/PedidoCuba.vue"
import PedidoDetalleCuba from "../views/cuba/PedidoDetalleCuba.vue"

// Admin
import AdminOrders from "../views/AdminOrders.vue"

const routes = [

{
  path: "/internacional/gracias",
  name: "InternacionalGracias",
  component: GraciasInternacional,
},
  {
    path: "/",
    name: "selector-inicial",
    component: SelectorInicial,
  },

  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
  },

  {
    path: "/internacional",
    name: "home-internacional",
    component: HomeInternacional,
  },
  {
    path: "/internacional/catalogo",
    name: "catalogo-internacional",
    component: CatalogoInternacional,
    props: true,
  },
  {
    path: "/internacional/catalogo/:categoria",
    name: "catalogo-internacional-categoria",
    component: CatalogoInternacional,
    props: true,
  },
  {
    path: "/internacional/carrito",
    name: "carrito-internacional",
    component: CarritoInternacional,
  },
  {
    path: "/internacional/producto/:id",
    name: "producto-internacional",
    component: ProductoDetalleInternacional,
    props: true,
  },
  {
    path: "/internacional/checkout",
    name: "checkout-internacional",
    component: CheckoutInternacional,
    meta: { requiresAuth: true },
  },
  {
    path: "/internacional/pago",
    name: "pago-internacional",
    component: PagoInternacional,
    meta: { requiresAuth: true },
  },
  {
    path: "/internacional/account",
    name: "perfil-internacional",
    component: PerfilInternacional,
    meta: { requiresAuth: true },
  },
  {
    path: "/internacional/account/addresses",
    name: "direcciones-internacional",
    component: DireccionesInternacional,
    meta: { requiresAuth: true },
  },
  {
    path: "/internacional/account/orders",
    name: "pedidos-internacional",
    component: PedidosInternacional,
    meta: { requiresAuth: true },
  },
  {
    path: "/internacional/account/orders/:id",
    name: "pedido-detalle-internacional",
    component: PedidosDetallesInternacional,
    meta: { requiresAuth: true },
  },

  {
    path: "/cuba",
    name: "home-cuba",
    component: HomeCuba,
  },
  {
    path: "/cuba/catalogo",
    name: "catalogo-cuba",
    component: CatalogoCuba,
    props: true,
  },
  {
    path: "/cuba/catalogo/:categoria",
    name: "catalogo-cuba-categoria",
    component: CatalogoCuba,
    props: true,
  },
  {
    path: "/cuba/carrito",
    name: "carrito-cuba",
    component: CarritoCuba,
  },
  {
    path: "/cuba/producto/:id",
    name: "producto-cuba",
    component: ProductoCuba,
    props: true,
  },
  {
    path: "/cuba/checkout",
    name: "checkout-cuba",
    component: CheckoutCuba,
    meta: { requiresAuth: true },
  },
  {
    path: "/cuba/account",
    name: "perfil-cuba",
    component: PerfilCuba,
    meta: { requiresAuth: true },
  },
  {
    path: "/cuba/account/addresses",
    name: "direcciones-cuba",
    component: DireccionesCuba,
    meta: { requiresAuth: true },
  },
  {
    path: "/cuba/account/orders",
    name: "pedidos-cuba",
    component: PedidoCuba,
    meta: { requiresAuth: true },
  },
  {
    path: "/cuba/account/orders/:id",
    name: "pedido-detalle-cuba",
    component: PedidoDetalleCuba,
    meta: { requiresAuth: true },
  },

  {
    path: "/admin/orders",
    name: "admin-orders",
    component: AdminOrders,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: "/catalogo",
    redirect: "/internacional/catalogo",
  },
  {
    path: "/catalogo/:categoria",
    redirect: (to) => `/internacional/catalogo/${to.params.categoria}`,
  },
  {
    path: "/categoria/:categoria",
    redirect: (to) => `/internacional/catalogo/${to.params.categoria}`,
  },
  {
    path: "/carrito",
    redirect: "/internacional/carrito",
  },
  {
    path: "/producto/:id",
    redirect: (to) => `/internacional/producto/${to.params.id}`,
  },
  {
    path: "/checkout",
    redirect: "/internacional/checkout",
  },
  {
    path: "/pago",
    redirect: "/internacional/pago",
  },
  {
    path: "/account",
    redirect: "/internacional/account",
  },
  {
    path: "/account/addresses",
    redirect: "/internacional/account/addresses",
  },
  {
    path: "/account/orders",
    redirect: "/internacional/account/orders",
  },
  {
    path: "/account/orders/:id",
    redirect: (to) => `/internacional/account/orders/${to.params.id}`,
  },
  {
    path: "/perfil",
    redirect: "/internacional/account",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user

  if (!user) {
    return { path: "/login", query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin) {
    const { data: prof, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (error || !prof?.is_admin) return { path: "/" }
  }

  return true
})

export default router