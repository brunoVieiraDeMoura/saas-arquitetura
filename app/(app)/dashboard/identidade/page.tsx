import { createClient } from '@/lib/supabase/server'
import LogoSettingsPanel from '@/components/admin/LogoSettingsPanel'

export default async function IdentidadePage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['company_name', 'logo_type', 'logo_name', 'logo_subname', 'logo_image_url', 'logo_font', 'logo_subname_align'])

  const get = (key: string, fallback = '') => rows?.find((r) => r.key === key)?.value ?? fallback

  const initial = {
    companyName: get('company_name', 'Arquitetura Organizada'),
    type: (get('logo_type', 'text') as 'text' | 'image'),
    name: get('logo_name', 'Arquitetura'),
    subname: get('logo_subname', 'organizada'),
    imageUrl: get('logo_image_url', ''),
    logoFont: get('logo_font', ''),
    subnameAlign: (get('logo_subname_align', 'end') as 'start' | 'center' | 'end'),
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Identidade</h1>
        <p className="text-sm text-neutral-500 mt-1">Nome da empresa e configuração do logo.</p>
      </div>
      <LogoSettingsPanel initial={initial} />
    </div>
  )
}
