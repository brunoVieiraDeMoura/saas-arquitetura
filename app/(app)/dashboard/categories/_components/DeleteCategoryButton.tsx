'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Deletar a categoria "${name}"? Todos os projetos vinculados serão removidos.`)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
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
