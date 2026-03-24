<template>
  <section class="producto-page" v-if="producto">
    <div class="wrap">
      <!-- IMAGEN -->
      <div class="img-box">
        <img :src="producto.imagen" :alt="producto.nombre" />
      </div>

      <!-- INFO -->
      <div class="info">
        <h1>{{ producto.nombre }}</h1>

        <p class="precio">{{ producto.precio }} €</p>

        <p class="desc">
          Producto disponible dentro de Cuba. Ideal para uso diario o regalo.
        </p>

        <p class="availability" v-if="producto?.provincias?.length">
          Provincias:
          <strong>{{ producto.provincias.join(", ") }}</strong>
        </p>

        <p class="availability" v-if="producto?.municipios?.length">
          Municipios:
          <strong>{{ producto.municipios.join(", ") }}</strong>
        </p>

        <p
          v-if="provinciaSeleccionada && !disponibleEnProvincia"
          class="warning"
        >
          Este producto no está disponible en tu provincia seleccionada:
          {{ provinciaSeleccionada }}.
        </p>

        <p
          v-else-if="municipioSeleccionado && !disponibleEnMunicipio"
          class="warning"
        >
          Este producto no está disponible en tu municipio seleccionado:
          {{ municipioSeleccionado }}.
        </p>

        <!-- CANTIDAD -->
        <div class="cantidad">
          <button @click="menos">-</button>
          <span>{{ cantidad }}</span>
          <button @click="mas">+</button>
        </div>

        <!-- BOTÓN -->
        <button class="btn" @click="agregar" :disabled="!disponible">
          {{ disponible ? "Agregar al carrito 🛒" : "No disponible en tu zona" }}
        </button>

        <router-link class="volver" to="/cuba/catalogo">
          ← Volver al catálogo
        </router-link>
      </div>
    </div>
  </section>

  <section v-else class="no-found">
    <h2>Producto no encontrado</h2>
    <router-link to="/cuba/catalogo">Volver</router-link>
  </section>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import { productos } from "../../data/productosCuba.js"

const route = useRoute()
const id = Number(route.params.id)

const producto = computed(() =>
  productos.find((p) => p.id === id)
)

const provinciaSeleccionada = localStorage.getItem("provincia_cuba") || ""
const municipioSeleccionado = localStorage.getItem("municipio_cuba") || ""

const cantidad = ref(1)
const emit = defineEmits(["agregar"])

const disponibleEnProvincia = computed(() => {
  if (!producto.value) return false
  if (!provinciaSeleccionada) return true
  if (!Array.isArray(producto.value.provincias)) return true
  return producto.value.provincias.includes(provinciaSeleccionada)
})

const disponibleEnMunicipio = computed(() => {
  if (!producto.value) return false
  if (!municipioSeleccionado) return true
  if (!Array.isArray(producto.value.municipios)) return true
  return producto.value.municipios.includes(municipioSeleccionado)
})

const disponible = computed(() => {
  return disponibleEnProvincia.value && disponibleEnMunicipio.value
})

function mas() {
  cantidad.value++
}

function menos() {
  if (cantidad.value > 1) cantidad.value--
}

function agregar() {
  if (!producto.value) return

  if (!disponibleEnProvincia.value) {
    alert(`Este producto no está disponible en ${provinciaSeleccionada}.`)
    return
  }

  if (!disponibleEnMunicipio.value) {
    alert(`Este producto no está disponible en ${municipioSeleccionado}.`)
    return
  }

  emit("agregar", {
    ...producto.value,
    cantidad: cantidad.value
  })

  cantidad.value = 1
}
</script>

<style scoped>
.producto-page{
  padding: 14px 4px 24px;
}

.wrap{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.img-box{
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.img-box img{
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
}

.info{
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 22px rgba(0,0,0,0.04);
}

.info h1{
  margin: 0;
  font-size: 28px;
  font-weight: 1000;
  line-height: 1.1;
}

.precio{
  margin-top: 10px;
  font-size: 22px;
  color: #16a34a;
  font-weight: 1000;
}

.desc{
  margin-top: 10px;
  color: #6b7280;
  font-weight: 900;
  font-size: 14px;
  line-height: 1.45;
}

.availability{
  margin-top: 12px;
  color: #374151;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.4;
}

.warning{
  margin-top: 12px;
  color: #991b1b;
  background: #fff1f2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.4;
}

.cantidad{
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f5f6f8;
  border: 1px solid rgba(0,0,0,0.06);
  padding: 8px;
  border-radius: 999px;
}

.cantidad button{
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: none;
  background: white;
  font-size: 18px;
  cursor: pointer;
  transition: transform .12s ease, background .12s ease;
}

.cantidad button:hover{
  background: #eceff3;
  transform: translateY(-1px);
}

.cantidad span{
  min-width: 24px;
  text-align: center;
  font-weight: 1000;
}

.btn{
  margin-top: 18px;
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #28a745;
  color: white;
  font-weight: 1000;
  font-size: 14px;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
  box-shadow: 0 12px 24px rgba(34,197,94,0.18);
}

.btn:hover{
  transform: translateY(-1px);
}

.btn:disabled{
  opacity: .55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.volver{
  display: inline-block;
  margin-top: 14px;
  text-decoration: none;
  font-weight: 900;
  color: #111;
}

.no-found{
  padding: 40px;
  text-align: center;
}

/* MOBILE */
@media (max-width: 900px){
  .wrap{
    grid-template-columns: 1fr;
  }

  .img-box,
  .info{
    padding: 16px;
    border-radius: 18px;
  }

  .img-box img{
    max-height: 220px;
  }

  .info h1{
    font-size: 24px;
  }

  .precio{
    font-size: 20px;
  }

  .desc,
  .availability,
  .warning{
    font-size: 13px;
  }

  .cantidad{
    width: fit-content;
  }

  .btn{
    font-size: 14px;
    border-radius: 14px;
  }
}
</style>