import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import CarritoView from "../views/CarritoView.vue"
import ProductoDetalle from "../views/ProductoDetalle.vue"


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
}

]

export default createRouter({
  history: createWebHistory(),
  routes
})
