'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Deletar o projeto "${title}"?`)) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2.5 sm:p-0 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 sm:hover:bg-transparent transition-colors"
      title="Deletar"
    >
      <Trash2 className="w-5 h-5 sm:hidden" />
      <span className="hidden sm:inline text-xs hover:underline">Deletar</span>
    </button>
  )
}
