'use client'

import { useActionState, useState } from 'react'
import { createInvite } from '../actions'

export default function InviteForm() {
  const [state, action, pending] = useActionState(createInvite, null)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!state?.inviteUrl) return
    navigator.clipboard.writeText(state.inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form action={action}>
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="email@exemplo.com"
          className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-60 transition-colors"
        >
          {pending ? 'Criando...' : 'Gerar link'}
        </button>
      </div>
      {state?.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      {state?.inviteUrl && (
        <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs text-neutral-500">Link válido por 10 dias — compartilhe com o convidado:</p>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <p className="text-xs font-mono text-neutral-600 break-all">{state.inviteUrl}</p>
        </div>
      )}
    </form>
  )
}
