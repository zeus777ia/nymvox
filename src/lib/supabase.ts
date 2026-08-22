import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  role: 'user' | 'admin'
  plan: 'free' | 'starter' | 'pro' | 'business'
  created_at: string
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
