import { getTenantBySlug } from '@/lib/tenant/resolver'
import { getSiteBase } from '@/lib/tenant/site-base'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate, extractTiptapText, truncate } from '@/lib/utils'
import Footer from '@/components/site/Footer'
import TrackPageView from '@/components/TrackPageView'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant: slug } = await params
  const tenant = await getTenantBySlug(slug)
  if (!tenant) return {}
  const companyName = tenant.name
  return {
    title: 'Projetos',
    description: `Conheça todos os projetos de ${companyName}.`,
  }
}

export default async function TenantProjetosPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const tenant = await getTenantBySlug(slug)
  if (!tenant) notFound()

  const admin = createAdminClient()
  const { data: categories } = await admin
    .from('categories')
    .select('id, name, slug, description, projects(id, title, slug, main_image, date, content, created_at)')
    .eq('tenant_id', tenant.id)
    .order('order_index', { ascending: true })

  const allCats = ((categories as any[]) ?? []).filter((c: any) => c.projects?.length > 0)
  const companyName = tenant.settings.find((r) => r.key === 'company_name')?.value ?? tenant.name

  const isFree = tenant.plan === 'starter'
  const cats = isFree ? allCats.slice(0, 2) : allCats
  const base = await getSiteBase(slug)

  return (
    <>
      <TrackPageView tenantId={tenant.id} />
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href={`${base}`} className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Projetos</span>
          </nav>
        </div>
      </div>

      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-[1000px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto flex-nowrap md:flex-wrap scrollbar-none">
          {cats.map((cat: any) => (
            <Link key={cat.id} href={`${base}/${cat.slug}`}
              className="text-xs px-3 py-1 rounded-full border border-[var(--site-primary)] text-[var(--site-primary)] hover:bg-[var(--site-primary)] hover:text-white transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <main className="py-10 md:py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center" style={{ color: 'var(--site-title)' }}>
            Todos os <span style={{ color: 'var(--site-primary)' }}>Projetos</span>
          </h1>
          <p className="text-neutral-500 text-center mb-10 md:mb-16">
            Explore o portfólio completo de projetos de {companyName}.
          </p>

          {cats.map((cat: any) => {
            const projects: any[] = [...(cat.projects ?? [])].sort((a: any, b: any) =>
              new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
            )
            const preview = projects.slice(0, 2)
            return (
              <section key={cat.id} id={`cat-${cat.slug}`} className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                  {projects[0] && (
                    <Link href={`${base}/${cat.slug}`} className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={projects[0].main_image} alt={projects[0].title}
                        className="w-20 h-20 rounded-xl object-cover hover:opacity-90 transition-opacity" />
                    </Link>
                  )}
                  <div>
                    <Link href={`${base}/${cat.slug}`} className="group inline-flex items-center gap-2">
                      <h2 className="text-2xl font-semibold group-hover:underline underline-offset-4" style={{ color: 'var(--site-title)' }}>{cat.name}</h2>
                      <span className="text-neutral-400 text-sm group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                    {cat.description && <p className="text-neutral-500 mt-1 text-sm">{truncate(cat.description, 140)}</p>}
                    <p className="text-xs text-neutral-400 mt-1">{projects.length} projeto{projects.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {preview.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {preview.map((p: any) => {
                        const excerpt = extractTiptapText(p.content, 110)
                        return (
                          <Link key={p.id} href={`${base}/${cat.slug}/${p.slug}`}
                            className="group block overflow-hidden rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
                            <div className="aspect-[4/3] overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.main_image} alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium mb-1" style={{ color: 'var(--site-title)' }}>{p.title}</h3>
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
              </section>
            )
          })}
        </div>
      </main>

      <Footer companyName={companyName} tenantSlug={slug} />

    </>
  )
}
