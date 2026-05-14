'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { saveTheme } from '../actions'
import type { Plan } from '@/lib/plans'

type ThemeValue = 1 | 2 | 3
type Themes = {
  hero: ThemeValue
  projects: ThemeValue
  cta: ThemeValue
  testimonials: ThemeValue
  faq: ThemeValue
  contact: ThemeValue
}

// ── Schematic previews ────────────────────────────────────────────────────────

function PreviewHero1() {
  return (
    <div className="w-full h-full flex gap-0.5">
      <div className="flex-1 bg-neutral-300 rounded-l relative overflow-hidden">
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="h-1 w-12 bg-white/80 rounded" />
          <div className="h-2 w-20 bg-white rounded" />
        </div>
      </div>
      <div className="w-1/4 flex flex-col gap-0.5">
        {[0,1,2].map(i => <div key={i} className="flex-1 bg-neutral-400 rounded-sm" />)}
      </div>
    </div>
  )
}
function PreviewHero2() {
  return (
    <div className="w-full h-full bg-neutral-400 rounded relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="h-2 w-16 bg-white rounded" />
        <div className="h-1 w-10 bg-white/60 rounded" />
      </div>
    </div>
  )
}
function PreviewHero3() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-3/5 bg-neutral-300 rounded-t" />
      <div className="h-2/5 bg-white rounded-b flex flex-col justify-center px-2 gap-1">
        <div className="h-2 w-14 bg-neutral-700 rounded" />
        <div className="h-1 w-8 bg-neutral-400 rounded" />
      </div>
    </div>
  )
}

function PreviewProjects1() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded" />
      <div className="flex gap-1 flex-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex-1 bg-neutral-200 rounded flex flex-col overflow-hidden">
            <div className="h-3/5 bg-neutral-300" />
            <div className="p-0.5 space-y-0.5">
              <div className="h-1 w-full bg-neutral-400 rounded" />
              <div className="h-0.5 w-2/3 bg-neutral-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewProjects2() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded" />
      <div className="flex gap-1 flex-1">
        <div className="flex-1 bg-neutral-300 rounded" />
        <div className="w-1/3 flex flex-col gap-1">
          <div className="flex-1 bg-neutral-200 rounded" />
          <div className="flex-1 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
}
function PreviewProjects3() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded" />
      {[0,1,2].map(i => (
        <div key={i} className="flex gap-1 items-center">
          <div className="w-5 h-4 bg-neutral-300 rounded shrink-0" />
          <div className="flex-1 space-y-0.5">
            <div className="h-1 w-full bg-neutral-400 rounded" />
            <div className="h-0.5 w-2/3 bg-neutral-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PreviewCTA1() {
  return (
    <div className="w-full h-full bg-neutral-800 rounded flex flex-col items-center justify-center gap-1 px-2">
      <div className="h-2 w-16 bg-white rounded" />
      <div className="h-1 w-12 bg-white/50 rounded" />
      <div className="mt-1 h-3 w-10 bg-white rounded-full" />
    </div>
  )
}
function PreviewCTA2() {
  return (
    <div className="w-full h-full bg-white rounded border border-neutral-200 flex flex-col items-center justify-center gap-1 px-2">
      <div className="h-2 w-16 bg-neutral-800 rounded" />
      <div className="h-1 w-12 bg-neutral-300 rounded" />
      <div className="mt-1 h-3 w-10 border border-neutral-800 rounded-full" />
    </div>
  )
}
function PreviewCTA3() {
  return (
    <div className="w-full h-full bg-neutral-900 rounded flex flex-col items-center justify-center gap-1 px-2">
      <div className="h-2 w-16 bg-white rounded" />
      <div className="h-1 w-12 bg-white/40 rounded" />
      <div className="mt-1 h-3 w-10 bg-neutral-600 rounded-full" />
    </div>
  )
}

function PreviewTestimonials1() {
  return (
    <div className="w-full h-full bg-neutral-100 rounded p-1 flex flex-col gap-1">
      <div className="h-1.5 w-12 bg-neutral-700 rounded mx-auto" />
      <div className="flex gap-1 flex-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex-1 bg-white rounded border border-neutral-200 p-0.5 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-neutral-300 rounded" />
              <div className="h-0.5 w-full bg-neutral-300 rounded" />
              <div className="h-0.5 w-2/3 bg-neutral-300 rounded" />
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-full bg-neutral-300" />
              <div className="h-0.5 w-6 bg-neutral-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewTestimonials2() {
  return (
    <div className="w-full h-full bg-neutral-900 rounded p-1 flex flex-col gap-1">
      <div className="h-1.5 w-12 bg-white rounded mx-auto" />
      <div className="flex gap-1 flex-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex-1 rounded p-0.5 flex flex-col justify-between">
            <div className="text-white/40 text-[8px] leading-none">"</div>
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-white/30 rounded" />
              <div className="h-0.5 w-2/3 bg-white/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function PreviewTestimonials3() {
  return (
    <div className="w-full h-full bg-neutral-50 rounded p-1 flex flex-col gap-1">
      <div className="h-1.5 w-12 bg-neutral-700 rounded mx-auto" />
      <div className="bg-white rounded border border-neutral-200 p-1 flex gap-1 items-center">
        <div className="w-4 h-4 rounded-full bg-neutral-300 shrink-0" />
        <div className="space-y-0.5 flex-1">
          <div className="h-0.5 w-full bg-neutral-300 rounded" />
          <div className="h-0.5 w-full bg-neutral-300 rounded" />
        </div>
      </div>
      <div className="flex gap-1 flex-1">
        {[0,1].map(i => (
          <div key={i} className="flex-1 bg-white rounded border border-neutral-200 p-0.5">
            <div className="h-0.5 w-full bg-neutral-300 rounded mb-0.5" />
            <div className="h-0.5 w-2/3 bg-neutral-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewFAQ1() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded mx-auto" />
      {[0,1,2].map(i => (
        <div key={i} className={`border border-neutral-200 rounded px-1 py-0.5 flex items-center justify-between bg-white${i === 0 ? ' flex-col items-stretch' : ''}`}>
          <div className="h-0.5 w-3/4 bg-neutral-400 rounded" />
          {i === 0 && <div className="h-0.5 w-full bg-neutral-200 rounded mt-0.5" />}
        </div>
      ))}
    </div>
  )
}
function PreviewFAQ2() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded mx-auto" />
      {[0,1,2].map(i => (
        <div key={i} className="border-b border-neutral-300 pb-0.5 flex items-center justify-between">
          <div className="h-0.5 w-3/4 bg-neutral-400 rounded" />
          <div className="w-1 h-1 rounded-sm bg-neutral-300" />
        </div>
      ))}
    </div>
  )
}
function PreviewFAQ3() {
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded mx-auto" />
      <div className="flex gap-1 flex-1">
        {[0,1].map(col => (
          <div key={col} className="flex-1 space-y-1">
            {[0,1].map(i => (
              <div key={i} className="space-y-0.5">
                <div className="h-0.5 w-full bg-neutral-500 rounded" />
                <div className="h-0.5 w-full bg-neutral-300 rounded" />
                <div className="h-0.5 w-2/3 bg-neutral-300 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewContact1() {
  return (
    <div className="w-full h-full bg-neutral-100 rounded flex flex-col items-center justify-center gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded" />
      <div className="flex gap-1 w-full">
        <div className="flex-1 h-3 border border-neutral-400 rounded" />
        <div className="flex-1 h-3 bg-neutral-800 rounded" />
      </div>
      {[0,1,2].map(i => <div key={i} className="w-full h-2 border border-neutral-300 rounded bg-white" />)}
      <div className="w-full h-3 bg-neutral-800 rounded" />
    </div>
  )
}
function PreviewContact2() {
  return (
    <div className="w-full h-full rounded flex overflow-hidden">
      <div className="w-2/5 bg-neutral-800 flex flex-col justify-center p-1 gap-1">
        <div className="h-1.5 w-full bg-white rounded" />
        <div className="h-0.5 w-full bg-white/40 rounded" />
        <div className="mt-1 h-2 w-full bg-white/20 rounded" />
        <div className="h-2 w-full bg-white/20 rounded" />
      </div>
      <div className="flex-1 bg-white flex flex-col justify-center p-1 gap-0.5">
        {[0,1,2].map(i => <div key={i} className="h-2 w-full border border-neutral-200 rounded" />)}
        <div className="h-2.5 w-full bg-neutral-800 rounded" />
      </div>
    </div>
  )
}
function PreviewContact3() {
  return (
    <div className="w-full h-full bg-white rounded flex flex-col items-center justify-center gap-1 p-1">
      <div className="h-1.5 w-10 bg-neutral-700 rounded" />
      <div className="flex gap-1 w-full">
        <div className="flex-1 h-2 border-b-2 border-neutral-400 bg-transparent" />
        <div className="flex-1 h-2 border-b-2 border-neutral-400 bg-transparent" />
      </div>
      <div className="w-full h-3 border-b-2 border-neutral-400 bg-transparent" />
      <div className="w-full h-5 border-b-2 border-neutral-400 bg-transparent" />
      <div className="w-1/2 h-3 bg-neutral-900 rounded-full" />
    </div>
  )
}

// ── Section config ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    key: 'hero' as const,
    label: 'Hero',
    description: 'Seção inicial com fotos em destaque',
    options: [
      { value: 1 as ThemeValue, label: 'Split', Preview: PreviewHero1 },
      { value: 2 as ThemeValue, label: 'Centralizado', Preview: PreviewHero2 },
      { value: 3 as ThemeValue, label: 'Minimalista', Preview: PreviewHero3 },
    ],
  },
  {
    key: 'projects' as const,
    label: 'Nossos Projetos',
    description: 'Grade de projetos por categoria',
    options: [
      { value: 1 as ThemeValue, label: 'Grade', Preview: PreviewProjects1 },
      { value: 2 as ThemeValue, label: 'Magazine', Preview: PreviewProjects2 },
      { value: 3 as ThemeValue, label: 'Lista', Preview: PreviewProjects3 },
    ],
  },
  {
    key: 'cta' as const,
    label: 'CTA',
    description: 'Seção "Transforme seu espaço"',
    options: [
      { value: 1 as ThemeValue, label: 'Sólido', Preview: PreviewCTA1 },
      { value: 2 as ThemeValue, label: 'Claro', Preview: PreviewCTA2 },
      { value: 3 as ThemeValue, label: 'Escuro', Preview: PreviewCTA3 },
    ],
  },
  {
    key: 'testimonials' as const,
    label: 'Depoimentos',
    description: 'O que dizem nossos clientes',
    options: [
      { value: 1 as ThemeValue, label: 'Cards', Preview: PreviewTestimonials1 },
      { value: 2 as ThemeValue, label: 'Escuro', Preview: PreviewTestimonials2 },
      { value: 3 as ThemeValue, label: 'Destaque', Preview: PreviewTestimonials3 },
    ],
  },
  {
    key: 'faq' as const,
    label: 'Perguntas Frequentes',
    description: 'Accordion de dúvidas comuns',
    options: [
      { value: 1 as ThemeValue, label: 'Accordion', Preview: PreviewFAQ1 },
      { value: 2 as ThemeValue, label: 'Linhas', Preview: PreviewFAQ2 },
      { value: 3 as ThemeValue, label: 'Aberto', Preview: PreviewFAQ3 },
    ],
  },
  {
    key: 'contact' as const,
    label: 'Contato',
    description: 'Formulário e links sociais',
    options: [
      { value: 1 as ThemeValue, label: 'Centralizado', Preview: PreviewContact1 },
      { value: 2 as ThemeValue, label: 'Dividido', Preview: PreviewContact2 },
      { value: 3 as ThemeValue, label: 'Minimalista', Preview: PreviewContact3 },
    ],
  },
]

// ── Upgrade modal ──────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 sm:p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mx-auto mb-4">
          <Lock size={20} className="text-neutral-700" />
        </div>
        <h2 className="text-base font-semibold text-neutral-900 mb-2">Plano necessário</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Para alterar os temas do site é necessário ter algum dos planos ativos.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/billing"
            className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-neutral-800 transition-colors"
            onClick={onClose}
          >
            Ver planos
          </Link>
          <button
            className="w-full text-sm text-neutral-500 hover:text-neutral-700 py-2 transition-colors"
            onClick={onClose}
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main client component ──────────────────────────────────────────────────────

export default function TemasClient({ plan, themes }: { plan: Plan; themes: Themes }) {
  const [current, setCurrent] = useState<Themes>(themes)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [, startTransition] = useTransition()

  const canEdit = plan === 'pro' || plan === 'agency'

  function handleSelect(section: keyof Themes, value: ThemeValue, locked: boolean) {
    if (locked) { setShowUpgrade(true); return }
    setCurrent((prev) => ({ ...prev, [section]: value }))
    startTransition(() => { saveTheme(section, String(value)) })
  }

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div className="space-y-6">
        {SECTIONS.map((section) => {
          const active = current[section.key]
          const ActivePreview = section.options.find(o => o.value === active)?.Preview ?? section.options[0].Preview

          return (
            <div key={section.key} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              {/* Large preview of active style */}
              <div className="aspect-[16/6] sm:aspect-[16/5] w-full bg-neutral-100 p-4 sm:p-6">
                <ActivePreview />
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{section.label}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{section.description}</p>
                  </div>
                </div>

                {/* 3 option thumbnails */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {section.options.map((opt) => {
                    const locked = !canEdit && opt.value !== 1
                    const selected = active === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(section.key, opt.value, locked)}
                        className={`group relative flex flex-col items-center gap-1.5 focus:outline-none`}
                      >
                        {/* Thumbnail frame */}
                        <div className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          selected
                            ? 'border-neutral-900 shadow-sm'
                            : 'border-neutral-200 hover:border-neutral-400'
                        } ${locked ? 'opacity-60' : ''}`}>
                          <opt.Preview />
                          {locked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                              <Lock size={14} className="text-neutral-600" />
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${selected ? 'text-neutral-900' : 'text-neutral-500'}`}>
                          {opt.label}
                        </span>
                        {selected && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-neutral-900 rounded-full flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
