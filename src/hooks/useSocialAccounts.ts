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
  oauth_user_id?: string | null
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

  const upsertOAuthAccount = async (row: {
    platform: string
    account_name: string
    account_handle: string
    profile_image_url?: string
    followers_count?: number
    oauth_user_id?: string
    access_token?: string
    refresh_token?: string
    token_expires_at?: string
  }) => {
    if (!userId) throw new Error('Oturum yok')

    if (row.oauth_user_id) {
      const { data: existing } = await supabase
        .from('social_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('platform', row.platform)
        .eq('oauth_user_id', row.oauth_user_id)
        .maybeSingle()
      if (existing?.id) {
        const { data, error } = await supabase
          .from('social_accounts')
          .update({
            account_name: row.account_name,
            account_handle: row.account_handle,
            profile_image_url: row.profile_image_url ?? '',
            followers_count: row.followers_count ?? 0,
            access_token: row.access_token,
            refresh_token: row.refresh_token,
            token_expires_at: row.token_expires_at,
            is_active: true,
          })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        setAccounts((prev) => prev.map((a) => (a.id === existing.id ? (data as SocialAccount) : a)))
        return data as SocialAccount
      }
    }

    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: userId,
        platform: row.platform,
        account_name: row.account_name,
        account_handle: row.account_handle,
        profile_image_url: row.profile_image_url ?? '',
        followers_count: row.followers_count ?? 0,
        oauth_user_id: row.oauth_user_id,
        access_token: row.access_token,
        refresh_token: row.refresh_token,
        token_expires_at: row.token_expires_at,
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

  return { accounts, loading, addAccount, upsertOAuthAccount, removeAccount }
}
