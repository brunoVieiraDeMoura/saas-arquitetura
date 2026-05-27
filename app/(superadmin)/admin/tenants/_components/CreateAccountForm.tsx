'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createAccount } from '../actions'

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CreateAccountForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  function handleNameChange(value: string) {
    if (!slugEdited) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    formData.set('slug', slug)

    const result = await createAccount(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(`Conta criada! Site: ${result.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    setLoading(false)
    setOpen(false)
    setSlug('')
    setSlugEdited(false)
    formRef.current?.reset()
    router.refresh()
  }

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        + Nova conta
      </button>

      {success && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          {success}
        </p>
      )}

      {open && (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 bg-white border border-neutral-200 rounded-xl p-6 space-y-4 max-w-md">
          <h3 className="text-sm font-semibold text-neutral-900">Criar nova conta de cliente</h3>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Nome do escritório</label>
            <input
              name="name"
              type="text"
              required
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Escritório Silva Arquitetura"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">URL do site (slug)</label>
            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true) }}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="silva-arquitetura"
              />
              <span className="px-3 py-2 bg-neutral-50 text-xs text-neutral-400 border-l border-neutral-300 shrink-0">
                .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Email do cliente</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="cliente@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Senha</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-neutral-500 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
