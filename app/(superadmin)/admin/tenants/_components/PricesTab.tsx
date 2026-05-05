'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/mercadopago/plans'
import { Button } from '@/components/ui/button'

type PlanEntry = { price_monthly: number; price_annual: number }

const toInput = (cents: number) => (cents / 100).toFixed(2).replace('.', ',')
const toCents = (s: string) => Math.round(parseFloat(s.replace(',', '.')) * 100) || 0

const PLAN_NAMES: Record<string, string> = { pro: 'Pro', agency: 'Agency' }

export default function PricesTab({ initialPrices }: { initialPrices: Record<string, PlanEntry> }) {
  const [fields, setFields] = useState(() =>
    Object.fromEntries(
      Object.entries(initialPrices).map(([plan, p]) => [
        plan,
        { monthly: toInput(p.price_monthly), annual: toInput(p.price_annual) },
      ])
    )
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    const payload = Object.fromEntries(
      Object.entries(fields).map(([plan, f]) => [
        plan,
        { price_monthly: toCents(f.monthly), price_annual: toCents(f.annual) },
      ])
    )
    const res = await fetch('/api/superadmin/plan-prices', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Erro ao salvar.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg space-y-5">
      {Object.entries(fields).map(([plan, f]) => {
        const monthlyNum = parseFloat(f.monthly.replace(',', '.')) || 0
        const annualNum = parseFloat(f.annual.replace(',', '.')) || 0
        const discount = monthlyNum > 0 ? Math.round((1 - annualNum / monthlyNum) * 100) : 0

        return (
          <div key={plan} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">{PLAN_NAMES[plan] ?? plan}</h2>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Mensal (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">R$</span>
                <input
                  type="text"
                  value={f.monthly}
                  onChange={(e) => setFields((p) => ({ ...p, [plan]: { ...p[plan], monthly: e.target.value } }))}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="130,00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Anual — por mês (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">R$</span>
                <input
                  type="text"
                  value={f.annual}
                  onChange={(e) => setFields((p) => ({ ...p, [plan]: { ...p[plan], annual: e.target.value } }))}
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="99,00"
                />
              </div>
              {discount > 0 && (
                <p className="mt-1.5 text-xs text-green-700">
                  Desconto: {discount}% · cobrado {formatPrice(Math.round(annualNum * 100) * 12)}/ano
                </p>
              )}
            </div>
          </div>
        )
      })}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Salvando...' : saved ? 'Salvo ✓' : 'Salvar preços'}
      </Button>
    </div>
  )
}
