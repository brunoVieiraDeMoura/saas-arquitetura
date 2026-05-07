'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLANS, formatPrice } from '@/lib/plans'

export default function MarketingPricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const plans = Object.values(PLANS)

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Preços simples e transparentes</h2>
          <p className="text-neutral-500 text-lg">Comece grátis. Faça upgrade quando precisar crescer.</p>
        </div>

        {/* Billing toggle */}
        <div className="flex flex-col items-center gap-2 mb-12">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-neutral-900' : 'text-neutral-400'}`}>
              Mensal
            </span>
            <button
              onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                billing === 'annual' ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
              aria-label="Alternar ciclo de cobrança"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  billing === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billing === 'annual' ? 'text-neutral-900' : 'text-neutral-400'}`}>
              Anual
            </span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-opacity ${
            billing === 'annual' ? 'bg-green-100 text-green-700 opacity-100' : 'opacity-0'
          }`}>
            Economize até {Math.max(...plans.map((p) => p.annualDiscount))}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro'
            const price = billing === 'annual' ? plan.priceAnnual : plan.price
            const originalPrice = plan.price

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-8 flex flex-col ${
                  isPro
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  {isPro ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
                      Mais popular
                    </span>
                  ) : <span />}
                  {billing === 'annual' && plan.annualDiscount > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white shrink-0">
                      -{plan.annualDiscount}%
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-semibold mb-1 ${isPro ? 'text-white' : 'text-neutral-900'}`}>
                  {plan.name}
                </h3>

                <div className="mb-6">
                  {price === 0 ? (
                    <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-neutral-900'}`}>Grátis</span>
                  ) : (
                    <>
                      {billing === 'annual' && (
                        <div className={`text-sm line-through mb-0.5 ${isPro ? 'text-white/40' : 'text-neutral-400'}`}>
                          {formatPrice(originalPrice)}/mês
                        </div>
                      )}
                      <div className="flex items-end gap-1">
                        <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-neutral-900'}`}>
                          {formatPrice(price)}
                        </span>
                        <span className={`text-sm mb-1 ${isPro ? 'text-white/60' : 'text-neutral-400'}`}>/mês</span>
                      </div>
                      {billing === 'annual' && (
                        <p className={`text-xs mt-1 ${isPro ? 'text-white/50' : 'text-neutral-400'}`}>
                          cobrado {formatPrice(price * 12)}/ano
                        </p>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 shrink-0 ${isPro ? 'text-white/60' : 'text-neutral-400'}`}>✓</span>
                        <span className={isPro ? 'text-white/90' : 'text-neutral-700'}>{f}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href={price === 0 ? '/signup' : `/signup?plan=${plan.id}&billing=${billing}`}
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    isPro
                      ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {price === 0 ? 'Começar grátis' : `Assinar ${plan.name}`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
