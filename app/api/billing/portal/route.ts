import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { mp } from '@/lib/mercadopago/client'
import { PreApproval } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  if (!profile?.tenant_id) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenants')
    .select('stripe_subscription_id')
    .eq('id', profile.tenant_id)
    .single()

  if (!tenant?.stripe_subscription_id) {
    return NextResponse.json({ error: 'Nenhuma assinatura ativa' }, { status: 404 })
  }

  const preApproval = new PreApproval(mp)
  await preApproval.update({
    id: tenant.stripe_subscription_id,
    body: { status: 'cancelled' },
  })

  await admin
    .from('tenants')
    .update({ plan: 'starter', stripe_subscription_id: null })
    .eq('id', profile.tenant_id)

  return NextResponse.json({ success: true })
}
