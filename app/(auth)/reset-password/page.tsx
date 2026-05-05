'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [exchanging, setExchanging] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError('Link inválido ou expirado.')
      setExchanging(false)
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setError('Link inválido ou expirado.')
      setExchanging(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Não foi possível redefinir a senha. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (exchanging) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Verificando link...</p>
      </div>
    )
  }

  if (error && !password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <a href="/forgot-password" className="text-sm text-neutral-900 font-medium hover:underline">
            Solicitar novo link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">Nova senha</h1>
          <p className="text-sm text-neutral-500 mt-1">Escolha uma senha segura para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Nova senha</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700 mb-1">Confirmar senha</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Repita a senha"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense><ResetPasswordPage /></Suspense>
}
