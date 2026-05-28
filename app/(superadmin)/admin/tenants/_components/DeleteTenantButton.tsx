'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTenant } from '../actions'

export default function DeleteTenantButton({ tenantId, tenantName }: { tenantId: string; tenantName: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Deletar "${tenantName}"? Essa ação não pode ser desfeita.`)) return
    setLoading(true)
    setError('')
    const result = await deleteTenant(tenantId)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Deletando...' : 'Deletar'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
