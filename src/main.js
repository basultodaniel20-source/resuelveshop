import "./style.css"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { supabase } from "./supabase"

const app = createApp(App)

// Hacemos supabase global
app.config.globalProperties.$supabase = supabase

// Usamos router
app.use(router)

// Montamos app
app.mount("#app")

// Debug de sesión (opcional)
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event, session)
})