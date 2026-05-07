import { NextResponse } from 'next/server'
import { PreApproval } from 'mercadopago'
import { mp } from '@/lib/mercadopago/client'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS, type Plan } from '@/lib/plans'

const PLAN_IDS: Record<string, Record<string, string | undefined>> = {
  pro: {
    monthly: process.env.MP_PLAN_ID_PRO_MONTHLY,
    annual: process.env.MP_PLAN_ID_PRO_ANNUAL,
  },
  agency: {
    monthly: process.env.MP_PLAN_ID_AGENCY_MONTHLY,
    annual: process.env.MP_PLAN_ID_AGENCY_ANNUAL,
  },
}

export async function POST(req: Request) {
  const { tenantId } = await requireTenant()
  const { plan, billing } = await req.json() as { plan: Plan; billing: 'monthly' | 'annual' }

  if (!plan || plan === 'starter') {
    return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
  }

  const planDef = PLANS[plan]
  if (!planDef) return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 400 })

  const preapprovalPlanId = PLAN_IDS[plan]?.[billing]
  if (!preapprovalPlanId) {
    return NextResponse.json({ error: 'Plano MP não configurado.' }, { status: 500 })
  }

  const admin = createAdminClient()
  const { data: tenant } = await admin
    .from('tenants')
    .select('name')
    .eq('id', tenantId)
    .single()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.arquiteturaorganizada.com.br'
  const webhookToken = process.env.MP_WEBHOOK_TOKEN!
  const webhookUrl = `${baseUrl}/api/billing/webhook?token=${webhookToken}`

  const preapproval = new PreApproval(mp)
  const result = await preapproval.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: {
      preapproval_plan_id: preapprovalPlanId,
      reason: `${planDef.name} — ${billing === 'annual' ? 'Anual' : 'Mensal'}`,
      external_reference: `${tenantId}:${plan}:${billing}`,
      back_url: `${baseUrl}/dashboard/billing?checkout=success`,
      status: 'pending',
      notification_url: webhookUrl,
    } as any,
  })

  const initPoint = (result as Record<string, unknown>).init_point as string | undefined
  if (!initPoint) {
    return NextResponse.json({ error: 'Erro ao criar assinatura no MercadoPago.' }, { status: 500 })
  }

  return NextResponse.json({ url: initPoint })
}
