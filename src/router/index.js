import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import CarritoView from "../views/CarritoView.vue"
import ProductoDetalle from "../views/ProductoDetalle.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Perfil from "../views/Perfil.vue"
import Checkout from "../views/Checkout.vue"
import Pago from "../views/Pago.vue"

const routes = [
  {
    path: "/",
    component: Home
  },

  {
    path: "/categoria/:categoria",
    component: Home,
    props: true
  },

  {
    path: "/carrito",
    component: CarritoView
  },

  {
  path: "/producto/:id",
  name: "ProductoDetalle",
  component: () => import("../views/ProductoDetalle.vue"),
  props: true
},

{
  path: "/producto/:id",
  name: "producto",
  component: ProductoDetalle,
  props: true
},

{ path: "/login",
   component: Login },
{ path: "/register",
   component: Register },
{
  path: "/perfil",
  component: Perfil
},

{
  path: "/checkout",
  component: Checkout
},
{
  path: "/checkout",
  component: () => import("../views/Checkout.vue")
},
{
  path: "/pago",
  component: () => import("../views/Pago.vue")
}

]

export default createRouter({
  history: createWebHistory(),
  routes
})
