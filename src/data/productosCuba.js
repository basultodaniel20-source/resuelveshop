import reloj from "../assets/reloj.webp"
import zapato from "../assets/zapato.webp"
import camiseta from "../assets/camiseta.png"
import kit from "../assets/kit.jpg"

export const productos = [
  {
    id: 1,
    nombre: "Reloj Deportivo",
    precio: 25,
    imagen: reloj,
    categoria: "Accesorios",
    provincias: ["Granma"],
    municipios:["Yara"]
  },
  {
    id: 2,
    nombre: "Zapatillas Urbanas",
    precio: 45,
    imagen: zapato,
    categoria: "Calzado",
    provincias: ["Granma"],
    municipios:["Yara"]
  },
  {
    id: 3,
    nombre: "Camiseta Básica",
    precio: 15,
    imagen: camiseta,
    categoria: "Ropa",
    provincias: ["Granma"],
    municipios:["Yara"]
  },
  {
    id: 4,
    nombre: "Kit Fitness",
    precio: 30,
    imagen: kit,
    categoria: "Gym",
    provincias: ["Granma"],
    municipios:["Yara"]
  }
]