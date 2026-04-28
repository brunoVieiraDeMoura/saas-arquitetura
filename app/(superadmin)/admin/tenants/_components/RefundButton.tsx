'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RefundButton({ tenantId, tenantName }: { tenantId: string; tenantName: string }) {
  const [step, setStep] = useState<'idle' | 'confirm' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()

  async function handleRefund() {
    setStep('loading')
    const res = await fetch('/api/billing/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId }),
    })
    const json = await res.json()
    if (!res.ok) {
      setErrMsg(json.error ?? 'Erro desconhecido')
      setStep('error')
    } else {
      setStep('done')
      router.refresh()
    }
  }

  if (step === 'done') return <span className="text-xs text-green-600 font-medium">Reembolsado ✓</span>

  if (step === 'error') return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-red-600">{errMsg}</span>
      <button onClick={() => setStep('idle')} className="text-xs text-neutral-400 hover:underline">Fechar</button>
    </div>
  )

  if (step === 'confirm') return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500">Reembolsar <span className="font-medium text-neutral-800">{tenantName}</span>?</span>
      <button
        onClick={handleRefund}
        className="text-xs text-red-600 font-medium hover:underline"
      >
        Confirmar
      </button>
      <button onClick={() => setStep('idle')} className="text-xs text-neutral-400 hover:underline">Cancelar</button>
    </div>
  )

  return (
    <button
      onClick={() => setStep('confirm')}
      disabled={step === 'loading'}
      className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors disabled:opacity-50"
    >
      {step === 'loading' ? 'Processando...' : 'Reembolsar'}
    </button>
  )
}
