'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/admin/ImageUpload'
import { Pencil, Trash2 } from 'lucide-react'

type Testimonial = { id: string; author: string; role: string; content: string; avatar: string | null }

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [author, setAuthor] = useState('')
  const [role, setRole] = useState('')
  const [content, setContent] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAuthor, setEditAuthor] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  function startEdit(t: Testimonial) {
    setEditingId(t.id)
    setEditAuthor(t.author)
    setEditRole(t.role)
    setEditContent(t.content)
    setEditAvatar(t.avatar ?? '')
  }

  async function handleEditSave(id: string) {
    setEditSaving(true)
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: editAuthor, role: editRole, content: editContent, avatar: editAvatar || null }),
    })
    const data = await res.json()
    if (res.ok) setItems(items.map((i) => i.id === id ? data : i))
    setEditingId(null)
    setEditSaving(false)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, role, content, avatar: avatar || null }),
    })
    const data = await res.json()
    if (res.ok) {
      setItems([data, ...items])
      setAuthor(''); setRole(''); setContent(''); setAvatar('')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar depoimento?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setItems(items.filter((i) => i.id !== id))
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-sm font-medium text-neutral-900 mb-4">Adicionar Depoimento</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
              <input required value={author} onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Maria Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Cargo / Empresa</label>
              <input value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="CEO, Empresa X" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Depoimento</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              placeholder="O trabalho foi incrível..." />
          </div>
          <div className="max-w-xs">
            <ImageUpload value={avatar} onChange={setAvatar} bucket="categories" label="Foto do Cliente (opcional)" />
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Adicionando...' : 'Adicionar'}</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        {items.length ? (
          <ul className="divide-y divide-neutral-100">
            {items.map((t) => (
              <li key={t.id} className="px-4 py-4 sm:px-6">
                {editingId === t.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)}
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Nome" />
                      <input value={editRole} onChange={(e) => setEditRole(e.target.value)}
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Cargo / Empresa" />
                    </div>
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" />
                    <div className="max-w-xs">
                      <ImageUpload value={editAvatar} onChange={setEditAvatar} bucket="categories" label="Foto (opcional)" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSave(t.id)} disabled={editSaving}
                        className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-lg hover:bg-neutral-800 disabled:opacity-60">
                        {editSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-700">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {t.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 text-sm font-medium text-neutral-500">
                          {t.author.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{t.author}</p>
                        {t.role && <p className="text-xs text-neutral-400">{t.role}</p>}
                        <p className="text-sm text-neutral-600 mt-1">{t.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <button onClick={() => startEdit(t)}
                        className="p-2.5 sm:p-0 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 sm:hover:bg-transparent transition-colors" title="Editar">
                        <Pencil className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">Editar</span>
                      </button>
                      <button onClick={() => handleDelete(t.id)}
                        className="p-2.5 sm:p-0 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 sm:hover:bg-transparent transition-colors" title="Deletar">
                        <Trash2 className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">Deletar</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-center text-sm text-neutral-400">Nenhum depoimento ainda.</p>
        )}
      </div>
    </div>
  )
}
