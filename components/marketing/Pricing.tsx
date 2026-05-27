'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

const SITE_FEATURES = [
  'Site completo configurado do zero',
  'Fotos organizadas por categoria',
  'Descrição e SEO de cada projeto',
  'Link próprio (seu-nome.arquiteturaorganizada.com.br)',
  'Design responsivo (mobile, tablet, desktop)',
  'Depoimentos de clientes',
  'Botão WhatsApp integrado',
  'Painel de acesso para o cliente',
  '3 manutenções anuais inclusas',
  'Entrega em até 3 dias úteis',
]

const MANUTENCAO_FEATURES = [
  'Adição de projetos e fotos a qualquer momento',
  'Ajustes de design e conteúdo',
  'Suporte prioritário por WhatsApp',
  'Atendimento em até 24h',
  'Renovação anual',
]

export default function MarketingPricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">Investimento</p>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Preço único, sem surpresas</h2>
          <p className="text-neutral-500 text-lg">Pagamento único para criar seu site. Manutenção exclusiva opcional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Completo */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 text-white p-8 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
                Mais solicitado
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">Site Completo</h3>
            <p className="text-sm text-white/60 mb-6">Pagamento único · Sem mensalidade</p>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-sm text-white/60 mb-1">R$</span>
                <span className="text-5xl font-bold text-white">2.500</span>
              </div>
              <p className="text-xs text-white/50 mt-1">pagamento único</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {SITE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="text-white/60 mt-0.5 shrink-0" />
                  <span className="text-white/90">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/#contact"
              className="block text-center py-3 rounded-xl text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              Solicitar orçamento
            </Link>
          </div>

          {/* Manutenção */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col">
            <div className="mb-4 h-7" />

            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Manutenção Exclusiva</h3>
            <p className="text-sm text-neutral-400 mb-6">Renovação anual · Suporte 24h</p>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-sm text-neutral-400 mb-1">R$</span>
                <span className="text-5xl font-bold text-neutral-900">400</span>
                <span className="text-sm text-neutral-400 mb-1">/ano</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">cobrado anualmente</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {MANUTENCAO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  <span className="text-neutral-700">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/#contact"
              className="block text-center py-3 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              Contratar manutenção
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-8">
          Dúvidas sobre o que está incluso?{' '}
          <Link href="/#contact" className="underline hover:text-neutral-600 transition-colors">
            Fale comigo
          </Link>
        </p>
      </div>
    </section>
  )
}
