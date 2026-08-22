import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { publishWithAccount } from '@/lib/publish'

export function usePublisher() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const busy = useRef(false)

  useEffect(() => {
    if (!user) return

    const tick = async () => {
      if (busy.current) return
      busy.current = true
      try {
        const now = new Date().toISOString()
        const { data: due, error } = await supabase
          .from('posts')
          .select('id, content, account_id')
          .eq('user_id', user.id)
          .eq('status', 'scheduled')
          .lte('scheduled_at', now)
        if (error || !due?.length) return

        for (const post of due) {
          try {
            if (!post.account_id) throw new Error('Hesap yok')
            const { data: account, error: accErr } = await supabase
              .from('social_accounts')
              .select('id, platform, access_token, refresh_token, oauth_user_id')
              .eq('id', post.account_id)
              .single()
            if (accErr || !account) throw new Error('Hesap bulunamadı')
            await publishWithAccount(account, post.content)
            await supabase
              .from('posts')
              .update({ status: 'published', published_at: new Date().toISOString() })
              .eq('id', post.id)
            addToast(`Zamanlanan post ${account.platform} üzerinde paylaşıldı`, 'success')
          } catch (e) {
            await supabase.from('posts').update({ status: 'failed' }).eq('id', post.id)
            addToast(e instanceof Error ? `Paylaşım başarısız: ${e.message}` : 'Paylaşım başarısız', 'error')
          }
        }
      } finally {
        busy.current = false
      }
    }

    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [user, addToast])
}
