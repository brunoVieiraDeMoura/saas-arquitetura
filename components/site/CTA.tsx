import { getSiteBase } from '@/lib/tenant/site-base'

export default async function CTA({ companyName = 'Arquitetura Organizada', tenantSlug }: { companyName?: string; tenantSlug: string }) {
  const base = await getSiteBase(tenantSlug)
  return (
    <section className="bg-neutral-900 py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Transforme seu espaço com a {companyName}
        </h2>
        <p className="text-neutral-400 mb-8 text-lg">
          Entre em contato e vamos criar juntos um projeto único para você.
        </p>
        <a href={`${base}/#contato`}
          className="inline-flex items-center bg-white text-neutral-900 px-8 py-4 rounded-full font-medium hover:bg-neutral-100 transition-colors">
          Fale Conosco →
        </a>
      </div>
    </section>
  )
}
