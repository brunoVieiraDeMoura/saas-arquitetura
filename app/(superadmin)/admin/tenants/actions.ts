'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { seedTenant } from '@/lib/seed'

const RESERVED_SLUGS = new Set([
  'login', 'signup', 'onboarding', 'dashboard', 'admin',
  'api', 'pricing', 'www', 'app', '_next', 'favicon',
])

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const slug = (formData.get('slug') as string).toLowerCase().trim()

  if (!email || !password || !name || !slug) return { error: 'Todos os campos são obrigatórios.' }
  if (slug.length < 3) return { error: 'Slug deve ter ao menos 3 caracteres.' }
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: 'Slug: só letras minúsculas, números e hífens.' }
  if (RESERVED_SLUGS.has(slug)) return { error: 'Esse slug é reservado.' }

  const admin = createAdminClient()

  const { data: existing } = await admin.from('tenants').select('id').eq('slug', slug).maybeSingle()
  if (existing) return { error: 'Slug já em uso.' }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) return { error: authError?.message ?? 'Erro ao criar usuário.' }

  const newUserId = authData.user.id

  const { data: tenant, error: tenantError } = await admin
    .from('tenants')
    .insert({ name, slug, plan: 'agency' })
    .select('id')
    .single()

  if (tenantError || !tenant) {
    await admin.auth.admin.deleteUser(newUserId)
    return { error: tenantError?.message ?? 'Erro ao criar tenant.' }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: newUserId, tenant_id: tenant.id })

  if (profileError) {
    await admin.from('tenants').delete().eq('id', tenant.id)
    await admin.auth.admin.deleteUser(newUserId)
    return { error: profileError.message }
  }

  await seedTenant(admin, tenant.id, name)

  return { ok: true, slug }
}

const PROTECTED_EMAIL = 'bruno.moura.code@gmail.com'

export async function deleteTenant(tenantId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  const admin = createAdminClient()

  const { data: profiles } = await admin
    .from('profiles')
    .select('id')
    .eq('tenant_id', tenantId)

  if (profiles?.length) {
    for (const profile of profiles) {
      const { data: { user: authUser } } = await admin.auth.admin.getUserById(profile.id)
      if (authUser?.email === PROTECTED_EMAIL) {
        return { error: 'Essa conta não pode ser deletada.' }
      }
    }
  }

  await admin.from('tenants').delete().eq('id', tenantId)

  if (profiles?.length) {
    for (const profile of profiles) {
      await admin.auth.admin.deleteUser(profile.id)
    }
  }

  return { ok: true }
}
