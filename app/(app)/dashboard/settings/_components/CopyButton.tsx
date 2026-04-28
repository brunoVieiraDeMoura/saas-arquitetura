'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copiado!' : 'Copiar link'}
    </button>
  )
}
