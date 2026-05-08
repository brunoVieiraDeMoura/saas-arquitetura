import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  const PRICE_TO_PLAN: Record<string, string> = {
    [process.env.STRIPE_PRICE_PRO_MONTHLY!]:    'pro',
    [process.env.STRIPE_PRICE_PRO_ANNUAL!]:     'pro',
    [process.env.STRIPE_PRICE_AGENCY_MONTHLY!]: 'agency',
    [process.env.STRIPE_PRICE_AGENCY_ANNUAL!]:  'agency',
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { tenantId, plan } = session.metadata ?? {}
    if (!tenantId || !plan) return NextResponse.json({ ok: true })

    await admin
      .from('tenants')
      .update({
        plan,
        subscription_id:     session.subscription as string,
        stripe_customer_id:  session.customer as string,
      })
      .eq('id', tenantId)
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const priceId = subscription.items.data[0]?.price.id
    const plan = PRICE_TO_PLAN[priceId]
    if (!plan) return NextResponse.json({ ok: true })

    await admin
      .from('tenants')
      .update({ plan })
      .eq('stripe_customer_id', subscription.customer as string)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription

    await admin
      .from('tenants')
      .update({ plan: 'starter', subscription_id: null })
      .eq('stripe_customer_id', subscription.customer as string)
  }

  return NextResponse.json({ ok: true })
}
