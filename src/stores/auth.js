// src/stores/auth.js
import { ref } from "vue"
import { supabase } from "../supabase"

const user = ref(null)
let started = false

export function useAuth() {
  // Arranca solo una vez
  if (!started) {
    started = true

    supabase.auth.getUser().then(({ data }) => {
      user.value = data.user ?? null
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  return { user }
}
