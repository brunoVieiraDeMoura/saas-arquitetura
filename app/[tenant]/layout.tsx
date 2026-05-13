import { getTenantBySlug } from '@/lib/tenant/resolver'
import { notFound } from 'next/navigation'
import Navbar from '@/components/site/Navbar'
import WhatsAppFloat from '@/components/site/WhatsAppFloat'
import type { CSSProperties } from 'react'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant: slug } = await params
  const tenant = await getTenantBySlug(slug)
  if (!tenant) notFound()

  const settings = tenant.settings ?? []
  const get = (key: string, fallback = '') => settings.find((r: any) => r.key === key)?.value ?? fallback

  const logoSettings = {
    type: (get('logo_type', 'text') as 'text' | 'image'),
    name: get('logo_name', 'Arquitetura'),
    subname: get('logo_subname', 'organizada'),
    imageUrl: get('logo_image_url', ''),
    logoFont: get('logo_font', ''),
    subnameAlign: (get('logo_subname_align', 'end') as 'start' | 'center' | 'end'),
  }

  const whatsappFloating = get('whatsapp_floating') === 'true'
  const whatsappNumber   = get('whatsapp_number', '')
  const whatsappMessage  = get('whatsapp_message', '')

  const primaryColor   = get('primary_color', '#1E1E1E')
  const secondaryColor = get('secondary_color', '#FFFFFF')

  const cssVars = {
    '--site-primary':   primaryColor,
    '--site-secondary': secondaryColor,
  } as CSSProperties

  return (
    <div style={cssVars}>
      <Navbar logoSettings={logoSettings} tenantSlug={slug} />
      <div className="pt-16">{children}</div>
      {whatsappFloating && whatsappNumber && (
        <WhatsAppFloat number={whatsappNumber} message={whatsappMessage} />
      )}
    </div>
  )
}
