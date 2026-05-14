'use client'

import { useState } from 'react'

type FAQ = { id: string; question: string; answer: string }

type Props = { faqs: FAQ[]; theme?: number }

// ── Style 2: Lines ─────────────────────────────────────────────────────────

function FAQLines({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  return (
    <section id="faq" className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--site-title)' }}>
          <span style={{ color: 'var(--site-primary)' }}>Perguntas</span> Frequentes
        </h2>
        <div>
          {faqs.slice(0, 5).map((f) => (
            <div key={f.id} className="border-b border-neutral-200">
              <button onClick={() => setOpen(open === f.id ? null : f.id)}
                className="w-full flex items-center justify-between py-5 text-left gap-4">
                <span className="text-sm font-medium" style={{ color: 'var(--site-title)' }}>{f.question}</span>
                <span className="text-neutral-400 shrink-0 transition-transform duration-200"
                  style={{ transform: open === f.id ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {open === f.id && (
                <div className="pb-5">
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

// ── Style 3: Open (all visible) ────────────────────────────────────────────

function FAQOpen({ faqs }: { faqs: FAQ[] }) {
  return (
    <section id="faq" className="py-16 md:py-24 px-6 bg-neutral-50">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--site-title)' }}>
          <span style={{ color: 'var(--site-primary)' }}>Perguntas</span> Frequentes
        </h2>
        <div className="columns-1 sm:columns-2 gap-6">
          {faqs.slice(0, 6).map((f, i) => (
            <div key={f.id} className={`break-inside-avoid mb-6 bg-white rounded-xl border border-neutral-200 p-5 sm:p-6${i >= 5 ? ' sm:block hidden' : ''}`}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--site-title)' }}>{f.question}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Style 1 (default): Accordion cards ────────────────────────────────────

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
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

export default function FAQ({ faqs, theme = 1 }: Props) {
  if (!faqs.length) return null
  if (theme === 2) return <FAQLines faqs={faqs} />
  if (theme === 3) return <FAQOpen faqs={faqs} />
  return <FAQAccordion faqs={faqs} />
}
