import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://srqqfqnwefltpuiygrcu.supabase.co"
const supabaseAnonKey = "sb_publishable_X4DzK95XsRxOm1eRPYRKVA_hVXuG9fp"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)