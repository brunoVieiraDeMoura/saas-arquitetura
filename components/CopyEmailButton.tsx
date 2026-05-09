'use client'

import { useState } from 'react'
import { Copy, Check, Mail } from 'lucide-react'

const EMAIL = 'contato@arquiteturaorganizada.com.br'

export default function CopyEmailButton({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (variant === 'light') {
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm font-medium text-neutral-700 border border-neutral-300 px-4 py-2 rounded-lg hover:bg-white transition-colors min-w-0 w-full sm:w-auto"
      >
        <span className="shrink-0">{copied ? <Check size={14} className="text-green-600" /> : <Mail size={14} />}</span>
        <span className="break-all text-left">{copied ? 'Copiado!' : EMAIL}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2.5 bg-white text-neutral-900 text-sm font-medium px-5 py-3 rounded-xl hover:bg-neutral-100 transition-colors w-full sm:w-auto"
    >
      <span className="shrink-0">{copied ? <Check size={15} className="text-green-600" /> : <Mail size={15} />}</span>
      <span className="break-all text-left">{copied ? 'Email copiado!' : EMAIL}</span>
    </button>
  )
}
