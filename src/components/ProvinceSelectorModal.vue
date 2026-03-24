<template>
  <div v-if="open" class="overlay">
    <div class="modal">
      <div class="imgBox">📍</div>

      <h2>Punto de entrega</h2>
      <p>
        Selecciona tu provincia y municipio para ver los productos disponibles en tu zona.
      </p>

      <div class="field">
        <label>Provincia</label>
        <select v-model="provinciaLocal">
          <option value="">Selecciona una provincia</option>
          <option v-for="prov in provincias" :key="prov" :value="prov">
            {{ prov }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Municipio</label>
        <select v-model="municipioLocal" :disabled="!provinciaLocal">
          <option value="">Selecciona un municipio</option>
          <option
            v-for="mun in municipiosDisponibles"
            :key="mun"
            :value="mun"
          >
            {{ mun }}
          </option>
        </select>
      </div>

      <button
        class="btn"
        :disabled="!provinciaLocal || !municipioLocal"
        @click="confirmar"
      >
        Aceptar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"
import { municipiosPorProvincia } from "../data/municipiosCuba.js"

const props = defineProps({
  open: { type: Boolean, default: false },
  provincia: { type: String, default: "" },
  municipio: { type: String, default: "" },
  provincias: { type: Array, default: () => [] }
})

const emit = defineEmits(["confirm"])

const provinciaLocal = ref(props.provincia || "")
const municipioLocal = ref(props.municipio || "")

watch(
  () => props.provincia,
  (v) => {
    provinciaLocal.value = v || ""
  }
)

watch(
  () => props.municipio,
  (v) => {
    municipioLocal.value = v || ""
  }
)

watch(provinciaLocal, (nueva, anterior) => {
  if (nueva !== anterior) {
    municipioLocal.value = ""
  }
})

const municipiosDisponibles = computed(() => {
  if (!provinciaLocal.value) return []
  return municipiosPorProvincia[provinciaLocal.value] || []
})

function confirmar() {
  if (!provinciaLocal.value || !municipioLocal.value) return

  emit("confirm", {
    provincia: provinciaLocal.value,
    municipio: municipioLocal.value
  })
}
</script>

<style scoped>
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(17,24,39,.45);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: grid;
  place-items: center;
  padding: 16px;
}

.modal{
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,.20);
  text-align: center;
}

.imgBox{
  width: 72px;
  height: 72px;
  margin: 0 auto 14px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: rgba(40,167,69,0.10);
  border: 1px solid rgba(40,167,69,0.18);
  font-size: 34px;
}

h2{
  margin: 0;
  font-size: 30px;
  font-weight: 1000;
  line-height: 1.08;
}

p{
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.45;
}

.field{
  margin-top: 18px;
  text-align: left;
}

.field label{
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 1000;
  color: #374151;
}

.field select{
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  font-size: 15px;
  font-weight: 700;
  background: white;
  outline: none;
  box-sizing: border-box;
}

.field select:focus{
  border-color: rgba(34,197,94,0.55);
  box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
}

.field select:disabled{
  opacity: .6;
  cursor: not-allowed;
  background: #f9fafb;
}

.btn{
  margin-top: 18px;
  width: 100%;
  min-height: 50px;
  border: none;
  border-radius: 16px;
  background: #28a745;
  color: white;
  font-size: 15px;
  font-weight: 1000;
  cursor: pointer;
  transition: transform .12s ease, opacity .12s ease;
}

.btn:hover{
  transform: translateY(-1px);
}

.btn:disabled{
  opacity: .45;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 640px){
  .overlay{
    padding: 12px;
  }

  .modal{
    padding: 18px;
    border-radius: 20px;
  }

  .imgBox{
    width: 62px;
    height: 62px;
    border-radius: 18px;
    font-size: 28px;
  }

  h2{
    font-size: 24px;
  }

  p{
    font-size: 13px;
  }

  .field{
    margin-top: 14px;
  }

  .field label{
    font-size: 12px;
  }

  .field select{
    font-size: 14px;
    padding: 13px 14px;
    border-radius: 14px;
  }

  .btn{
    min-height: 46px;
    border-radius: 14px;
    font-size: 14px;
  }
}
</style>