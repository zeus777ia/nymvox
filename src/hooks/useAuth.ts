import { useState, useEffect, useCallback } from 'react'
import { supabase, type Profile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data as Profile)
      return data as Profile
    }
    return null
  }, [])

  useEffect(() => {
    let cancelled = false

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled) return
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      }
      if (!cancelled) setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (patch: Partial<Pick<Profile, 'full_name' | 'company_name' | 'avatar_url'>>) => {
    if (!user) throw new Error('Oturum yok')
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data as Profile)
    return data as Profile
  }

  return { user, profile, loading, signIn, signUp, signOut, updateProfile }
}
