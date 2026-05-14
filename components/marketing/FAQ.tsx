'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Posso usar sem cartão de crédito?',
    a: 'Sim! O plano Starter é gratuito para sempre. Você só precisa de um cartão quando quiser fazer upgrade para Pro ou Agency.',
  },
  {
    q: 'Meu site fica no meu próprio domínio?',
    a: 'No plano Starter, você recebe um subdomínio (seu-escritorio.arquiteturaorganizada.com.br). No plano Pro, você pode conectar seu domínio customizado.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, sem multas ou burocracia. Você pode cancelar sua assinatura a qualquer momento pelo painel de cobrança.',
  },
  {
    q: 'Quantos projetos posso criar?',
    a: 'No plano Starter: até 6 projetos em 2 categorias. No plano Pro e Agency: projetos e categorias ilimitados.',
  },
  {
    q: 'Como é feito o suporte?',
    a: 'Por email para todos os planos. O plano Pro tem suporte prioritário e o Agency tem atendimento dedicado.',
  },
]

export default function MarketingFAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-12">Perguntas frequentes</h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                {f.q}
                <span className="text-neutral-400 ml-4 shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-sm text-neutral-600 leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
