'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PLANS, formatPrice, type Plan } from '@/lib/mercadopago/plans'
import PlanBadge from './PlanBadge'
import { Globe } from 'lucide-react'
import CopyEmailButton from '@/components/CopyEmailButton'

const IS_DEV = process.env.NODE_ENV === 'development'

const PLAN_ORDER: Record<string, number> = { starter: 0, pro: 1, agency: 2 }

type Props = {
  currentPlan: string
  hasSubscription: boolean
}

export default function BillingPanel({ currentPlan, hasSubscription }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get('success')
    const checkout = searchParams.get('checkout')
    if (success === '1') {
      setShowSuccess(true)
      router.replace('/dashboard/billing')
    } else if (checkout && checkout in PLANS && checkout !== 'starter' && checkout !== currentPlan) {
      handleUpgrade(checkout)
    }
  }, [])

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(null)
  }

  async function handleCancel() {
    setLoading('cancel')
    await fetch('/api/billing/portal', { method: 'POST' })
    setCancelConfirm(false)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-green-800 font-medium">Assinatura realizada com sucesso! Seu plano será ativado em instantes.</p>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800 text-lg leading-none">×</button>
        </div>
      )}
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
          <p className="text-xs text-neutral-400 mt-1">
            Pagamentos processados pelo Mercado Pago.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.values(PLANS) as typeof PLANS[Plan][]).map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isDowngrade = PLAN_ORDER[plan.id] < PLAN_ORDER[currentPlan]
          return (
            <div key={plan.id} className={`bg-white rounded-xl border p-6 flex flex-col gap-4 ${isCurrent ? 'border-neutral-900' : isDowngrade ? 'border-neutral-100 opacity-70' : 'border-neutral-200'}`}>
              <div>
                <p className={`font-semibold ${isDowngrade ? 'text-neutral-400' : 'text-neutral-900'}`}>{plan.name}</p>
                <p className={`text-2xl font-bold mt-1 ${isDowngrade ? 'text-neutral-400' : 'text-neutral-900'}`}>
                  {plan.price === 0 ? 'Grátis' : formatPrice(plan.price)}
                  {plan.price > 0 && <span className="text-sm font-normal text-neutral-300">/mês</span>}
                </p>
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
