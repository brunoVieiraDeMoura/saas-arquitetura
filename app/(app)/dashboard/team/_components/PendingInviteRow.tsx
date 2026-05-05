'use client'

import { useState, useTransition } from 'react'
import { Copy, Check, Trash2, Link } from 'lucide-react'
import { revokeInvite } from '../actions'

interface Props {
  id: string
  email: string
  expiresAt: string
  token: string
  baseUrl: string
}

export default function PendingInviteRow({ id, email, expiresAt, token, baseUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inviteUrl = `${baseUrl}/invite/${token}`

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-900">{email}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Expira em {new Date(expiresAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLink(v => !v)}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Ver link"
          >
            <Link size={13} />
          </button>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
            Pendente
          </span>
          <form action={() => startTransition(() => revokeInvite(id))}>
            <button
              type="submit"
              disabled={isPending}
              className="text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
              title="Cancelar convite"
            >
              <Trash2 size={13} />
            </button>
          </form>
        </div>
      </div>

      {showLink && (
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">
          <p className="text-[11px] text-neutral-500 font-mono truncate flex-1">{inviteUrl}</p>
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        </div>
      )}
    </div>
  )
}
