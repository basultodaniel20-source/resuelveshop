<template>
  <div class="selector">
    <div class="box">
      <h1>¿Qué quieres hacer?</h1>
      <p>Elige cómo quieres comprar en ResuelveShop</p>

      <div class="opciones">
        <div class="card" @click="goInternacional">
          <div class="ico">🌍</div>
          <h2>Enviar desde el extranjero</h2>
          <p>Compra combos y envía a Cuba</p>
          <button>Entrar</button>
        </div>

        <div class="card cuba" @click="goCuba">
          <div class="ico">🇨🇺</div>
          <h2>Comprar en Cuba</h2>
          <p>Ropa, relojes, gym, accesorios y más</p>
          <button>Entrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

function goInternacional() {
  router.push("/internacional")
}

function goCuba() {
  router.push("/cuba")
}
</script>

<style scoped>
.selector{
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg,#f6f7f9,#e9f5ee);
}

.box{
  text-align:center;
  max-width: 900px;
  width: 100%;
  padding: 20px;
}

h1{
  font-size: 32px;
  font-weight: 1000;
}

p{
  color:#6b7280;
  margin-top:8px;
}

.opciones{
  margin-top:30px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:20px;
}

.card{
  background:white;
  border-radius:20px;
  padding:20px;
  cursor:pointer;
  border:1px solid rgba(0,0,0,0.06);
  transition: all .2s ease;
}

.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.card.cuba{
  border: 2px solid #28a745;
}

.ico{
  font-size:30px;
}

button{
  margin-top:14px;
  padding:10px 14px;
  border:none;
  border-radius:999px;
  background:#28a745;
  color:white;
  font-weight:1000;
}
</style>