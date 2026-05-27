import { Check } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Plano' }

const FEATURES = [
  'Projetos ilimitados',
  'Categorias ilimitadas',
  'Galeria de fotos ilimitada',
  'Analytics de visitas',
  'Equipe (até 3 usuários)',
  'Domínio customizado',
  'Depoimentos de clientes',
  'FAQs ilimitadas',
  'Temas e identidade visual',
  'WhatsApp e Instagram integrados',
  'SEO por projeto',
  'Suporte prioritário',
]

export default function BillingPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Plano</h1>
        <p className="text-sm text-neutral-500 mt-1">Todas as funcionalidades estão ativas.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-900 p-6 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Site Completo</p>
            <p className="text-xs text-neutral-400 mt-0.5">Pagamento único</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-900 text-white">
            Ativo
          </span>
        </div>

        <ul className="space-y-2.5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-neutral-700">
              <Check size={14} className="text-neutral-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
