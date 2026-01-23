import { reactive } from "vue"
import { supabase } from "../supabase"

export const authState = reactive({
  user: null,
  loading: true
})

export async function initAuth() {
  const { data } = await supabase.auth.getSession()
  authState.user = data.session?.user || null
  authState.loading = false

  supabase.auth.onAuthStateChange((_event, session) => {
    authState.user = session?.user || null
  })
}

export async function logout() {
  await supabase.auth.signOut()
  authState.user = null
}