import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export type AuthTenant = {
  userId: string
  tenantId: string
  tenantSlug: string
  role: string
}

export async function requireTenant(): Promise<AuthTenant> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) redirect('/onboarding')

  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenants')
    .select('slug')
    .eq('id', profile.tenant_id)
    .single()

  return {
    userId: user.id,
    tenantId: profile.tenant_id,
    tenantSlug: tenant?.slug ?? '',
    role: profile.role,
  }
}

export async function requireSuperAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const allowed = (process.env.SUPERADMIN_EMAILS || '').split(',').map(e => e.trim())
  if (!allowed.includes(user.email ?? '')) redirect('/dashboard')

  return user.id
}
