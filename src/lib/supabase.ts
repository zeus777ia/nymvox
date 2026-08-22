import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 20,
)

const FALLBACK_URL = 'https://zzzzzzzzzzzzzzzzzzzz.supabase.co'
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6enp6enp6enp6enp6enp6enp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjAsImV4cCI6MH0.invalid'

function makeClient(): SupabaseClient {
  try {
    return createClient(
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
  } catch (err) {
    console.error('Supabase client oluşturulamadı', err)
    return createClient(FALLBACK_URL, FALLBACK_KEY)
  }
}

export const supabase: SupabaseClient = makeClient()

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  role: 'user' | 'admin'
  plan: 'free' | 'starter' | 'pro' | 'business'
  created_at: string
}
