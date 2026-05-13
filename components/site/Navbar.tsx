'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import LogoBrand from '@/components/LogoBrand'

type LogoSettings = {
  type: 'text' | 'image'
  name: string
  subname: string
  imageUrl: string
  logoFont?: string
  subnameAlign?: 'start' | 'center' | 'end'
}

export default function Navbar({
  logoSettings,
  tenantSlug,
}: {
  logoSettings?: LogoSettings
  tenantSlug: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const onSubdomain = !pathname.startsWith(`/${tenantSlug}`)
  const base = onSubdomain ? '' : `/${tenantSlug}`

  const links = [
    { href: `${base}/projetos`, label: 'Projetos' },
    { href: `${base}/#depoimentos`, label: 'Depoimentos' },
    { href: `${base}/#faq`, label: 'FAQ' },
  ]

  function handleLogoClick(e: React.MouseEvent) {
    setOpen(false)
    const homeHref = base || '/'
    if (pathname === homeHref || pathname === `${homeHref}/`) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={base || '/'} onClick={handleLogoClick}>
            <LogoBrand {...logoSettings} nameColor="var(--site-primary)" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {l.label}
              </a>
            ))}
            <a href={`${base}/#contato`}
              style={{ backgroundColor: 'var(--site-primary)' }}
              className="text-sm text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Contato
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="md:hidden relative z-10 p-3 -mr-3"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span style={{ backgroundColor: 'var(--site-primary)' }} className={`block h-0.5 transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span style={{ backgroundColor: 'var(--site-primary)' }} className={`block h-0.5 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
              <span style={{ backgroundColor: 'var(--site-primary)' }} className={`block h-0.5 transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <>
          <div className="md:hidden fixed inset-0 top-16 bg-neutral-900/30" onClick={() => setOpen(false)} />
          <div className="md:hidden relative bg-white border-b border-neutral-200 px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-3 text-sm text-neutral-700 hover:text-neutral-900 border-b border-neutral-100 last:border-0">
                {l.label}
              </a>
            ))}
            <a href={`${base}/#contato`} onClick={() => setOpen(false)}
              style={{ backgroundColor: 'var(--site-primary)' }}
              className="mt-2 text-center text-sm text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Contato
            </a>
          </div>
        </>
      )}
    </header>
  )
}
