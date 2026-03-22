<template>
  <section class="sectionHero" :style="bgStyle">
    <div class="overlay"></div>

    <div class="content">
      <div class="left">
        <h2 class="title">{{ title }}</h2>
        <p v-if="subtitle" class="sub">{{ subtitle }}</p>

        <div v-if="$slots.actions" class="actions">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="sideImage" class="right">
        <img :src="sideImage" :alt="title" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  bgImage: { type: String, default: "" },     // fondo (opcional)
  sideImage: { type: String, default: "" },   // imagen a la derecha (opcional)
})

const bgStyle = computed(() => ({
  backgroundImage: props.bgImage ? `url(${props.bgImage})` : "none",
}))
</script>

<style scoped>
.sectionHero{
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
  min-height: 170px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 14px 34px rgba(0,0,0,0.06);
}

/* oscurece un poco el fondo para que se lea el texto */
.overlay{
  position:absolute; inset:0;
  background: linear-gradient(90deg, rgba(0,0,0,0.50), rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.00));
}

.content{
  position: relative;
  z-index: 1;
  padding: 18px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
  align-items: center;
}

.title{
  margin: 0;
  color: #fff;
  font-weight: 1000;
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.2px;
}
.sub{
  margin: 10px 0 0;
  color: rgba(255,255,255,0.88);
  font-weight: 900;
  font-size: 13px;
}

.actions{ margin-top: 12px; display:flex; gap:10px; flex-wrap: wrap; }

/* bloque derecha (si quieres como “móvil flotante” o producto) */
.right{
  display:flex;
  justify-content: flex-end;
}
.right img{
  width: min(280px, 100%);
  height: auto;
  border-radius: 14px;
  background: rgba(255,255,255,0.9);
  padding: 10px;
  border: 1px solid rgba(255,255,255,0.35);
}

@media (max-width: 900px){
  .content{ grid-template-columns: 1fr; }
  .title{ font-size: 20px; }
  .right{ justify-content: flex-start; }
  .overlay{
    background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.10));
  }
}
</style>
