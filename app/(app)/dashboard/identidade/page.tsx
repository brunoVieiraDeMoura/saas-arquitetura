import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import IdentidadePanel from '@/components/admin/IdentidadePanel'

export default async function IdentidadePage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: rows } = await admin
    .from('settings')
    .select('key, value')
    .eq('tenant_id', tenantId)
    .in('key', [
      'company_name', 'logo_type', 'logo_name', 'logo_subname',
      'logo_image_url', 'logo_font', 'logo_subname_align',
      'primary_color', 'secondary_color', 'title_color_mode',
    ])

  const get = (key: string, fallback = '') => rows?.find((r) => r.key === key)?.value ?? fallback

  const logoInitial = {
    companyName:  get('company_name', 'Arquitetura Organizada'),
    type:         (get('logo_type', 'text') as 'text' | 'image'),
    name:         get('logo_name', 'Arquitetura'),
    subname:      get('logo_subname', 'organizada'),
    imageUrl:     get('logo_image_url', ''),
    logoFont:     get('logo_font', ''),
    subnameAlign: (get('logo_subname_align', 'end') as 'start' | 'center' | 'end'),
  }

  const colorInitial = {
    primaryColor:     get('primary_color', '#000000'),
    secondaryColor:   get('secondary_color', '#FFFFFF'),
    titleColorMode:   (get('title_color_mode', 'dark') as 'primary' | 'gray' | 'dark'),
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Identidade</h1>
        <p className="text-sm text-neutral-500 mt-1">Nome da empresa, logo e cores do site.</p>
      </div>
      <IdentidadePanel logoInitial={logoInitial} colorInitial={colorInitial} />
    </div>
  )
}
