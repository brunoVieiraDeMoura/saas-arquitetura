import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { type Plan } from '@/lib/plans'

const PRICE_MAP: Record<string, Record<'monthly' | 'annual', string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL!,
  },
  agency: {
    monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_AGENCY_ANNUAL!,
  },
}

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireTenant()
    const { plan, billing } = await req.json() as { plan: Plan; billing: 'monthly' | 'annual' }

    if (!plan || plan === 'starter') {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
    }

    const priceId = PRICE_MAP[plan]?.[billing]
    if (!priceId) {
      return NextResponse.json({ error: 'Configuração de preço não encontrada.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: tenant } = await admin
      .from('tenants')
      .select('stripe_customer_id')
      .eq('id', tenantId)
      .single()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      locale: 'pt-BR',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { tenantId, plan },
      ...(tenant?.stripe_customer_id ? { customer: tenant.stripe_customer_id } : {}),
      success_url: `${baseUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${baseUrl}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[billing/checkout]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
