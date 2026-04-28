'use client'

import { useState, useTransition } from 'react'
import { updateCustomDomain } from '../actions'
import { ExternalLink, Info } from 'lucide-react'

interface Props {
  initialDomain: string | null
}

export default function CustomDomainForm({ initialDomain }: Props) {
  const [domain, setDomain] = useState(initialDomain ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(initialDomain)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const fd = new FormData()
    fd.append('domain', domain)

    startTransition(async () => {
      const res = await updateCustomDomain(fd)
      if (res.error) {
        setError(res.error)
      } else if (res.removed) {
        setSaved(null)
        setDomain('')
      } else if (res.domain) {
        setSaved(res.domain)
      }
    })
  }

  const dirty = domain !== (initialDomain ?? '')

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Você pode comprar um domínio em registradoras como{' '}
          <a href="https://registro.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Registro.br</a>,{' '}
          <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">GoDaddy</a> ou{' '}
          <a href="https://www.hostinger.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Hostinger</a>{' '}
          e depois vincular o DNS aqui. Basta apontar um registro CNAME para o endereço da plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-neutral-400 mb-1.5">Domínio customizado</label>
          <input
            type="text"
            value={domain}
            onChange={e => { setDomain(e.target.value.toLowerCase().trim()); setError(null) }}
            className="w-full text-sm font-medium text-neutral-800 border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition"
            placeholder="meuescritorio.com.br"
          />
          <p className="text-[11px] text-neutral-400 mt-1.5">
            Deixe em branco para remover.
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending || !dirty}
          className="text-sm font-medium px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Salvando…' : saved && domain === '' ? 'Remover domínio' : 'Salvar domínio'}
        </button>
      </form>

      {saved && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-700">Domínio salvo</p>
            <a
              href={`https://${saved}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
            >
              <ExternalLink size={11} /> {saved}
            </a>
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-600 mb-2">Configure o DNS no seu provedor:</p>
            <div className="bg-neutral-900 rounded-lg px-4 py-3 font-mono text-xs text-white space-y-1.5">
              <div className="flex gap-4">
                <span className="text-neutral-400 w-12 shrink-0">Tipo</span>
                <span className="text-neutral-400 w-8 shrink-0">Nome</span>
                <span className="text-neutral-400">Valor</span>
              </div>
              <div className="flex gap-4 text-emerald-400">
                <span className="w-12 shrink-0">CNAME</span>
                <span className="w-8 shrink-0">@</span>
                <span>cname.vercel-dns.com</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400">
            Após configurar o DNS, pode levar até 48h para propagar. SSL é provisionado automaticamente pela Vercel.
          </p>
        </div>
      )}
    </div>
  )
}
