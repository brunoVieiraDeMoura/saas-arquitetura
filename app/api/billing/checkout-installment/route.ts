import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { type Plan } from '@/lib/plans'

// Price IDs configurados como "one-time" no Stripe Dashboard
const INSTALLMENT_PRICE_MAP: Record<string, string> = {
  pro:    process.env.STRIPE_PRICE_PRO_INSTALLMENT!,
  agency: process.env.STRIPE_PRICE_AGENCY_INSTALLMENT!,
}

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireTenant()
    const { plan } = await req.json() as { plan: Plan }

    if (!plan || plan === 'starter') {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
    }

    const priceId = INSTALLMENT_PRICE_MAP[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Preço parcelado não configurado para este plano.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: tenant } = await admin
      .from('tenants')
      .select('stripe_customer_id')
      .eq('id', tenantId)
      .single()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'pt-BR',
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_options: {
        card: {
          installments: { enabled: true },
        },
      },
      metadata: { tenantId, plan },
      ...(tenant?.stripe_customer_id ? { customer: tenant.stripe_customer_id } : {}),
      success_url: `${baseUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${baseUrl}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[billing/checkout-installment]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
