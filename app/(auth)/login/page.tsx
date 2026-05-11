'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha inválidos.')
      setLoading(false)
      return
    }

    const next = searchParams.get('next')
    router.push(next ?? '/dashboard')
  }

  return (
    <div className="min-h-screen bg-white sm:bg-neutral-50 px-6 pt-16 pb-10 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-8">
      <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900">Entrar</h1>
          <p className="text-sm text-neutral-500 mt-1">Acesse seu painel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="voce@email.com" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Senha</label>
              <Link href="/forgot-password" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="••••••••" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-3 sm:py-2" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Não tem conta?{' '}
          <Link href="/signup" className="text-neutral-900 font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense><LoginPage /></Suspense>
}
