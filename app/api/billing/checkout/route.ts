import { createClient } from '@/lib/supabase/server'
import { PLANS, type BillingCycle } from '@/lib/mercadopago/plans'
import { getPlanPrices } from '@/lib/mercadopago/getPlanPrices'
import { pagbankFetch } from '@/lib/pagbank/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { plan, billing = 'monthly' } = await req.json()
  if (!plan || !(plan in PLANS) || plan === 'starter') {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const planData = PLANS[plan as keyof typeof PLANS]
  if (planData.price === 0) return NextResponse.json({ error: 'Plano sem cobrança' }, { status: 400 })

  const priceOverrides = await getPlanPrices()
  const override = priceOverrides[plan as keyof typeof priceOverrides]
  const effectiveMonthly = override?.price ?? planData.price
  const effectiveAnnual = override?.priceAnnual ?? planData.priceAnnual

  const billingCycle: BillingCycle = billing === 'annual' ? 'annual' : 'monthly'
  const billingLabel = billingCycle === 'annual' ? 'Anual' : 'Mensal'

  // unit_amount in cents (BRL). Annual: full year charged once per year.
  const unitAmount = billingCycle === 'annual'
    ? Math.round(effectiveAnnual * 12)
    : effectiveMonthly

  const intervalUnit = billingCycle === 'annual' ? 'YEAR' : 'MONTH'

  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  if (!profile?.tenant_id) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/billing/webhook?token=${process.env.PAGBANK_WEBHOOK_TOKEN}`
  const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`

  let checkout: any
  try {
    checkout = await pagbankFetch('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        reference_id: `${profile.tenant_id}:${plan}`,
        customer: { email: user.email },
        items: [{
          reference_id: plan,
          name: `Arquitetura Organizada - Plano ${planData.name} (${billingLabel})`,
          quantity: 1,
          unit_amount: unitAmount,
        }],
        payment_methods: [
          { type: 'CREDIT_CARD' },
        ],
        recurrence_plan: { interval: { unit: intervalUnit } },
        notification_urls: [webhookUrl],
        return_url: returnUrl,
      }),
    })
  } catch (err: any) {
    const detail = (err as any)?.cause ?? err
    console.error('[PagBank checkout error]', JSON.stringify(detail, null, 2))
    const msg = JSON.stringify(detail)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const url =
    checkout?.redirect_url ??
    checkout?.links?.find((l: any) => l.rel === 'PAY' || l.rel === 'CHECKOUT')?.href

  if (!url) return NextResponse.json({ error: 'Erro ao obter URL de pagamento' }, { status: 500 })

  return NextResponse.json({ url })
}
