'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Category = { id?: string; name: string; slug: string; description: string; cover_image: string; order_index: number }
type SlimCategory = { id?: string; name: string; order_index: number }

export default function CategoryForm({
  initial,
  defaultOrderIndex = 0,
  allCategories = [],
}: {
  initial?: Category
  defaultOrderIndex?: number
  allCategories?: SlimCategory[]
}) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [orderIndex, setOrderIndex] = useState(initial?.order_index ?? defaultOrderIndex)
  const [orderEdited, setOrderEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const collision = orderEdited
    ? allCategories.find((c) => c.order_index === orderIndex && c.id !== initial?.id)
    : null

  function handleNameChange(value: string) {
    setName(value)
    if (!initial) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { name, slug, description, order_index: orderIndex }

    if (initial) {
      const res = await fetch(`/api/admin/categories/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erro ao salvar categoria.'); setSaving(false); return }
    } else {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erro ao criar categoria.'); setSaving(false); return }
    }

    router.push('/dashboard/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
        <input type="text" required value={name} onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Ex: Residencial" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
        <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="residencial" />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
          placeholder="Breve descrição da categoria..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Ordem</label>
        <input
          type="number"
          value={orderIndex}
          onChange={(e) => { setOrderIndex(Number(e.target.value)); setOrderEdited(true) }}
          className="w-24 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          min={0}
        />
        {collision && (
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            A posição {orderIndex} já está sendo usada por <strong>&ldquo;{collision.name}&rdquo;</strong>.
            Ao salvar, &ldquo;{collision.name}&rdquo; será movida para a posição {orderIndex + 1}.
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : initial ? 'Salvar Alterações' : 'Criar Categoria'}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/categories')}>Cancelar</Button>
      </div>
    </form>
  )
}
