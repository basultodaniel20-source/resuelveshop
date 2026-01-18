// importar imágenes (forma correcta)
import ComboFamiliarImg from "../assets/ComboFamiliar.jpeg"
import ComboCompletoImg from "../assets/ComboCompleto.jpeg"
import ComboBasicoImg from "../assets/ComboBasico.jpeg"
import CombodeAseoImg from "../assets/CombodeAseo.jpeg"
// array de productos

export const productos = [
{
  id: 1,
  nombre: "Combo Familiar",
  precio: 89,
  imagen: ComboFamiliarImg, // tu imagen
  imagenes: [ComboFamiliarImg, ComboFamiliarImg, ComboFamiliarImg],
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo más vendido. Ideal para ayudar a tu familia a pasar el mes con comida variada y suficiente.",
  descripcion: "El Combo Familiar está pensado para resolver la comida de una familia durante varias semanas. Incluye una combinación equilibrada de alimentos básicos y proteínas para asegurar variedad y cantidad en el hogar.",
  incluye: [
    "Arroz (varios kg)",
    "Aceite (2 L aprox)",
    "Pollo",
    "Carne de cerdo o res",
    "Picadillo",
    "Huevos",
    "Leche en polvo",
    "Jamón o embutidos",
    "Algunos productos adicionales según disponibilidad"
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Según disponibilidad del proveedor",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo. Los productos, marcas o presentaciones pueden variar según la disponibilidad del proveedor, garantizando siempre el valor y la cantidad del combo adquirido."
},
{
  id: 2,
  nombre: "Combo Completo",
  precio: 129,
  imagen: ComboCompletoImg, // tu imagen
  imagenes: [ComboCompletoImg, ComboCompletoImg, ComboCompletoImg],
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo más grande y completo. Para los que quieren dejar a su familia bien abastecida todo el mes.",
  descripcion: "El Combo Completo está diseñado para cubrir prácticamente todas las necesidades de comida del mes. Es ideal para familias grandes o para quienes quieren asegurarse de que no falte nada en casa.",
  incluye: [
    "Arroz (8–10 kg aprox)",
    "Aceite (2 L aprox)",
    "Pollo",
    "Carne de cerdo",
    "Carne de res",
    "Picadillo",
    "Huevos",
    "Leche en polvo",
    "Jamón o embutidos",
    "Algunos productos de limpieza o aseo básico"
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Según disponibilidad del proveedor",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo. Los productos, marcas o presentaciones pueden variar según la disponibilidad del proveedor, garantizando siempre el valor y la cantidad del combo adquirido."
},
{
  id: 3,
  nombre: "Combo Básico",
  precio: 49,
  imagen: ComboBasicoImg, // tu imagen
  imagenes: [ComboBasicoImg, ComboBasicoImg, ComboBasicoImg],
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo ideal para resolver lo básico en casa por varios días.",
  descripcion: "El Combo Básico es perfecto para ayudar a tu familia a salir del paso y asegurar comida para una o dos semanas. Incluye los productos esenciales para cocinar y alimentarse.",
  incluye: [
    "Arroz",
    "Aceite",
    "Pollo",
    "Picadillo o carne",
    "Huevos o jamón",
    "1 o 2 productos adicionales según disponibilidad"
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Según disponibilidad del proveedor",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo. Los productos, marcas o presentaciones pueden variar según la disponibilidad del proveedor, garantizando siempre el valor y la cantidad del combo adquirido."
},
{
  id: 4,
  nombre: "Combo de Aseo",
  precio: 39,
  imagen: CombodeAseoImg, // tu imagen
  imagenes: [CombodeAseoImg, CombodeAseoImg, CombodeAseoImg],
  categoria: "Combos de Aseo",
  descripcionCorta: "Todo lo necesario para mantener la casa limpia y la familia aseada.",
  descripcion: "El Combo de Aseo incluye los productos básicos de limpieza e higiene para el hogar. Ideal para mantener la casa limpia y el día a día resuelto.",
  incluye: [
    "Jabón de baño",
    "Jabón de lavar ropa",
    "Detergente en polvo",
    "Detergente líquido",
    "Papel higiénico o servilletas",
    "Algún producto adicional de higiene (desodorante, lavavajillas, etc.)",
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Según disponibilidad del proveedor",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo. Los productos, marcas o presentaciones pueden variar según la disponibilidad del proveedor, garantizando siempre el valor y la cantidad del combo adquirido."
},
]
