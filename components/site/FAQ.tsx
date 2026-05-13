'use client'

import { useState } from 'react'

type FAQ = { id: string; question: string; answer: string }

export default function FAQ({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  if (!faqs.length) return null

  return (
    <section id="faq" className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--site-title)' }}>
          <span style={{ color: 'var(--site-primary)' }}>Perguntas</span> Frequentes
        </h2>
        <div className="space-y-3">
          {faqs.slice(0, 5).map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <button onClick={() => setOpen(open === f.id ? null : f.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="text-sm font-medium" style={{ color: 'var(--site-title)' }}>{f.question}</span>
                <span className="text-neutral-400 ml-4 shrink-0">{open === f.id ? '−' : '+'}</span>
              </button>
              {open === f.id && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-neutral-600 leading-relaxed">{f.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
