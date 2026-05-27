import { getTenantBySlug } from '@/lib/tenant/resolver'
import { getSiteBase } from '@/lib/tenant/site-base'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import Footer from '@/components/site/Footer'
import CategorySearch from '../_components/CategorySearch'
import TrackPageView from '@/components/TrackPageView'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; category: string }>
}): Promise<Metadata> {
  const { tenant: tenantSlug, category: categorySlug } = await params
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) return {}
  const admin = createAdminClient()
  const { data: category } = await admin
    .from('categories')
    .select('name, description')
    .eq('slug', categorySlug)
    .eq('tenant_id', tenant.id)
    .single()
  if (!category) return {}
  return {
    title: category.name,
    description: category.description || `Projetos de ${category.name}`,
  }
}

export default async function TenantCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string; category: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { tenant: tenantSlug, category: categorySlug } = await params
  const { q } = await searchParams
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) notFound()

  const admin = createAdminClient()
  const [{ data: category }, { data: allCategories }] = await Promise.all([
    admin
      .from('categories')
      .select('id, name, slug, description, projects(id, title, slug, main_image, date, created_at)')
      .eq('slug', categorySlug)
      .eq('tenant_id', tenant.id)
      .single(),
    admin
      .from('categories')
      .select('id, name, slug')
      .eq('tenant_id', tenant.id)
      .order('order_index', { ascending: true }),
  ])

  if (!category) notFound()

  const orderedCats = allCategories ?? []
  const catIndex = orderedCats.findIndex((c) => c.slug === categorySlug)
  void catIndex

  const allProjects: any[] = [...((category as any).projects ?? [])].sort((a, b) =>
    new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
  )
  const projects = q
    ? allProjects.filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()))
    : allProjects
  const otherCategories = orderedCats.filter((c) => c.slug !== categorySlug)
  const companyName = tenant.settings.find((r) => r.key === 'company_name')?.value ?? tenant.name
  const base = await getSiteBase(tenantSlug)

  return (
    <>
      <TrackPageView tenantId={tenant.id} />
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href={base || '/'} className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`${base}/projetos`} className="hover:text-neutral-900 transition-colors">Projetos</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {otherCategories.length > 0 && (
        <div className="bg-white border-b border-neutral-100">
          <div className="max-w-[1000px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto flex-nowrap md:flex-wrap scrollbar-none">
            <span className="text-xs text-neutral-400 shrink-0">Ver também:</span>
            {otherCategories.map((cat) => (
              <Link key={cat.id} href={`${base}/${cat.slug}`}
                className="text-xs px-3 py-1 rounded-full border border-[var(--site-primary)] text-[var(--site-primary)] hover:bg-[var(--site-primary)] hover:text-white transition-colors shrink-0">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--site-title)' }}>{category.name}</h1>
        {(category as any).description && (
          <p className="text-neutral-500 mt-3 text-base max-w-2xl">{(category as any).description}</p>
        )}
        <p className="text-sm text-neutral-400 mt-2">
          {projects.length} projeto{projects.length !== 1 ? 's' : ''}
          {q && visibleProjects.length !== projects.length && ` de ${visibleProjects.length}`}
        </p>
        <div className="mt-6 max-w-sm">
          <CategorySearch defaultValue={q ?? ''} />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 pb-24">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p: any) => (
              <Link key={p.id} href={`${base}/${categorySlug}/${p.slug}`}
                className="group block overflow-hidden rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.main_image} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h2 className="font-medium mb-1" style={{ color: 'var(--site-title)' }}>{p.title}</h2>
                  <p className="text-xs text-neutral-400">{formatDate(p.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg">Nenhum projeto nesta categoria ainda.</p>
            <Link href={`${base}/projetos`}
              className="mt-4 inline-block text-sm underline hover:text-neutral-900 transition-colors">
              Ver outras categorias
            </Link>
          </div>
        )}
      </div>

      <Footer companyName={companyName} tenantSlug={tenantSlug} />
    </>
  )
}
