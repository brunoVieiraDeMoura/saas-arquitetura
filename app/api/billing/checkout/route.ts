import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { mp } from '@/lib/mercadopago/client'
import { PLANS, type BillingCycle } from '@/lib/mercadopago/plans'
import { getPlanPrices } from '@/lib/mercadopago/getPlanPrices'
import { PreApproval } from 'mercadopago'
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
  const monthlyPrice = billingCycle === 'annual' ? effectiveAnnual : effectiveMonthly

  // Annual: charge full year upfront (12 months). Monthly: charge each month.
  const frequency = billingCycle === 'annual' ? 12 : 1
  const transactionAmount = billingCycle === 'annual'
    ? (monthlyPrice / 100) * 12
    : monthlyPrice / 100

  const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
  if (!profile?.tenant_id) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  // back_url must be a publicly accessible HTTPS URL — MP rejects localhost
  // success=1 is set only on the success_url; MP appends its own status params
  const backUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`

  const billingLabel = billingCycle === 'annual' ? 'Anual' : 'Mensal'
  const preApproval = new PreApproval(mp)
  let sub
  try {
    const body: any = {
      reason: `Arquitetura Organizada — Plano ${planData.name} (${billingLabel})`,
      payer_email: user.email!,
      auto_recurring: {
        frequency,
        frequency_type: 'months',
        transaction_amount: transactionAmount,
        currency_id: 'BRL',
      },
      back_url: backUrl,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/billing/webhook`,
      external_reference: `${profile.tenant_id}:${plan}`,
      status: 'pending',
    }
    sub = await preApproval.create({ body, requestOptions: { idempotencyKey: `${profile.tenant_id}-${plan}-${billingCycle}` } })
  } catch (err: any) {
    const detail = err?.cause ?? err
    console.error('[MP checkout error]', JSON.stringify(detail, null, 2))
    return NextResponse.json({ error: err?.message ?? 'Erro ao criar assinatura' }, { status: 500 })
  }

  if (!sub.init_point) return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })

  return NextResponse.json({ url: sub.init_point })
}
