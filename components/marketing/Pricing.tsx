import Link from 'next/link'
import { PLANS, formatPrice } from '@/lib/mercadopago/plans'

export default function MarketingPricing() {
  const plans = Object.values(PLANS)

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Preços simples e transparentes</h2>
          <p className="text-neutral-500 text-lg">Comece grátis. Faça upgrade quando precisar crescer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isPro = plan.id === 'pro'
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-8 flex flex-col ${
                  isPro
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                {isPro && (
                  <div className="mb-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
                      Mais popular
                    </span>
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${isPro ? 'text-white' : 'text-neutral-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-neutral-900'}`}>Grátis</span>
                  ) : (
                    <>
                      <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-neutral-900'}`}>
                        {formatPrice(plan.price)}
                      </span>
                      <span className={`text-sm ml-1 ${isPro ? 'text-white/60' : 'text-neutral-400'}`}>/mês</span>
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
                  href={plan.price === 0 ? '/signup' : `/signup?plan=${plan.id}`}
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    isPro
                      ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {plan.price === 0 ? 'Começar grátis' : `Assinar ${plan.name}`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
