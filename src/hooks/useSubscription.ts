import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { planLimits } from '@/config/plans'

export type Subscription = {
  id: string
  user_id: string
  plan: string
  status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string
}

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [limits, setLimits] = useState(planLimits.free)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    const fetchSubscription = async () => {
      const { data: profile } = await supabase.from('profiles').select('plan').eq('id', userId).single()
      const plan = (profile?.plan as string) || 'free'
      setLimits(planLimits[plan] || planLimits.free)

      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', userId).maybeSingle()
      setSubscription((sub as Subscription) || null)
      setLoading(false)
    }
    fetchSubscription().catch(() => setLoading(false))
  }, [userId])

  return { subscription, limits, loading }
}
