import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/hooks/useToast'
import { plans } from '@/config/plans'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, CreditCard } from 'lucide-react'

export function BillingPage() {
  const { user, profile } = useAuth()
  const { subscription } = useSubscription(user?.id)
  const { addToast } = useToast()

  const handleCheckout = (planId: string) => {
    addToast(
      `${planId} planı seçildi. Canlı Stripe için STRIPE_SECRET_KEY ve webhook gerekir — şimdilik mock.`,
      'info',
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Abonelik ve Ödeme</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Mevcut Abonelik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <strong>Plan:</strong> <span className="capitalize">{subscription?.plan || profile?.plan || 'free'}</span>
          </p>
          <p>
            <strong>Durum:</strong> {subscription?.status || 'active'}
          </p>
          <p>
            <strong>Sonraki Ödeme:</strong>{' '}
            {subscription?.current_period_end
              ? new Date(subscription.current_period_end).toLocaleDateString('tr-TR')
              : '—'}
          </p>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-4">Paket Değiştir</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={profile?.plan === plan.id ? 'border-indigo-500 ring-2 ring-indigo-500' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-2xl font-bold">
                {plan.priceLabel}
                <span className="text-sm text-gray-500">/ay</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 mb-4 text-sm">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              {profile?.plan === plan.id ? (
                <Button disabled className="w-full">
                  Mevcut Plan
                </Button>
              ) : (
                <Button onClick={() => handleCheckout(plan.id)} className="w-full">
                  Seç
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
