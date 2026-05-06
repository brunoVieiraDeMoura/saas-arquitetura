import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pagbankFetch, PAGBANK_SUBS_BASE } from '@/lib/pagbank/client'
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

  try {
    await pagbankFetch(
      `/subscriptions/${tenant.stripe_subscription_id}/cancel`,
      { method: 'PUT' },
      PAGBANK_SUBS_BASE,
    )
  } catch (err: any) {
    console.error('[PagBank cancel error]', err)
    return NextResponse.json({ error: 'Erro ao cancelar assinatura no PagBank' }, { status: 500 })
  }

  await admin
    .from('tenants')
    .update({ plan: 'starter', stripe_subscription_id: null })
    .eq('id', profile.tenant_id)

  return NextResponse.json({ success: true })
}
