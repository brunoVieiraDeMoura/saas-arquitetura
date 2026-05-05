'use client'

import { useState, useTransition } from 'react'

interface Props {
  token: string
  hasConflict: boolean
  acceptInvite: (token: string) => Promise<{ error?: string } | void>
  acceptInviteForce: (token: string) => Promise<void>
}

export default function AcceptButtons({ token, hasConflict, acceptInvite, acceptInviteForce }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!hasConflict) {
    return (
      <form action={() => startTransition(() => acceptInvite(token) as any)}>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Aceitando…' : 'Aceitar convite'}
        </button>
      </form>
    )
  }

  if (confirming) {
    return (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
          Você perderá o acesso ao escritório atual. Essa ação não pode ser desfeita.
        </div>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => acceptInviteForce(token))}
          className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Trocando…' : 'Confirmar troca de escritório'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="w-full py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
        Você já faz parte de outro escritório. Aceitar este convite irá substituir seu acesso atual.
      </div>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
      >
        Aceitar convite
      </button>
    </div>
  )
}
