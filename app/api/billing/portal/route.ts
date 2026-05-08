import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin
    .from('tenants')
    .select('stripe_customer_id')
    .eq('id', tenantId)
    .single()

  if (!tenant?.stripe_customer_id) {
    return NextResponse.json({ error: 'Sem assinatura ativa.' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: tenant.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/billing`,
  })

  return NextResponse.json({ url: portalSession.url })
}
