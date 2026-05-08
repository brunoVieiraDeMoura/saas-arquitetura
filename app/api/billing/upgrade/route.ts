import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireTenant()
    const { billing } = await req.json() as { billing: 'monthly' | 'annual' }

    const newPriceId = billing === 'annual'
      ? process.env.STRIPE_PRICE_AGENCY_ANNUAL!
      : process.env.STRIPE_PRICE_AGENCY_MONTHLY!

    const admin = createAdminClient()
    const { data: tenant } = await admin
      .from('tenants')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', tenantId)
      .single()

    if (!tenant?.stripe_subscription_id || !tenant?.stripe_customer_id) {
      return NextResponse.json({ error: 'Sem assinatura ativa.' }, { status: 400 })
    }

    let subscription = await stripe.subscriptions.retrieve(tenant.stripe_subscription_id)

    if (subscription.schedule) {
      await stripe.subscriptionSchedules.release(subscription.schedule as string)
      subscription = await stripe.subscriptions.retrieve(tenant.stripe_subscription_id)
    }

    const itemId = subscription.items.data[0].id
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/billing`,
      flow_data: {
        type: 'subscription_update_confirm',
        subscription_update_confirm: {
          subscription: tenant.stripe_subscription_id,
          items: [{ id: itemId, price: newPriceId, quantity: 1 }],
        },
      },
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[billing/upgrade]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
