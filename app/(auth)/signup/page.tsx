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
  const [agreed, setAgreed] = useState(false)
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
      <div className="min-h-screen bg-white sm:bg-neutral-50 flex flex-col items-center justify-center px-6 sm:px-4 sm:py-8">
        <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5 text-2xl">✉️</div>
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900 mb-2">Confirme seu email</h1>
          <p className="text-sm text-neutral-500 mb-8">Enviamos um link para <strong>{email}</strong>. Clique nele para ativar sua conta e acessar o painel.</p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white sm:bg-neutral-50 px-6 pt-16 pb-10 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-8">
      <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900">Criar conta</h1>
          <p className="text-sm text-neutral-500 mt-1">Comece gratuitamente, sem cartão</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Nome</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Seu nome" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="voce@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">Senha</label>
            <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Mínimo 8 caracteres" />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
            />
            <span className="text-xs text-neutral-500 leading-relaxed">
              Li e concordo com os{' '}
              <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline underline-offset-2">
                Termos e Condições
              </a>{' '}
              e com a{' '}
              <a href="/return-policy" target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline underline-offset-2">
                Política de Reembolso
              </a>
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-3 sm:py-2" disabled={loading || !agreed}>
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
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
