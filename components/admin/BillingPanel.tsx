'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS, formatPrice, type Plan } from '@/lib/plans'
import PlanBadge from './PlanBadge'
import { Globe } from 'lucide-react'
import CopyEmailButton from '@/components/CopyEmailButton'

const IS_DEV = process.env.NODE_ENV === 'development'
const WA_NUMBER = '5521999433890'
const WA_STORAGE_KEY = 'wa_contacted'

function WhatsAppButton({ companyName }: { companyName: string }) {
  const contacted = typeof window !== 'undefined' && localStorage.getItem(WA_STORAGE_KEY) === '1'
  const message = contacted
    ? `Olá! Sou ${companyName}, cliente do Arquitetura Organizada. Gostaria de tirar uma dúvida.`
    : `Olá! Sou ${companyName}, cliente do Arquitetura Organizada. Gostaria de agendar a primeira chamada explicativa.`

  function handleClick() {
    localStorage.setItem(WA_STORAGE_KEY, '1')
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2.5 w-fit bg-neutral-900 hover:bg-neutral-700 transition-colors text-white rounded-xl px-4 py-2.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.122 1.524 5.862L.057 23.928a.5.5 0 0 0 .61.61l6.144-1.49A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.855 9.855 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374A9.855 9.855 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.467 0 9.9 4.433 9.9 9.9 0 5.467-4.433 9.9-9.9 9.9z"/>
      </svg>
      <span className="text-sm font-medium">Contato por WhatsApp</span>
    </button>
  )
}

const PLAN_ORDER: Record<string, number> = { starter: 0, pro: 1, agency: 2 }

type Props = {
  currentPlan: string
  hasSubscription: boolean
  companyName: string
}

export default function BillingPanel({ currentPlan, hasSubscription, companyName }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const router = useRouter()

  async function handleUpgrade(planId: string, billingCycle: 'monthly' | 'annual' = billing) {
    setLoading(planId)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing: billingCycle }),
      })
      let json: Record<string, unknown> = {}
      try { json = await res.json() } catch { /* non-json response */ }
      if (!res.ok) {
        alert((json.error as string) ?? `Erro ${res.status} ao iniciar checkout.`)
      } else if (json.url) {
        window.location.href = json.url as string
        return
      }
    } catch {
      alert('Erro de rede. Verifique sua conexão.')
    }
    setLoading(null)
  }

  async function handleCancel() {
    setLoading('cancel')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error ?? 'Erro ao abrir portal de assinatura.')
        setLoading(null)
        return
      }
      if (json.url) {
        window.location.href = json.url
        return
      }
    } catch {
      alert('Erro de conexão. Tente novamente.')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-neutral-900">Plano atual</p>
            <div className="mt-1"><PlanBadge plan={currentPlan} /></div>
          </div>
          {currentPlan !== 'starter' && hasSubscription && (
            <div>
              {cancelConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">Confirmar cancelamento?</span>
                  <button
                    onClick={handleCancel}
                    disabled={loading === 'cancel'}
                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                  >
                    {loading === 'cancel' ? 'Cancelando...' : 'Sim, cancelar'}
                  </button>
                  <button onClick={() => setCancelConfirm(false)} className="text-xs text-neutral-400 hover:underline">
                    Voltar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCancelConfirm(true)}
                  className="text-xs text-neutral-500 hover:underline"
                >
                  Cancelar assinatura
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-neutral-400">
          {currentPlan === 'starter'
            ? `${PLANS.starter.limits.categories} categorias · ${PLANS.starter.limits.projects} projetos`
            : 'Categorias e projetos ilimitados'}
        </p>
        {currentPlan !== 'starter' && (
          <p className="text-xs text-neutral-400 mt-1">Pagamentos processados pelo Stripe.</p>
        )}
      </div>

      {currentPlan === 'agency' && (
        <WhatsAppButton companyName={companyName} />
      )}

      {/* Billing toggle */}
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
        {billing === 'annual' && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Economize até 32%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.values(PLANS) as typeof PLANS[Plan][]).map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isDowngrade = PLAN_ORDER[plan.id] < PLAN_ORDER[currentPlan]
          const price = billing === 'annual' ? plan.priceAnnual : plan.price
          const originalPrice = plan.price

          return (
            <div key={plan.id} className={`bg-white rounded-xl border p-6 flex flex-col gap-4 ${isCurrent ? 'border-neutral-900' : isDowngrade ? 'border-neutral-100 opacity-70' : 'border-neutral-200'}`}>
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`font-semibold ${isDowngrade ? 'text-neutral-400' : 'text-neutral-900'}`}>{plan.name}</p>
                  {billing === 'annual' && plan.annualDiscount > 0 && (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                      -{plan.annualDiscount}%
                    </span>
                  )}
                </div>
                {price === 0 ? (
                  <p className={`text-2xl font-bold ${isDowngrade ? 'text-neutral-400' : 'text-neutral-900'}`}>Grátis</p>
                ) : (
                  <>
                    {billing === 'annual' && (
                      <p className={`text-xs line-through ${isDowngrade ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {formatPrice(originalPrice)}/mês
                      </p>
                    )}
                    <p className={`text-2xl font-bold ${isDowngrade ? 'text-neutral-400' : 'text-neutral-900'}`}>
                      {formatPrice(price)}
                      <span className="text-sm font-normal text-neutral-300">/mês</span>
                    </p>
                    {billing === 'annual' && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        cobrado {formatPrice(price * 12)}/ano
                      </p>
                    )}
                  </>
                )}
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`text-xs ${isDowngrade ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    <div className="flex items-center gap-2">
                      {f === 'Utilize seu próprio domínio' ? (
                        <Globe size={12} className={`shrink-0 ${isDowngrade ? 'text-neutral-300' : 'text-neutral-400'}`} />
                      ) : (
                        <span className={`shrink-0 ${isDowngrade ? 'text-neutral-300' : 'text-neutral-400'}`}>✓</span>
                      )}
                      {f}
                    </div>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="text-xs text-center text-neutral-400 py-2">Plano atual</div>
              ) : isDowngrade && plan.id !== 'starter' ? (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full py-2 text-xs font-medium text-neutral-400 border border-neutral-200 rounded-lg hover:border-neutral-400 hover:text-neutral-600 disabled:opacity-50 transition-colors"
                >
                  {loading === plan.id ? 'Aguarde...' : `Regredir para ${plan.name}`}
                </button>
              ) : plan.price > 0 ? (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-60 transition-colors"
                >
                  {loading === plan.id ? 'Aguarde...' : `Assinar ${plan.name}`}
                </button>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">Dúvidas sobre cobrança?</p>
          <p className="text-xs text-neutral-500 mt-0.5">Nossa equipe responde em até 24h.</p>
        </div>
        <CopyEmailButton variant="light" />
      </div>

      {IS_DEV && (
        <div className="border border-dashed border-amber-300 bg-amber-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-3">⚠ DEV — Simular ativação de plano</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(PLANS).map((plan) => (
              <button
                key={plan.id}
                onClick={async () => {
                  setLoading(`dev-${plan.id}`)
                  await fetch('/api/dev/activate-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: plan.id }),
                  })
                  setLoading(null)
                  router.refresh()
                }}
                disabled={loading === `dev-${plan.id}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-200 text-amber-900 hover:bg-amber-300 disabled:opacity-50 transition-colors"
              >
                {loading === `dev-${plan.id}` ? '...' : `Ativar ${plan.name}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
