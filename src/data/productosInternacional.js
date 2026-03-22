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
  masVendido: true,
  novedad: false,
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo más vendido. Ideal para ayudar a tu familia a pasar el mes con comida variada y suficiente.",
  descripcion: "El Combo Familiar está pensado para resolver la comida de una familia durante varias semanas. Incluye una combinación equilibrada de alimentos básicos y proteínas para asegurar variedad y cantidad en el hogar.",
  incluye: [
    "🍚 Arroz: entre 7 y 10 kg",
    "🛢️ Aceite: entre 3 y 4 Litros",
    "🍗 Pollo: mínimo 4 kg",
    "🥩 Carne de cerdo o res: mínimo 3 kg",
    "🍖 Picadillo: 2 paquete (400-500 g c/u apx)",
    "🥚 Huevos: 24 unidades ",
    "🥛 Leche en polvo: 2 paquete",
    "🌭 Jamón o embutidos: 2 paquete",
    "🧂 Productos adicionales según disponibilidad (granos, pastas, etc.)",
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Entre 3 y 10 días hábiles, según disponibilidad del proveedor y provincia de destino.",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo."+
"Las marcas, formatos, presentaciones y cantidades pueden variar según disponibilidad, manteniendo siempre el valor total y el contenido del combo."
},
{
  id: 2,
  nombre: "Combo Completo",
  precio: 129,
  imagen: ComboCompletoImg, // tu imagen
  imagenes: [ComboCompletoImg, ComboCompletoImg, ComboCompletoImg],
  masVendido: true,
  novedad: false,
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo más grande y completo. Para los que quieren dejar a su familia bien abastecida todo el mes.",
  descripcion: "El Combo Completo está diseñado para cubrir prácticamente todas las necesidades de comida del mes. Es ideal para familias grandes o para quienes quieren asegurarse de que no falte nada en casa.",
  incluye: [
    "🍚 Arroz: entre 12 y 15 kg",
    "🛢️ Aceite: entre 5 y 6 Litros",
    "🍗 Pollo: mínimo 6 kg",
    "🥩 Carne de cerdo o res: mínimo 5 kg",
    "🍖 Picadillo: 3 paquete",
    "🥚 Huevos: 30 unidades ",
    "🥛 Leche en polvo: 2 a 3 paquete",
    "🌭 Jamón o embutidos: 3 paquete",
    "🧂 Productos adicionales según disponibilidad (granos, conservas, pastas, etc.)",
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Entre 3 y 10 días hábiles, según disponibilidad del proveedor y provincia de destino.",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo."+
"Las marcas, formatos, presentaciones y cantidades pueden variar según disponibilidad, manteniendo siempre el valor total y el contenido del combo.",
},
{
  id: 3,
  nombre: "Combo Básico",
  precio: 49,
  imagen: ComboBasicoImg, // tu imagen
  imagenes: [ComboBasicoImg, ComboBasicoImg, ComboBasicoImg],
  masVendido: true,
  novedad: false,
  categoria: "Combos Alimentos",
  descripcionCorta: "El combo ideal para resolver lo básico en casa por varios días.",
  descripcion: "El Combo Básico es perfecto para ayudar a tu familia a salir del paso y asegurar comida para una o dos semanas. Incluye los productos esenciales para cocinar y alimentarse.",
  incluye: [
    "🍚 Arroz: entre 3 y 5 kg",
    "🛢️ Aceite: entre 1.5 y 2 Litros",
    "🍗 Pollo: mínimo 2 kg",
    "🥩 Carne de cerdo o res: mínimo 1.5 kg",
    "🍖 Picadillo: 1 paquete (400-500 g apx)",
    "🥚 Huevos: 12 unidades ",
    "🥛 Leche en polvo: 1 paquete (400-500 g apx)",
    "🌭 Jamón o embutidos: 1 paquete",
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Entre 3 y 10 días hábiles, según disponibilidad del proveedor y provincia de destino.",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo."+
"Las marcas, formatos, presentaciones y cantidades pueden variar según disponibilidad, manteniendo siempre el valor total y el contenido del combo."
},
{
  id: 4,
  nombre: "Combo de Aseo",
  precio: 39,
  imagen: CombodeAseoImg, // tu imagen
  imagenes: [CombodeAseoImg, CombodeAseoImg, CombodeAseoImg],
  masVendido: false,
  novedad: true,
  categoria: "Combos de Aseo",
  descripcionCorta: "Todo lo necesario para mantener la casa limpia y la familia aseada.",
  descripcion: "El Combo de Aseo incluye los productos básicos de limpieza e higiene para el hogar. Ideal para mantener la casa limpia y el día a día resuelto.",
  incluye: [
    "🧺 Detergente en polvo: 1 a 2 paquetes",
		"🧴 Detergente líquido o lavavajillas: 1 unidad",
		"🧼 Jabón de lavar: 2 a 4 unidades",
		"🛁 Jabón de baño: 3 a 5 unidades",
		"🧻 Papel higiénico o servilletas: 1 paquete",
		"🦷 Algún producto adicional de higiene (desodorante, frazada, cloro, etc.)",
  ],

  entrega: "En toda Cuba",
  tiempoEntrega: "Entre 3 y 10 días hábiles, según disponibilidad del proveedor y provincia de destino.",

  nota: "Las imágenes son referenciales y no representan necesariamente el contenido exacto del combo."+
"Las marcas, formatos, presentaciones y cantidades pueden variar según disponibilidad, manteniendo siempre el valor total y el contenido del combo."
},
]
