import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { pagbankFetch, PAGBANK_SUBS_BASE } from '@/lib/pagbank/client'

export async function POST(req: NextRequest) {
  try { await requireSuperAdmin() } catch {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { tenantId } = await req.json()
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatório' }, { status: 400 })

  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenants')
    .select('plan, stripe_subscription_id')
    .eq('id', tenantId)
    .single()

  if (!tenant) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (!tenant.stripe_subscription_id) {
    return NextResponse.json({ error: 'Nenhuma assinatura ativa para reembolsar' }, { status: 400 })
  }

  // Get latest invoice to find the charge to refund
  let invoices: any
  try {
    invoices = await pagbankFetch(
      `/subscriptions/${tenant.stripe_subscription_id}/invoices`,
      {},
      PAGBANK_SUBS_BASE,
    )
  } catch (err: any) {
    console.error('[PagBank refund invoices error]', err)
    return NextResponse.json({ error: 'Erro ao buscar faturas no PagBank' }, { status: 500 })
  }

  const latestInvoice = Array.isArray(invoices)
    ? invoices.find((i: any) => i.status === 'PAID')
    : invoices?.invoices?.find((i: any) => i.status === 'PAID')

  if (!latestInvoice?.id) {
    return NextResponse.json({ error: 'Nenhuma fatura paga encontrada' }, { status: 404 })
  }

  // Issue full refund via the invoice
  try {
    await pagbankFetch(
      `/invoices/${latestInvoice.id}/refund`,
      {
        method: 'POST',
        body: JSON.stringify({ amount: latestInvoice.amount }),
      },
      PAGBANK_SUBS_BASE,
    )
  } catch (err: any) {
    console.error('[PagBank refund error]', err)
    return NextResponse.json({ error: 'Erro ao processar reembolso no PagBank' }, { status: 500 })
  }

  // Cancel subscription
  try {
    await pagbankFetch(
      `/subscriptions/${tenant.stripe_subscription_id}/cancel`,
      { method: 'PUT' },
      PAGBANK_SUBS_BASE,
    )
  } catch (err: any) {
    console.error('[PagBank refund cancel error]', err)
    return NextResponse.json({ error: 'Reembolso processado mas erro ao cancelar assinatura' }, { status: 500 })
  }

  await admin
    .from('tenants')
    .update({ plan: 'starter', stripe_subscription_id: null })
    .eq('id', tenantId)

  return NextResponse.json({ success: true, refundedInvoiceId: latestInvoice.id })
}
