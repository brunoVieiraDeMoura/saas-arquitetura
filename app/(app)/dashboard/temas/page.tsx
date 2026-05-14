import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Plan } from '@/lib/plans'
import TemasClient from './_components/TemasClient'

export default async function TemasPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: tenant }, { data: rows }] = await Promise.all([
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
    admin.from('settings').select('key, value').eq('tenant_id', tenantId)
      .in('key', ['theme_hero', 'theme_projects', 'theme_cta', 'theme_testimonials', 'theme_faq', 'theme_contact']),
  ])

  const plan = (tenant?.plan ?? 'starter') as Plan
  const get = (key: string) => Number(rows?.find((r) => r.key === key)?.value ?? '1') as 1 | 2 | 3

  const themes = {
    hero:         get('theme_hero'),
    projects:     get('theme_projects'),
    cta:          get('theme_cta'),
    testimonials: get('theme_testimonials'),
    faq:          get('theme_faq'),
    contact:      get('theme_contact'),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Temas</h1>
        <p className="text-sm text-neutral-500 mt-1">Personalize a aparência de cada seção do seu site.</p>
      </div>
      <TemasClient plan={plan} themes={themes} />
    </div>
  )
}
