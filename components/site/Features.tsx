import Link from 'next/link'
import { formatDate, extractTiptapText, truncate } from '@/lib/utils'
import { getSiteBase } from '@/lib/tenant/site-base'

type Project = {
  id: string; title: string; slug: string; main_image: string; date: string; content?: unknown; created_at?: string
}
type Category = {
  id: string; name: string; slug: string; description: string; projects: Project[]
}

type Props = { categories: Category[]; tenantSlug: string; plan?: string; theme?: number }

export default async function Features({ categories, tenantSlug, plan, theme = 1 }: Props) {
  const base = await getSiteBase(tenantSlug)
  const visible = categories.slice(0, 2)

  // ── Style 2: Magazine ──────────────────────────────────────────────────────
  if (theme === 2) {
    return (
      <section id="projetos" className="py-16 md:py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center" style={{ color: 'var(--site-title)' }}>
            Nossos <span style={{ color: 'var(--site-primary)' }}>Projetos</span>
          </h2>
          {visible.map((cat) => {
            const sorted = [...cat.projects].sort((a, b) =>
              new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
            )
            const [cover, ...rest] = sorted
            const small = rest.slice(0, 2)
            return (
              <div key={cat.id} className="mb-20">
                <div className="mb-6 flex items-center gap-3">
                  <Link href={`${base}/${cat.slug}`} className="group inline-flex items-center gap-2">
                    <h3 className="text-2xl font-semibold group-hover:underline underline-offset-4" style={{ color: 'var(--site-title)' }}>
                      {cat.name}
                    </h3>
                    <span className="text-neutral-400 text-sm group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                  {cat.description && (
                    <p className="text-neutral-400 text-sm hidden sm:block">— {truncate(cat.description, 60)}</p>
                  )}
                </div>

                {cover && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {/* Large feature card */}
                    <Link href={`${base}/${cat.slug}/${cover.slug}`}
                      className="md:col-span-3 group block overflow-hidden rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] md:aspect-auto md:h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cover.main_image} alt={cover.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-semibold mb-1" style={{ color: 'var(--site-title)' }}>{cover.title}</h4>
                        <p className="text-xs text-neutral-400 mb-3">{formatDate(cover.date)}</p>
                        {(() => { const excerpt = extractTiptapText(cover.content, 160); return excerpt ? (
                          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 hidden md:block">{excerpt}</p>
                        ) : null })()}
                      </div>
                    </Link>

                    {/* Two small cards stacked */}
                    <div className="md:col-span-2 flex flex-row md:flex-col gap-4">
                      {small.map((p) => (
                        <Link key={p.id} href={`${base}/${cat.slug}/${p.slug}`}
                          className="group flex-1 block overflow-hidden rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
                          <div className="aspect-[4/3] md:aspect-auto md:h-[88px] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.main_image} alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-2.5">
                            <h4 className="font-medium text-sm" style={{ color: 'var(--site-title)' }}>{p.title}</h4>
                            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(p.date)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Link href={`${base}/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-sm border border-[var(--site-primary)] text-[var(--site-primary)] px-4 py-2 rounded-lg hover:bg-[var(--site-primary)] hover:text-white transition-colors">
                    Ver todos de {cat.name} <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
          <div className="mt-4 flex justify-center">
            <Link href={`${base}/projetos`}
              className="inline-flex items-center gap-2 bg-[var(--site-primary)] text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              Exibir Todos os Projetos →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // ── Style 3: List ──────────────────────────────────────────────────────────
  if (theme === 3) {
    return (
      <section id="projetos" className="py-16 md:py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center" style={{ color: 'var(--site-title)' }}>
            Nossos <span style={{ color: 'var(--site-primary)' }}>Projetos</span>
          </h2>
          {visible.map((cat) => {
            const sorted = [...cat.projects].sort((a, b) =>
              new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
            )
            const projects = sorted.slice(0, 3)
            return (
              <div key={cat.id} className="mb-20">
                <div className="mb-6 flex items-center justify-between">
                  <Link href={`${base}/${cat.slug}`} className="group inline-flex items-center gap-2">
                    <h3 className="text-2xl font-semibold group-hover:underline underline-offset-4" style={{ color: 'var(--site-title)' }}>
                      {cat.name}
                    </h3>
                    <span className="text-neutral-400 text-sm group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                  <span className="text-xs text-neutral-400">{cat.projects.length} projeto{cat.projects.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="divide-y divide-neutral-100">
                  {projects.map((p) => {
                    const excerpt = extractTiptapText(p.content, 100)
                    return (
                      <Link key={p.id} href={`${base}/${cat.slug}/${p.slug}`}
                        className="group flex items-center gap-4 sm:gap-6 py-4 hover:bg-neutral-50 -mx-3 px-3 rounded-xl transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.main_image} alt={p.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 group-hover:opacity-90 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate" style={{ color: 'var(--site-title)' }}>{p.title}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5">{formatDate(p.date)}</p>
                          {excerpt && <p className="text-sm text-neutral-500 mt-1 line-clamp-1 hidden sm:block">{excerpt}</p>}
                        </div>
                        <span className="text-neutral-300 group-hover:text-neutral-600 transition-colors shrink-0">→</span>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link href={`${base}/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-sm border border-[var(--site-primary)] text-[var(--site-primary)] px-4 py-2 rounded-lg hover:bg-[var(--site-primary)] hover:text-white transition-colors">
                    Ver todos de {cat.name} <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
          <div className="mt-4 flex justify-center">
            <Link href={`${base}/projetos`}
              className="inline-flex items-center gap-2 bg-[var(--site-primary)] text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              Exibir Todos os Projetos →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // ── Style 1 (default): Grid ────────────────────────────────────────────────
  return (
    <section id="projetos" className="py-16 md:py-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-bold mb-16 text-center" style={{ color: 'var(--site-title)' }}>
          Nossos <span style={{ color: 'var(--site-primary)' }}>Projetos</span>
        </h2>
        {visible.map((cat) => {
          const sorted = [...cat.projects].sort((a, b) =>
            new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
          )
          const cover = sorted[0]
          const projects = sorted.slice(0, 3)
          return (
            <div key={cat.id} className="mb-20">
              <div className="mb-8 flex items-center gap-4">
                {cover && (
                  <Link href={`${base}/${cat.slug}`} className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover.main_image} alt={cover.title}
                      className="w-20 h-20 rounded-xl object-cover hover:opacity-90 transition-opacity" />
                  </Link>
                )}
                <div>
                  <Link href={`${base}/${cat.slug}`} className="group inline-flex items-center gap-2">
                    <h3 className="text-2xl font-semibold group-hover:underline underline-offset-4" style={{ color: 'var(--site-title)' }}>{cat.name}</h3>
                    <span className="text-neutral-400 text-sm group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                  {cat.description && (
                    <p className="text-neutral-500 mt-1 text-sm">{truncate(cat.description, 100)}</p>
                  )}
                  {cat.projects.length > 0 && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {cat.projects.length} projeto{cat.projects.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              {projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((p, pi) => {
                      const excerpt = extractTiptapText(p.content, 110)
                      return (
                        <Link key={p.id} href={`${base}/${cat.slug}/${p.slug}`}
                          className={`group block overflow-hidden rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow${pi >= 2 ? ' hidden md:block' : ''}`}>
                          <div className="aspect-video overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.main_image} alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium mb-1" style={{ color: 'var(--site-title)' }}>{p.title}</h4>
                            <p className="text-xs text-neutral-400 mb-2">{formatDate(p.date)}</p>
                            {excerpt && <p className="text-sm text-neutral-500 line-clamp-2">{excerpt}</p>}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Link href={`${base}/${cat.slug}`}
                      className="inline-flex items-center gap-2 text-sm border border-[var(--site-primary)] text-[var(--site-primary)] px-4 py-2 rounded-lg hover:bg-[var(--site-primary)] hover:text-white transition-colors">
                      Ver todos de {cat.name} <span className="text-xs">→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-400">Em breve.</p>
              )}
            </div>
          )
        })}
        <div className="mt-4 flex justify-center">
          <Link href={`${base}/projetos`}
            className="inline-flex items-center gap-2 bg-[var(--site-primary)] text-white text-sm font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
            Exibir Todos os Projetos →
          </Link>
        </div>
      </div>
    </section>
  )
}
