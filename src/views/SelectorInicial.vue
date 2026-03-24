<template>
  <div
    class="selector"
    @mousemove="handleMouseMove"
    @mouseleave="resetParallax"
    :style="bgStyle"
  >
    <div class="overlay"></div>
    <div class="noise"></div>

    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <div class="box">
      <div class="head fade-up">
        <h1>¿Qué quieres hacer?</h1>
      </div>

      <div class="opciones">
        <div
          class="card fade-up delay-1"
          @click="goInternacional"
          role="button"
          tabindex="0"
          @keyup.enter="goInternacional"
        >
          <div class="ico-wrap">
            <svg
              class="ico"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18"></path>
              <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z"></path>
            </svg>
          </div>

          <h2>Enviar desde el extranjero</h2>
          <p>Compra combos y envía a Cuba</p>

          <button class="enter-btn" type="button" tabindex="-1">
            <span>Entrar</span>
            <svg
              class="arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="M13 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div
          class="card cuba fade-up delay-2"
          @click="goCuba"
          role="button"
          tabindex="0"
          @keyup.enter="goCuba"
        >
          <div class="ico-wrap cuba-ico">
            <svg
              class="ico"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7h18"></path>
              <path d="M3 12h18"></path>
              <path d="M3 17h18"></path>
              <path d="M3 7l7 5-7 5V7z"></path>
              <path d="M7.1 12l.3-.9.3.9h1l-.8.6.3.9-.8-.6-.8.6.3-.9-.8-.6h1z"></path>
            </svg>
          </div>

          <h2>Comprar en Cuba</h2>
          <p>Ropa, relojes, gym, accesorios y más</p>

          <button class="enter-btn" type="button" tabindex="-1">
            <span>Entrar</span>
            <svg
              class="arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="M13 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const mouseX = ref(0)
const mouseY = ref(0)

function goInternacional() {
  router.push("/internacional")
}

function goCuba() {
  router.push("/cuba")
}

function handleMouseMove(e) {
  const { innerWidth, innerHeight } = window
  const x = (e.clientX / innerWidth - 0.5) * 16
  const y = (e.clientY / innerHeight - 0.5) * 16
  mouseX.value = x
  mouseY.value = y
}

function resetParallax() {
  mouseX.value = 0
  mouseY.value = 0
}

const bgStyle = computed(() => ({
  "--bg-pos-x": `calc(50% + ${mouseX.value}px)`,
  "--bg-pos-y": `calc(50% + ${mouseY.value}px)`,
}))
</script>

<style scoped>
.selector{
  --bg-pos-x: 50%;
  --bg-pos-y: 50%;
  position: relative;
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 24px;
  overflow: hidden;
  background-image: url("/img/banners/kuba_havanna_huvudbild.webp");
  background-size: cover;
  background-position: var(--bg-pos-x) var(--bg-pos-y);
  background-repeat: no-repeat;
  transition: background-position .25s ease-out;
}
.overlay{
  position: absolute;
  inset: 0;
  z-index: 1;

  background:
    linear-gradient(
      180deg,
      rgba(245,247,247,0.48)
      rgba(240,244,243,0.42)
      rgba(235,241,239,0.55)
    );

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}
.noise{
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: .045;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(0,0,0,.35) 0 1px, transparent 1px),
    radial-gradient(circle at 80% 30%, rgba(0,0,0,.25) 0 1px, transparent 1px),
    radial-gradient(circle at 50% 70%, rgba(0,0,0,.25) 0 1px, transparent 1px);
  background-size: 22px 22px, 26px 26px, 30px 30px;
}

.bg-glow{
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  filter: blur(80px);
  opacity: .42;
  pointer-events: none;
}

.bg-glow-1{
  width: 280px;
  height: 280px;
  background: rgba(34, 197, 94, 0.16);
  top: 7%;
  left: 6%;
}

.bg-glow-2{
  width: 340px;
  height: 340px;
  background: rgba(59, 130, 246, 0.10);
  right: 4%;
  bottom: 6%;
}

.box{
  position: relative;
  z-index: 2;
  text-align:center;
  max-width: 980px;
  width: 100%;
  padding: 20px;
}

.head{
  margin-bottom: 34px;
}

h1{
  margin: 0;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.02;
  font-weight: 1000;
  letter-spacing: -1px;
  color: #0f172a;
  text-shadow: 0 2px 20px rgba(255,255,255,0.22);
}

.head p{
  color:#667085;
  margin-top:12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.45;
}

.opciones{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:24px;
}

.card{
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.54);
  backdrop-filter: blur(14px) saturate(0.95);
  -webkit-backdrop-filter: blur(14px) saturate(0.95);
  border-radius: 28px;
  padding: 34px 28px;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.10),
    0 32px 80px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255,255,255,0.72);
  transition:
    transform .28s ease,
    box-shadow .28s ease,
    border-color .28s ease,
    background .28s ease;
}

.card::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.8),
    rgba(255,255,255,0.18)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events:none;
}

.card::after{
  content:"";
  position:absolute;
  inset:auto -20% -45% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%);
  opacity: .55;
  pointer-events: none;
}

.card:hover{
  transform: translateY(-9px) scale(1.012);
  background: rgba(255,255,255,0.68);
  border-color: rgba(34,197,94,0.16);
  box-shadow:
    0 26px 52px rgba(15, 23, 42, 0.14),
    0 42px 100px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255,255,255,0.85);
}

.card.cuba{
  border: 1.5px solid rgba(34, 197, 94, 0.52);
  box-shadow:
    0 20px 40px rgba(34, 197, 94, 0.10),
    0 30px 84px rgba(15, 23, 42, 0.14),
    inset 0 1px 0 rgba(255,255,255,0.76);
}

.card.cuba:hover{
  border-color: rgba(34, 197, 94, 0.75);
  box-shadow:
    0 26px 52px rgba(34, 197, 94, 0.16),
    0 42px 100px rgba(15, 23, 42, 0.18),
    inset 0 1px 0 rgba(255,255,255,0.85);
}

.ico-wrap{
  width: 70px;
  height: 70px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(238,246,241,0.9) 100%);
  color: #1f2937;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.9),
    0 10px 24px rgba(15, 23, 42, 0.08);
  transition: transform .28s ease, box-shadow .28s ease;
}

.cuba-ico{
  color: #16a34a;
  background: linear-gradient(180deg, rgba(247,255,249,0.95) 0%, rgba(236,253,243,0.95) 100%);
}

.card:hover .ico-wrap{
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.95),
    0 14px 30px rgba(15, 23, 42, 0.10);
}

.ico{
  width: 32px;
  height: 32px;
}

.card h2{
  margin: 0;
  font-size: clamp(26px, 2.5vw, 40px);
  line-height: 1.08;
  font-weight: 1000;
  color: #0f172a;
  letter-spacing: -0.7px;
}

.card p{
  color:#667085;
  margin: 12px auto 0;
  max-width: 320px;
  font-size: 17px;
  line-height: 1.5;
  font-weight: 600;
}

.enter-btn{
  margin-top: 22px;
  padding: 0 18px;
  min-height: 48px;
  border:none;
  border-radius:999px;
  background: linear-gradient(180deg, #2fcb5f 0%, #22a74c 100%);
  color:white;
  font-weight:1000;
  font-size:15px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  box-shadow:
    0 14px 28px rgba(34,197,94,0.24),
    inset 0 1px 0 rgba(255,255,255,0.18);
  transition: transform .22s ease, box-shadow .22s ease, gap .22s ease;
  pointer-events:none;
}

.arrow{
  width: 17px;
  height: 17px;
  transition: transform .22s ease;
}

.card:hover .enter-btn{
  transform: translateY(-1px);
  gap: 12px;
  box-shadow:
    0 18px 34px rgba(34,197,94,0.30),
    inset 0 1px 0 rgba(255,255,255,0.18);
}

.card:hover .arrow{
  transform: translateX(3px);
}

.fade-up{
  opacity: 0;
  transform: translateY(24px);
  animation: fadeUp .75s cubic-bezier(.22, 1, .36, 1) forwards;
}

.delay-1{
  animation-delay: .10s;
}

.delay-2{
  animation-delay: .20s;
}

@keyframes fadeUp{
  to{
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px){
  .selector{
    background-position: center center;
  }

  .opciones{
    grid-template-columns: 1fr;
  }

  .card{
    padding: 28px 22px;
    border-radius: 24px;
  }

  .head{
    margin-bottom: 24px;
  }

  .head p{
    font-size: 15px;
  }

  .card p{
    font-size: 15px;
  }
}

@media (max-width: 640px){
  .selector{
    padding: 14px;
  }

  .box{
    padding: 8px;
  }

  h1{
    font-size: 27px;
    letter-spacing: -0.5px;
  }

  .head p{
    margin-top: 8px;
    font-size: 14px;
  }

  .opciones{
    gap: 16px;
  }

  .card{
    padding: 24px 18px;
    border-radius: 22px;
  }

  .ico-wrap{
    width: 58px;
    height: 58px;
    border-radius: 16px;
    margin-bottom: 14px;
  }

  .ico{
    width: 28px;
    height: 28px;
  }

  .card h2{
    font-size: 22px;
  }

  .card p{
    font-size: 14px;
    margin-top: 10px;
  }

  .enter-btn{
    margin-top: 18px;
    min-height: 44px;
    font-size: 14px;
    padding: 0 16px;
  }

  .arrow{
    width: 15px;
    height: 15px;
  }

  .bg-glow-1,
  .bg-glow-2{
    opacity: .28;
  }
}

@media (prefers-reduced-motion: reduce){
  .selector,
  .card,
  .ico-wrap,
  .enter-btn,
  .arrow,
  .fade-up{
    transition: none !important;
    animation: none !important;
  }
}
</style>