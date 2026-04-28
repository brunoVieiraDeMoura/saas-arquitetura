import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { mp } from '@/lib/mercadopago/client'
import { Payment, PaymentRefund, PreApproval } from 'mercadopago'

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin()
  } catch {
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

  // Find latest approved payment for this subscription
  const paymentApi = new Payment(mp)
  const results = await paymentApi.search({
    options: {
      external_reference: `${tenantId}:${tenant.plan}`,
      sort: 'date_created',
      criteria: 'desc',
      limit: 5,
    },
  })

  const latestPayment = results?.results?.find((p: any) => p.status === 'approved')
  if (!latestPayment?.id) {
    return NextResponse.json({ error: 'Nenhum pagamento aprovado encontrado' }, { status: 404 })
  }

  // Issue full refund
  const refundApi = new PaymentRefund(mp)
  await refundApi.create({ payment_id: latestPayment.id, body: {} })

  // Cancel subscription on MP
  const preApproval = new PreApproval(mp)
  await preApproval.update({
    id: tenant.stripe_subscription_id,
    body: { status: 'cancelled' },
  })

  // Downgrade plan
  await admin
    .from('tenants')
    .update({ plan: 'starter', stripe_subscription_id: null })
    .eq('id', tenantId)

  return NextResponse.json({ success: true, refundedPaymentId: latestPayment.id })
}
