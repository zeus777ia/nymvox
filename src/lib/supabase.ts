import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 20,
)

// createClient empty url/key ile throw eder → tüm uygulama beyaz sayfa olur.
const FALLBACK_URL = 'https://zzzzzzzzzzzzzzzzzzzz.supabase.co'
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6enp6enp6enp6enp6enp6enp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjAsImV4cCI6MH0.invalid'

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : FALLBACK_URL,
  isSupabaseConfigured ? supabaseAnonKey : FALLBACK_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  role: 'user' | 'admin'
  plan: 'free' | 'starter' | 'pro' | 'business'
  created_at: string
}
