'use client'

import { useState, useTransition } from 'react'
import { updateTenantSettings } from '../actions'

interface Props {
  initialSlug: string
  rootDomain: string
}

export default function SettingsForm({ initialSlug, rootDomain }: Props) {
  const [slug, setSlug] = useState(initialSlug)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const slugPreview = `${slug || '…'}.${rootDomain}`

  function handleSlugChange(val: string) {
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''))
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const fd = new FormData()
    fd.append('slug', slug)

    startTransition(async () => {
      const result = await updateTenantSettings(fd)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  const dirty = slug !== initialSlug

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs text-neutral-400 mb-1.5">Slug / URL</label>
        <div className="flex items-center border border-neutral-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition">
          <input
            type="text"
            value={slug}
            onChange={e => handleSlugChange(e.target.value)}
            className="flex-1 text-sm font-medium text-neutral-800 focus:outline-none bg-transparent"
            placeholder="meu-escritorio"
            required
            minLength={3}
            maxLength={50}
          />
          <span className="text-xs text-neutral-400 ml-1 shrink-0 hidden sm:inline">.{rootDomain}</span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-1.5">
          Preview: <span className="text-neutral-600 font-medium">{slugPreview}</span>
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
      )}
      {success && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2.5">Configurações salvas com sucesso.</p>
      )}

      <button
        type="submit"
        disabled={isPending || !dirty}
        className="text-sm font-medium px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? 'Salvando…' : 'Salvar alterações'}
      </button>
    </form>
  )
}
