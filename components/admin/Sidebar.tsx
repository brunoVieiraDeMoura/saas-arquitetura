'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import LogoBrand from '@/components/LogoBrand'
import type { Plan } from '@/lib/plans'
import {
  LayoutDashboard, Palette, Tag, FolderKanban, MessageSquare,
  HelpCircle, Mail, CreditCard, Settings, LogOut, ExternalLink,
  BookOpen, BarChart2, Users, Lock, Paintbrush,
  type LucideIcon,
} from 'lucide-react'

type NavItem =
  | { separator: true }
  | { href: string; label: string; icon: LucideIcon; exact?: boolean; locked?: boolean }

function getNavItems(plan: Plan): NavItem[] {
  const locked = plan !== 'agency'
  return [
    { href: '/dashboard',              label: 'Visão Geral',  exact: true, icon: LayoutDashboard },
    { href: '/dashboard/identidade',   label: 'Identidade',               icon: Palette },
    { href: '/dashboard/categories',   label: 'Categorias',               icon: Tag },
    { href: '/dashboard/projects',     label: 'Projetos',                 icon: FolderKanban },
    { href: '/dashboard/testimonials', label: 'Depoimentos',              icon: MessageSquare },
    { href: '/dashboard/faqs',         label: 'FAQs',                     icon: HelpCircle },
    { href: '/dashboard/contact',      label: 'Contato',                  icon: Mail },
    { separator: true as const },
    { href: '/dashboard/temas',        label: 'Temas',                    icon: Paintbrush },
    { href: '/dashboard/analytics',    label: 'Analytics',                icon: BarChart2, locked },
    { href: '/dashboard/team',         label: 'Equipe',                   icon: Users,    locked },
    { separator: true as const },
    { href: '/dashboard/billing',      label: 'Plano',                    icon: CreditCard },
    { href: '/dashboard/settings',     label: 'Configurações',            icon: Settings },
    { href: '/dashboard/docs',         label: 'Documentação',             icon: BookOpen },
  ]
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mx-auto mb-4">
          <Lock size={22} className="text-neutral-700" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Recurso exclusivo Agency</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Analytics e Equipe estão disponíveis no plano Agency. Faça upgrade para desbloquear essas funcionalidades.
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

export default function Sidebar({ tenantSlug, plan }: { tenantSlug: string; plan: Plan }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState(false)

  const navItems = getNavItems(plan)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navContent = (onClose?: () => void) => (
    <>
      <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between shrink-0">
        <Link href="/dashboard" className="text-neutral-900"><LogoBrand /></Link>
        {onClose && (
          <button className="p-1 -mr-1 text-neutral-400 hover:text-neutral-700" onClick={onClose} aria-label="Fechar menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('separator' in item) return <hr key={i} className="my-2 border-neutral-200" />
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.locked) {
            return (
              <button
                key={item.href}
                onClick={() => { onClose?.(); setUpgradeModal(true) }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-100 transition-colors"
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                <Lock size={12} className="text-neutral-400" />
              </button>
            )
          }

          return (
            <Link key={item.href} href={item.href} onClick={() => onClose?.()}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
              )}>
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
        <a href={`/${tenantSlug}`} target="_blank"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors">
          <ExternalLink size={16} />
          Ver site
        </a>
      </nav>

      <div className="px-3 py-4 border-t border-neutral-200 shrink-0">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-end gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          Sair <LogOut size={16} />
        </button>
      </div>
    </>
  )

  return (
    <>
      {upgradeModal && <UpgradeModal onClose={() => setUpgradeModal(false)} />}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
        <Link href="/dashboard" className="text-neutral-900"><LogoBrand /></Link>
        <button className="p-2 -mr-2 flex flex-col gap-1.5" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <span className="block w-5 h-0.5 bg-neutral-900" />
          <span className="block w-5 h-0.5 bg-neutral-900" />
          <span className="block w-5 h-0.5 bg-neutral-900" />
        </button>
      </div>

      {open && <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

      <aside className={cn(
        'fixed top-0 right-0 z-50 h-[100dvh] w-64 bg-white flex flex-col transition-transform duration-200 md:hidden overflow-hidden',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        {navContent(() => setOpen(false))}
      </aside>

      <aside className="hidden md:flex w-60 shrink-0 border-r border-neutral-200 bg-white h-screen sticky top-0 flex-col">
        {navContent()}
      </aside>
    </>
  )
}
