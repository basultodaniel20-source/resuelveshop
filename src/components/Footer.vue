<template>
  <footer class="footer">
    <p v-if="isInternacional">
      ⚠️ Los combos se preparan según disponibilidad.
      Los productos pueden variar manteniendo siempre el valor del combo.
    </p>

    <p v-else-if="isCuba">
      🛍️ Los productos y disponibilidades pueden variar según stock,
      manteniendo siempre información clara y actualizada.
    </p>

    <p v-else>
      ResuelveShop · Compra fácil para Cuba.
    </p>
  </footer>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const isInternacional = computed(() => route.path.startsWith("/internacional"))
const isCuba = computed(() => route.path.startsWith("/cuba"))
</script>

<style scoped>
.footer {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
  background: #f5f6f8;
  border-top: 1px solid #ddd;
}
</style>