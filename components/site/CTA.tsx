import { getSiteBase } from '@/lib/tenant/site-base'

type Props = { companyName?: string; tenantSlug: string; theme?: number }

export default async function CTA({ companyName = 'Arquitetura Organizada', tenantSlug, theme = 1 }: Props) {
  const base = await getSiteBase(tenantSlug)

  // ── Style 2: Light / minimal ──────────────────────────────────────────────
  if (theme === 2) {
    return (
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">Próximo passo</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--site-primary)' }}>
            Transforme seu espaço com a {companyName}
          </h2>
          <p className="text-neutral-500 mb-8 text-lg">
            Entre em contato e vamos criar juntos um projeto único para você.
          </p>
          <a href={`${base}/#contato`}
            style={{ borderColor: 'var(--site-primary)', color: 'var(--site-primary)' }}
            className="inline-flex items-center border-2 px-8 py-4 rounded-full font-medium hover:opacity-80 transition-opacity">
            Fale Conosco →
          </a>
        </div>
      </section>
    )
  }

  // ── Style 3: Dark ─────────────────────────────────────────────────────────
  if (theme === 3) {
    return (
      <section className="py-16 md:py-24 px-6 bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vamos criar algo extraordinário juntos
          </h2>
          <p className="text-neutral-400 mb-10 text-lg">
            Conte-nos sobre o seu projeto e daremos vida à sua visão.
          </p>
          <a href={`${base}/#contato`}
            className="inline-flex items-center gap-3 text-white font-medium text-lg group hover:opacity-80 transition-opacity">
            Fale Conosco
            <span className="w-8 h-px bg-white transition-all duration-300 group-hover:w-12" />
          </a>
        </div>
      </section>
    )
  }

  // ── Style 1 (default): Bold primary ──────────────────────────────────────
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
