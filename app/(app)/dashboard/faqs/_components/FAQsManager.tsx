'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

type FAQ = { id: string; question: string; answer: string; order_index: number }

export default function FAQsManager({ initial }: { initial: FAQ[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editAnswer, setEditAnswer] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, order_index: items.length }),
    })
    const data = await res.json()
    if (res.ok) {
      setItems([...items, data])
      setQuestion(''); setAnswer('')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar esta FAQ?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    setItems(items.filter((i) => i.id !== id))
    router.refresh()
  }

  function startEdit(f: FAQ) {
    setEditingId(f.id)
    setEditQuestion(f.question)
    setEditAnswer(f.answer)
  }

  async function handleEditSave(id: string) {
    setEditSaving(true)
    const res = await fetch(`/api/admin/faqs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: editQuestion, answer: editAnswer }),
    })
    if (res.ok) {
      setItems(items.map((i) => i.id === id ? { ...i, question: editQuestion, answer: editAnswer } : i))
      setEditingId(null)
    }
    setEditSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-sm font-medium text-neutral-900 mb-4">Adicionar FAQ</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Pergunta</label>
            <input required value={question} onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Qual é o prazo médio de um projeto?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Resposta</label>
            <textarea required value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              placeholder="O prazo varia de acordo com..." />
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Adicionando...' : 'Adicionar'}</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        {items.length ? (
          <ul className="divide-y divide-neutral-100">
            {items.map((f) => (
              <li key={f.id} className="px-4 py-4 sm:px-6">
                {editingId === f.id ? (
                  <div className="space-y-3">
                    <input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                    <textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSave(f.id)} disabled={editSaving}
                        className="text-xs text-neutral-900 font-medium hover:underline disabled:opacity-50">
                        {editSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-neutral-400 hover:underline">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{f.question}</p>
                      <p className="text-sm text-neutral-600 mt-1">{f.answer}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <button onClick={() => startEdit(f)}
                        className="p-2.5 sm:p-0 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 sm:hover:bg-transparent transition-colors" title="Editar">
                        <Pencil className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">Editar</span>
                      </button>
                      <button onClick={() => handleDelete(f.id)}
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
          <p className="px-6 py-8 text-center text-sm text-neutral-400">Nenhuma FAQ ainda.</p>
        )}
      </div>
    </div>
  )
}
