import { getTenantBySlug } from '@/lib/tenant/resolver'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Hero from '@/components/site/Hero'
import Features from '@/components/site/Features'
import CTA from '@/components/site/CTA'
import Testimonials from '@/components/site/Testimonials'
import Contact from '@/components/site/Contact'
import FAQ from '@/components/site/FAQ'
import Footer from '@/components/site/Footer'
import ScrollReveal from '@/components/ScrollReveal'
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
    title: companyName,
    description: `Portfólio de projetos de ${companyName}`,
  }
}

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const tenant = await getTenantBySlug(slug)
  if (!tenant) notFound()

  const admin = createAdminClient()
  const get = (key: string, fallback = '') =>
    tenant.settings.find((r) => r.key === key)?.value ?? fallback

  const [
    { data: featuredProjects },
    { data: categories },
    { data: testimonials },
    { data: faqs },
  ] = await Promise.all([
    admin
      .from('projects')
      .select('id, title, slug, main_image, date, categories(name, slug)')
      .eq('tenant_id', tenant.id)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6),
    admin
      .from('categories')
      .select('id, name, slug, description, projects(id, title, slug, main_image, date, content)')
      .eq('tenant_id', tenant.id)
      .order('order_index', { ascending: true }),
    admin
      .from('testimonials')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false }),
    admin
      .from('faqs')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('order_index', { ascending: true }),
  ])

  const companyName = get('company_name', tenant.name)

  const logoSettings = {
    type: (get('logo_type', 'text') as 'text' | 'image'),
    name: get('logo_name', 'Arquitetura'),
    subname: get('logo_subname', 'organizada'),
    imageUrl: get('logo_image_url', ''),
    logoFont: get('logo_font', ''),
    subnameAlign: (get('logo_subname_align', 'end') as 'start' | 'center' | 'end'),
  }

  return (
    <>
      <TrackPageView tenantId={tenant.id} />
      <ScrollReveal />
      <Hero projects={(featuredProjects as any) ?? []} tenantSlug={slug} />
      <div data-reveal><Features categories={(categories as any) ?? []} tenantSlug={slug} /></div>
      <div data-reveal><CTA companyName={companyName} tenantSlug={slug} /></div>
      <div data-reveal><Testimonials testimonials={testimonials ?? []} /></div>
      <div data-reveal><FAQ faqs={faqs ?? []} /></div>
      <div data-reveal>
        <Contact
          whatsappNumber={get('whatsapp_number', '5511999999999')}
          whatsappMessage={get('whatsapp_message', `Olá! Gostaria de saber mais sobre os projetos de ${companyName}.`)}
          instagramPath={get('instagram_path', '')}
          tenantSlug={slug}
        />
      </div>
      <Footer companyName={companyName} tenantSlug={slug} logoSettings={logoSettings} />
    </>
  )
}
