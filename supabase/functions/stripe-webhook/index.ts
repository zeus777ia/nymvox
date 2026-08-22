import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { json, optionsResponse } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()
  if (req.method !== 'POST') {
    return json({ error: 'Sadece POST desteklenir' }, 405)
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature')
    const raw = await req.text()

    // Webhook path (Stripe dashboard → this function URL)
    if (stripeSignature) {
      const event = JSON.parse(raw) as { type?: string; data?: { object?: Record<string, unknown> } }
      return json({
        received: true,
        type: event.type ?? 'unknown',
        note: 'Imza doğrulama için STRIPE_WEBHOOK_SECRET ekle ve plan/subscription satırını güncelle.',
      })
    }

    // Client checkout helper (mock until STRIPE_SECRET_KEY is set)
    const body = JSON.parse(raw || '{}') as { plan?: string; userId?: string; email?: string }
    const plan = body.plan || 'starter'
    const planPrices: Record<string, number> = {
      starter: 900,
      pro: 2900,
      business: 7900,
    }

    return json({
      url: `/billing?checkout=success&plan=${encodeURIComponent(plan)}&user=${encodeURIComponent(body.userId || '')}`,
      plan,
      email: body.email ?? null,
      amount: planPrices[plan] || 0,
      currency: 'usd',
      mock: !Deno.env.get('STRIPE_SECRET_KEY'),
    })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Bilinmeyen hata' }, 500)
  }
})
