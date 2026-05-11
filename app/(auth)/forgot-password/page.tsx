'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError('Não foi possível enviar o email. Tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white sm:bg-neutral-50 flex flex-col items-center justify-center px-6 sm:px-4 sm:py-8">
        <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5 text-2xl">✉️</div>
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900 mb-2">Verifique seu email</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Enviamos um link para <strong>{email}</strong>. Clique nele para redefinir sua senha.
          </p>
          <Link href="/login" className="text-sm text-neutral-900 font-medium hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white sm:bg-neutral-50 px-6 pt-16 pb-10 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-8">
      <div className="w-full sm:max-w-sm sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-neutral-200 sm:p-8">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-xl font-semibold text-neutral-900">Recuperar senha</h1>
          <p className="text-sm text-neutral-500 mt-1">Informe seu email e enviaremos um link para redefinir sua senha.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="voce@email.com"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-3 sm:py-2" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>
      </div>
    </div>
  )
}
