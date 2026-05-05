'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import LogoBrand from '@/components/LogoBrand'

const NAV_LINKS = [
  { href: '/#features', label: 'Funcionalidades' },
  { href: '/pricing', label: 'Preços' },
  { href: '/como-usar', label: 'Como usar' },
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
      {/* Backdrop — outside header so backdrop-blur doesn't trap fixed positioning */}
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

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-4 py-2 rounded-lg hover:bg-neutral-100">
              Entrar
            </Link>
            <Link href="/signup" className="text-sm px-5 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium">
              Começar grátis
            </Link>
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

        {/* Mobile menu panel — inside header so it stays below the bar */}
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
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
