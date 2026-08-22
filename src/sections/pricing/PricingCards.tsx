import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { plans } from '@/config/plans'
import { Link } from 'react-router-dom'

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : ''}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              En Popüler
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.priceLabel}</span>
              <span className="text-gray-500">{plan.period}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to="/register">
              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                {plan.cta}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
