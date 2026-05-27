import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExternalLink, Palette, Phone } from 'lucide-react'
import CopyButton from './_components/CopyButton'
import SettingsForm from './_components/SettingsForm'
import CustomDomainForm from './_components/CustomDomainForm'
import Link from 'next/link'

const QUICK_ACTIONS = [
  {
    href:  '/dashboard/identidade',
    icon:  Palette,
    title: 'Identidade visual',
    desc:  'Logo, nome, tipografia',
  },
  {
    href:  '/dashboard/contact',
    icon:  Phone,
    title: 'Contato',
    desc:  'WhatsApp e Instagram',
  },
]

export default async function SettingsPage() {
  const { tenantId, tenantSlug } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin
    .from('tenants')
    .select('name, slug, custom_domain')
    .eq('id', tenantId)
    .single()

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'arquiteturaorganizada.com.br'
  const siteUrl = `${tenantSlug}.${rootDomain}`

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Configurações</h1>
        <p className="text-sm text-neutral-500 mt-1">Informações gerais da sua conta.</p>
      </div>

      {/* Site URL card */}
      <div className="bg-neutral-900 rounded-2xl p-6 mb-5">
        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest mb-2">Seu site</p>
        <p className="text-lg font-semibold text-white break-all">{siteUrl}</p>
        <div className="flex items-center gap-5 mt-4">
          <a
            href={`/${tenantSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white font-medium bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
          >
            <ExternalLink size={13} />
            Visitar site
          </a>
          <CopyButton text={`https://${siteUrl}`} />
        </div>
      </div>

      {/* Account details */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-5">Conta</h2>
        <SettingsForm
          initialSlug={tenantSlug}
          rootDomain={rootDomain}
        />
      </div>

      {/* Custom domain */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-1">Domínio customizado</h2>
        <p className="text-xs text-neutral-400 mb-5">Aponte seu domínio próprio para o seu site.</p>
        <CustomDomainForm initialDomain={tenant?.custom_domain ?? null} />
      </div>

      {/* Quick actions */}
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Acesso rápido</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-3 group-hover:bg-neutral-900 group-hover:text-white transition-colors text-neutral-600">
              <Icon size={15} />
            </div>
            <p className="text-sm font-medium text-neutral-900">{title}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
