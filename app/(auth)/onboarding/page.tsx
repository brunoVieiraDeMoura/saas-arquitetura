'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [officeName, setOfficeName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleNameChange(value: string) {
    setOfficeName(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  function handleSlugChange(value: string) {
    setSlug(slugify(value))
    setSlugEdited(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slug || slug.length < 3) { setError('Slug deve ter ao menos 3 caracteres.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: officeName, slug }),
    })

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? 'Erro ao criar seu espaço.')
      setLoading(false)
      return
    }

    const plan = searchParams.get('plan')
    const billingParam = searchParams.get('billing')
    const billingQuery = billingParam === 'annual' ? '&billing=annual' : ''
    router.push(plan ? `/dashboard/billing?checkout=${plan}${billingQuery}` : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-white sm:bg-neutral-50 px-6 pt-16 pb-10 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-8">
      <div className="w-full sm:max-w-md sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900">Configure seu espaço</h1>
          <p className="text-sm text-neutral-500 mt-1">Isso leva menos de um minuto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nome do escritório</label>
            <input type="text" required value={officeName} onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Arquitetura Organizada" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">URL do seu site</label>
            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
              <input type="text" required value={slug} onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-3 py-3 sm:py-2 text-sm focus:outline-none"
                placeholder="arquitetura-organizada" />
              <span className="px-3 py-2 bg-neutral-50 text-sm text-neutral-400 border-l border-neutral-300 shrink-0 select-none">
                .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Somente letras minúsculas, números e hífens.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-3 sm:py-2" disabled={loading}>
            {loading ? 'Criando...' : 'Criar meu site'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense><OnboardingPage /></Suspense>
}
