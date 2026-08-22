import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export type SocialAccount = {
  id: string
  platform: string
  account_name: string
  account_handle: string
  profile_image_url: string
  followers_count: number
  is_active: boolean
}

export function useSocialAccounts(userId: string | undefined) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setAccounts([])
      setLoading(false)
      return
    }
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at')
      if (error) throw error
      setAccounts((data as SocialAccount[]) || [])
      setLoading(false)
    }
    fetchAccounts().catch(() => setLoading(false))
  }, [userId])

  const addAccount = async (platform: string, name: string) => {
    if (!userId) throw new Error('Oturum yok')
    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: userId,
        platform,
        account_name: name,
        account_handle: `@${name.toLowerCase().replace(/\s/g, '')}`,
      })
      .select()
      .single()
    if (error) throw error
    if (data) setAccounts((prev) => [...prev, data as SocialAccount])
    return data as SocialAccount
  }

  const removeAccount = async (id: string) => {
    const { error } = await supabase.from('social_accounts').delete().eq('id', id)
    if (error) throw error
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  return { accounts, loading, addAccount, removeAccount }
}
