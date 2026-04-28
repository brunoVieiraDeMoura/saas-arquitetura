import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { seedTenant } from '@/lib/seed'
import { NextResponse } from 'next/server'

const RESERVED_SLUGS = new Set([
  'login', 'signup', 'onboarding', 'dashboard', 'admin',
  'api', 'pricing', 'www', 'app', '_next', 'favicon',
])

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { name, slug } = await req.json()

  if (!name || !slug || slug.length < 3) {
    return NextResponse.json({ error: 'Nome e slug são obrigatórios (mín. 3 chars).' }, { status: 400 })
  }

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: 'Esse slug é reservado.' }, { status: 409 })
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug inválido. Use apenas letras minúsculas, números e hífens.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Check slug availability
  const { data: existing } = await admin.from('tenants').select('id').eq('slug', slug).maybeSingle()
  if (existing) return NextResponse.json({ error: 'Esse slug já está em uso. Escolha outro.' }, { status: 409 })

  // Check if user already has a tenant
  const { data: existingProfile } = await admin
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (existingProfile?.tenant_id) {
    return NextResponse.json({ error: 'Você já possui um site.' }, { status: 409 })
  }

  // Create tenant
  const { data: tenant, error: tenantError } = await admin
    .from('tenants')
    .insert({ name, slug, plan: 'starter' })
    .select('id')
    .single()

  if (tenantError || !tenant) {
    return NextResponse.json({ error: tenantError?.message ?? 'Erro ao criar tenant.' }, { status: 500 })
  }

  // Create profile
  const { error: profileError } = await admin
    .from('profiles')
    .insert({ id: user.id, tenant_id: tenant.id })

  if (profileError) {
    // Roll back tenant creation
    await admin.from('tenants').delete().eq('id', tenant.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  await seedTenant(admin, tenant.id, name)

  return NextResponse.json({ ok: true, slug })
}
