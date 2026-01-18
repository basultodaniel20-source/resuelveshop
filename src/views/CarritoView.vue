<template>
  <Carrito
    :items="carrito"
    @mas="$emit('mas', $event)"
    @menos="$emit('menos', $event)"
    @eliminar="$emit('eliminar', $event)"
    @whatsapp="$emit('whatsapp')"
  />
</template>

<script setup>
import Carrito from "../components/Carrito.vue"

defineProps({
  carrito: {
    type: Array,
    default: () => []
  }
})
</script>
