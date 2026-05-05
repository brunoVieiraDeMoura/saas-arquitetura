'use server'

import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { addVercelDomain, removeVercelDomain } from '@/lib/vercel/domains'

function isValidSlug(slug: string) {
  return /^[a-z0-9-]{3,50}$/.test(slug)
}

export async function updateTenantSettings(formData: FormData) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const slug = (formData.get('slug') as string).trim().toLowerCase()

  if (!isValidSlug(slug)) return { error: 'Slug inválido. Use apenas letras minúsculas, números e hífens (3–50 caracteres).' }

  const { data: existing } = await admin
    .from('tenants')
    .select('id')
    .eq('slug', slug)
    .neq('id', tenantId)
    .maybeSingle()

  if (existing) return { error: 'Esse slug já está em uso. Escolha outro.' }

  const { error } = await admin
    .from('tenants')
    .update({ slug })
    .eq('id', tenantId)

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/settings')
  return { success: true, slug }
}

export async function updateCustomDomain(formData: FormData) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin
    .from('tenants')
    .select('plan, custom_domain')
    .eq('id', tenantId)
    .single()

  if (tenant?.plan === 'starter') return { error: 'Domínio customizado requer plano Pro ou Agency.' }

  const domain = (formData.get('domain') as string | null)?.trim().toLowerCase() ?? ''

  if (domain === '') {
    if (tenant?.custom_domain) {
      await removeVercelDomain(tenant.custom_domain)
      await admin.from('tenants').update({ custom_domain: null }).eq('id', tenantId)
    }
    revalidatePath('/dashboard/settings')
    return { success: true, removed: true }
  }

  if (!/^[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)+$/.test(domain)) {
    return { error: 'Formato inválido. Ex: meuescritorio.com.br' }
  }

  const { data: conflict } = await admin
    .from('tenants')
    .select('id')
    .eq('custom_domain', domain)
    .neq('id', tenantId)
    .maybeSingle()

  if (conflict) return { error: 'Esse domínio já está em uso.' }

  const result = await addVercelDomain(domain)
  const IGNORABLE = ['domain_already_in_project', 'domain_taken', 'forbidden']
  if (result.error && !IGNORABLE.includes(result.error.code)) {
    return { error: result.error.message ?? 'Erro ao adicionar domínio na Vercel.' }
  }

  if (tenant?.custom_domain && tenant.custom_domain !== domain) {
    await removeVercelDomain(tenant.custom_domain)
  }

  await admin.from('tenants').update({ custom_domain: domain }).eq('id', tenantId)

  revalidatePath('/dashboard/settings')
  return { success: true, domain }
}
