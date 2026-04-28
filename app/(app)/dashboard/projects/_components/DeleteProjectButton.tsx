'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Deletar o projeto "${title}"?`)) return
    await supabase.from('projects').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 sm:p-0 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 sm:hover:bg-transparent transition-colors"
      title="Deletar"
    >
      <Trash2 className="w-4 h-4 sm:hidden" />
      <span className="hidden sm:inline text-xs hover:underline">Deletar</span>
    </button>
  )
}
