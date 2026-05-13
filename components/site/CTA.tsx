import { getSiteBase } from '@/lib/tenant/site-base'

export default async function CTA({ companyName = 'Arquitetura Organizada', tenantSlug }: { companyName?: string; tenantSlug: string }) {
  const base = await getSiteBase(tenantSlug)
  return (
    <section style={{ backgroundColor: 'var(--site-primary)' }} className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Transforme seu espaço com a {companyName}
        </h2>
        <p className="text-white/60 mb-8 text-lg">
          Entre em contato e vamos criar juntos um projeto único para você.
        </p>
        <a href={`${base}/#contato`}
          style={{ backgroundColor: 'var(--site-secondary)', color: 'var(--site-primary)' }}
          className="inline-flex items-center px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity">
          Fale Conosco →
        </a>
      </div>
    </section>
  )
}
