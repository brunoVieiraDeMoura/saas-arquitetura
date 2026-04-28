import { createAdminClient } from '@/lib/supabase/admin'

export type Tenant = {
  id: string
  slug: string
  name: string
  plan: string
  custom_domain: string | null
  settings: { key: string; value: string }[]
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenants')
    .select('id, slug, name, plan, custom_domain')
    .eq('slug', slug)
    .single()

  if (!tenant) return null

  const { data: settings } = await admin
    .from('settings')
    .select('key, value')
    .eq('tenant_id', tenant.id)

  return { ...tenant, settings: settings ?? [] }
}
