import { NextResponse } from 'next/server'
import { PreApproval } from 'mercadopago'
import { mp } from '@/lib/mercadopago/client'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin
    .from('tenants')
    .select('subscription_id')
    .eq('id', tenantId)
    .single()

  if (!tenant?.subscription_id) {
    return NextResponse.json({ error: 'Sem assinatura ativa.' }, { status: 400 })
  }

  const preapproval = new PreApproval(mp)
  await preapproval.update({
    id: tenant.subscription_id as string,
    body: { status: 'cancelled' },
  })

  await admin
    .from('tenants')
    .update({ plan: 'starter', subscription_id: null })
    .eq('id', tenantId)

  return NextResponse.json({ ok: true })
}
