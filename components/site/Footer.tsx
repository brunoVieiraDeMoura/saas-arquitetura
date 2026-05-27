import LogoBrand from '@/components/LogoBrand'
import { getSiteBase } from '@/lib/tenant/site-base'

type LogoSettings = {
  type: 'text' | 'image'
  name: string
  subname: string
  imageUrl: string
  logoFont: string
  subnameAlign: 'start' | 'center' | 'end'
}

export default async function Footer({
  companyName = 'Arquitetura Organizada',
  tenantSlug,
  logoSettings,
}: {
  companyName?: string
  tenantSlug: string
  logoSettings?: LogoSettings
}) {
  const base = await getSiteBase(tenantSlug)
  return (
    <footer style={{ backgroundColor: 'var(--site-primary)' }} className="text-white py-12 px-6">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href={base || '/'} className="text-center md:text-left hover:opacity-80 transition-opacity">
          {logoSettings ? (
            <LogoBrand {...logoSettings} />
          ) : (
            <p className="font-semibold text-sm tracking-wide uppercase mb-1">{companyName}</p>
          )}
          <p className="text-xs text-white/60 mt-2">Design de interiores e arquitetura</p>
        </a>

        <div className="flex items-center gap-6">
          <a href={`${base}/projetos`} className="text-xs text-white/60 hover:text-white transition-colors">Projetos</a>
          <a href={`${base}/#contato`} className="text-xs text-white/60 hover:text-white transition-colors">Contato</a>
          <a href={`${base}/#faq`} className="text-xs text-white/60 hover:text-white transition-colors">FAQ</a>
          <a href="/dashboard" className="text-xs text-white/40 hover:text-white/70 transition-colors">Dash</a>
        </div>

        <p className="text-xs text-white/40 text-center md:text-left">
          © {new Date().getFullYear()} {companyName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
