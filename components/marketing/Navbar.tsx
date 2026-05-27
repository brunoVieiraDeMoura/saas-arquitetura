'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import LogoBrand from '@/components/LogoBrand'

const WA_URL = `https://wa.me/5521999433890?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento para o meu site de portfólio de arquitetura.')}`

const NAV_LINKS = [
  { href: '/#features', label: 'O que inclui' },
  { href: '/#pricing', label: 'Preços' },
]

export default function MarketingNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function handleLogoClick(e: React.MouseEvent) {
    setOpen(false)
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {open && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-neutral-900" onClick={handleLogoClick}>
            <LogoBrand name="Arquitetura" subname="organizada" subnameAlign="end" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-neutral-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-5 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium"
            >
              Solicitar orçamento
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 border-b border-neutral-100 last:border-0 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Solicitar orçamento
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
