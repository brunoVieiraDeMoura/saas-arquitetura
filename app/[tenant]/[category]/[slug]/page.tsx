import { getTenantBySlug } from '@/lib/tenant/resolver'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/plans'
import type { Plan } from '@/lib/plans'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import Footer from '@/components/site/Footer'
import GalleryLightbox from '@/components/site/GalleryLightbox'
import ProjectContent from '@/components/site/ProjectContent'
import TrackPageView from '@/components/TrackPageView'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; category: string; slug: string }>
}): Promise<Metadata> {
  const { tenant: tenantSlug, slug } = await params
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) return {}
  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects')
    .select('title, meta_description, main_image, categories(name)')
    .eq('slug', slug)
    .eq('tenant_id', tenant.id)
    .single()
  if (!project) return {}
  const title = project.title
  const description = project.meta_description || `Projeto de ${(project.categories as any)?.name || 'arquitetura'}: ${title}`
  return {
    title,
    description,
    openGraph: {
      title, description, type: 'article',
      images: project.main_image ? [{ url: project.main_image, alt: title }] : [],
    },
  }
}

export default async function TenantProjectPage({
  params,
}: {
  params: Promise<{ tenant: string; category: string; slug: string }>
}) {
  const { tenant: tenantSlug, category: categorySlug, slug } = await params
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) notFound()

  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('tenant_id', tenant.id)
    .single()

  if (!project) notFound()

  const categoryName = (project.categories as any)?.name ?? ''
  const categorySlugResolved = (project.categories as any)?.slug ?? categorySlug
  const companyName = tenant.settings.find((r) => r.key === 'company_name')?.value ?? tenant.name

  const galleryLimit = PLANS[(tenant.plan as Plan) ?? 'starter'].galleryLimit
  const rawGallery: string[] = project.gallery ?? []
  const limitedGallery = galleryLimit === Infinity ? rawGallery : rawGallery.slice(0, galleryLimit)
  const galleryImages = limitedGallery.map((url: string, i: number) => ({
    url,
    alt: `${project.title} - foto ${i + 1}`,
  }))

  return (
    <>
      <TrackPageView tenantId={tenant.id} projectId={project.id} />
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href={`/${tenantSlug}`} className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${tenantSlug}/projetos`} className="hover:text-neutral-900 transition-colors">Projetos</Link>
            <span>/</span>
            <Link href={`/${tenantSlug}/${categorySlugResolved}`} className="hover:text-neutral-900 transition-colors">
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium truncate max-w-[200px]">{project.title}</span>
          </nav>
        </div>
      </div>

      <div className="relative h-[60vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.main_image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-[1000px] mx-auto">
          <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-2">{categoryName}</p>
          <h1 className="text-4xl font-bold text-white">{project.title}</h1>
          <p className="text-white/60 mt-2 text-sm">{formatDate(project.date)}</p>
        </div>
      </div>

      <article className="max-w-[1000px] mx-auto px-6 py-16">
        <ProjectContent content={project.content} />
        {galleryImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Galeria</h2>
            <GalleryLightbox images={galleryImages} />
          </div>
        )}
      </article>

      <Footer companyName={companyName} tenantSlug={tenantSlug} />
    </>
  )
}
