import Link from 'next/link'
import { formatDate, extractTiptapText, truncate } from '@/lib/utils'
import { getSiteBase } from '@/lib/tenant/site-base'

type Project = {
  id: string; title: string; slug: string; main_image: string; date: string; content?: unknown; created_at?: string
}
type Category = {
  id: string; name: string; slug: string; description: string; projects: Project[]
}

export default async function Features({ categories, tenantSlug, plan }: { categories: Category[]; tenantSlug: string; plan?: string }) {
  const base = await getSiteBase(tenantSlug)
  const visible = categories.slice(0, 2)

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
