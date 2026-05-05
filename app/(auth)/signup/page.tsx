'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/dashboard/billing')
    })
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const plan = searchParams.get('plan')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push(plan ? `/onboarding?plan=${plan}` : '/onboarding')
    } else {
      // email confirmation required — session not yet established
      setConfirmed(true)
      setLoading(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">Confirme seu email</h1>
          <p className="text-sm text-neutral-500 mb-6">Enviamos um link para <strong>{email}</strong>. Clique nele para ativar sua conta e acessar o painel.</p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">Criar conta</h1>
          <p className="text-sm text-neutral-500 mt-1">Comece gratuitamente, sem cartão</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Seu nome" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="voce@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">Senha</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Mínimo 8 caracteres" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-neutral-900 font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense><SignupPage /></Suspense>
}
