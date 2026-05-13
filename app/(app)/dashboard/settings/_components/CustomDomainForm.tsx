'use client'

import { useState, useTransition } from 'react'
import { updateCustomDomain } from '../actions'
import { ExternalLink, Info, Copy, Check } from 'lucide-react'

interface Props {
  initialDomain: string | null
}

type Registrar = 'hostinger' | 'godaddy' | 'registro' | 'cloudflare' | 'namecheap' | 'kinghost'

const REGISTRARS: { id: Registrar; label: string; fields: { campo: string; valor: string; highlight?: boolean; note?: string }[] }[] = [
  {
    id: 'hostinger',
    label: 'Hostinger',
    fields: [
      { campo: 'Type', valor: 'A', highlight: true },
      { campo: 'Name', valor: '@' },
      { campo: 'Content', valor: '76.76.21.21' },
      { campo: 'TTL', valor: '3600' },
    ],
  },
  {
    id: 'godaddy',
    label: 'GoDaddy',
    fields: [
      { campo: 'Type', valor: 'A', highlight: true },
      { campo: 'Host', valor: '@' },
      { campo: 'Points To', valor: '76.76.21.21' },
      { campo: 'TTL', valor: '3600' },
    ],
  },
  {
    id: 'registro',
    label: 'Registro.br',
    fields: [
      { campo: 'Tipo', valor: 'A', highlight: true },
      { campo: 'Nome', valor: '@' },
      { campo: 'Dados', valor: '76.76.21.21' },
      { campo: 'TTL', valor: '3600' },
    ],
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare',
    fields: [
      { campo: 'Type', valor: 'A', highlight: true },
      { campo: 'Name', valor: '@' },
      { campo: 'IPv4 address', valor: '76.76.21.21' },
      { campo: 'Proxy status', valor: 'DNS only', note: 'nuvem laranja desativada' },
      { campo: 'TTL', valor: 'Auto' },
    ],
  },
  {
    id: 'namecheap',
    label: 'Namecheap',
    fields: [
      { campo: 'Type', valor: 'A Record', highlight: true },
      { campo: 'Host', valor: '@' },
      { campo: 'Value', valor: '76.76.21.21' },
      { campo: 'TTL', valor: 'Automatic' },
    ],
  },
  {
    id: 'kinghost',
    label: 'KingHost',
    fields: [
      { campo: 'Tipo', valor: 'A', highlight: true },
      { campo: 'Nome', valor: '@' },
      { campo: 'Valor', valor: '76.76.21.21' },
      { campo: 'TTL', valor: '3600' },
    ],
  },
]

export default function CustomDomainForm({ initialDomain }: Props) {
  const [domain, setDomain] = useState(initialDomain ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(initialDomain)
  const [isPending, startTransition] = useTransition()
  const [registrar, setRegistrar] = useState<Registrar>('hostinger')

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
  const active = REGISTRARS.find(r => r.id === registrar)!
  const [copied, setCopied] = useState<string | null>(null)

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Você pode comprar um domínio em registradoras como{' '}
          <a href="https://registro.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Registro.br</a>,{' '}
          <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">GoDaddy</a> ou{' '}
          <a href="https://www.hostinger.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Hostinger</a> ou{' '}
          <a href="https://www.kinghost.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">KingHost</a>{' '}
          e depois vincular o DNS aqui. Adicione um registro A apontando para o IP da plataforma.
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

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
        {saved && (
          <div className="flex items-center justify-between pb-1">
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
        )}

        <div>
          <p className="text-xs font-medium text-neutral-600 mb-2">Configure o DNS no seu provedor antes de salvar:</p>

          <div className="flex gap-1 mb-2 flex-wrap">
            {REGISTRARS.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegistrar(r.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  registrar === r.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-200 text-xs font-mono">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="text-left px-3 py-2 text-neutral-500 font-medium border-b border-neutral-200">Campo</th>
                  <th className="text-left px-3 py-2 text-neutral-500 font-medium border-b border-neutral-200">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {active.fields.map(f => {
                  const key = `${registrar}-${f.campo}`
                  const isCopied = copied === key
                  return (
                    <tr key={f.campo}>
                      <td className="px-3 py-2 text-neutral-500">{f.campo}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className={f.highlight ? 'text-emerald-700 font-semibold' : 'text-neutral-800'}>
                              {f.valor}
                            </span>
                            {f.note && <span className="ml-1.5 text-neutral-400">({f.note})</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => copy(f.valor, key)}
                            className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors"
                            title="Copiar"
                          >
                            {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-neutral-400">
          Após configurar o DNS, pode levar até 48h para propagar. SSL é provisionado automaticamente.
        </p>
      </div>
    </div>
  )
}
