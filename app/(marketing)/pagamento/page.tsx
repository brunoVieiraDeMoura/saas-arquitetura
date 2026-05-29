import { Check, ShieldCheck, Lock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento | Arquitetura Organizada',
  description: 'Finalize sua compra com segurança.',
  robots: { index: false, follow: false },
}

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

export default function PagamentoPage() {
  return (
    <section className="min-h-screen py-24 px-6 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
            <Lock size={12} />
            <span>Pagamento seguro</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Finalize sua compra
          </h1>
          <p className="text-neutral-500 text-lg">
            Pagamento processado com segurança pelo Mercado Pago.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Completo */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 text-white p-8 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
                Mais solicitado
              </span>
            </div>

            <h2 className="text-lg font-semibold text-white mb-1">Site Completo</h2>
            <p className="text-sm text-white/60 mb-6">Pagamento único · Sem mensalidade</p>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-sm text-white/60 mb-1">R$</span>
                <span className="text-5xl font-bold text-white">2.500</span>
              </div>
              <p className="text-xs text-white/50 mt-1">
                ou <strong className="text-white/70">6x de R$ 416,67</strong> sem juros
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {SITE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="text-white/60 mt-0.5 shrink-0" />
                  <span className="text-white/90">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://mpago.li/26QzuDb"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3.5 rounded-xl text-sm font-semibold bg-white text-neutral-900 hover:bg-neutral-100 active:scale-95 transition-all"
            >
              Comprar agora
            </a>
          </div>

          {/* Manutenção */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col shadow-sm">
            <div className="mb-4 h-7" />

            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Manutenção Exclusiva</h2>
            <p className="text-sm text-neutral-400 mb-6">Renovação anual · Suporte 24h</p>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-sm text-neutral-400 mb-1">R$</span>
                <span className="text-5xl font-bold text-neutral-900">400</span>
                <span className="text-sm text-neutral-400 mb-1">/ano</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                ou <strong className="text-neutral-600">12x de R$ 33,33</strong> sem juros
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {MANUTENCAO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  <span className="text-neutral-700">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://mpago.li/1qT42MJ"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all"
            >
              Assinar agora
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 text-xs text-neutral-400">
          <ShieldCheck size={14} />
          <span>Pagamento 100% seguro via Mercado Pago · Seus dados estão protegidos</span>
        </div>
      </div>
    </section>
  )
}
