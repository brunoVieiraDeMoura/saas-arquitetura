import { createClient } from '@/lib/supabase/server'
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
  const externalRef = `${profile.tenant_id}:${plan}`
  const preApproval = new PreApproval(mp)
  let sub

  // Reuse existing pending PreApproval for same plan+cycle to avoid accumulating
  // duplicate subscriptions — MP's fraud engine flags consecutive identical attempts.
  // Cancel any pending ones with a different amount (stale billing-cycle mismatch).
  try {
    const existing = await preApproval.search({
      options: { external_reference: externalRef, status: 'pending', limit: 5 } as any,
    })
    let reuseUrl: string | null = null
    const staleIds: string[] = []
    for (const r of (existing as any)?.results ?? []) {
      const sameAmount = Math.abs((r.auto_recurring?.transaction_amount ?? 0) - transactionAmount) < 0.01
      if (sameAmount && r.init_point && !reuseUrl) {
        reuseUrl = r.init_point
      } else if (!sameAmount && r.id) {
        staleIds.push(r.id)
      }
    }
    // Cancel stale ones in parallel before deciding to reuse or create
    if (staleIds.length > 0) {
      await Promise.allSettled(
        staleIds.map(id => preApproval.update({ id, body: { status: 'cancelled' } }))
      )
    }
    if (reuseUrl) return NextResponse.json({ url: reuseUrl })
  } catch {
    // search failure is non-fatal — fall through to create
  }

  // Daily idempotency key prevents duplicate subscriptions from concurrent requests
  // (e.g. double-click). A new key each day allows fresh retries after rejections.
  const today = new Date().toISOString().slice(0, 10)
  const idempotencyKey = `checkout-${profile.tenant_id}-${plan}-${billingCycle}-${today}`

  try {
    const body: any = {
      reason: `Arquitetura Organizada - Plano ${planData.name} (${billingLabel})`,
      payer_email: user.email!,
      auto_recurring: {
        frequency,
        frequency_type: 'months',
        transaction_amount: transactionAmount,
        currency_id: 'BRL',
      },
      back_url: backUrl,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/billing/webhook`,
      external_reference: externalRef,
      status: 'pending',
    }
    sub = await preApproval.create({ body, requestOptions: { idempotencyKey } as any })
  } catch (err: any) {
    const detail = err?.cause ?? err
    console.error('[MP checkout error]', JSON.stringify(detail, null, 2))
    return NextResponse.json({ error: err?.message ?? 'Erro ao criar assinatura' }, { status: 500 })
  }

  if (!sub.init_point) return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })

  return NextResponse.json({ url: sub.init_point })
}
