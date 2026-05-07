import { NextResponse } from 'next/server'
import { PreApproval } from 'mercadopago'
import { mp } from '@/lib/mercadopago/client'
import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { PLANS, type Plan } from '@/lib/plans'

const AMOUNTS: Record<Plan, Record<'monthly' | 'annual', { amount: number; frequency: number }>> = {
  starter: { monthly: { amount: 0, frequency: 1 }, annual: { amount: 0, frequency: 12 } },
  pro:     { monthly: { amount: 130, frequency: 1 }, annual: { amount: 1188, frequency: 12 } },
  agency:  { monthly: { amount: 250, frequency: 1 }, annual: { amount: 2040, frequency: 12 } },
}

export async function POST(req: Request) {
  try {
    const { tenantId } = await requireTenant()
    const { plan, billing } = await req.json() as { plan: Plan; billing: 'monthly' | 'annual' }

    if (!plan || plan === 'starter') {
      return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
    }

    const planDef = PLANS[plan]
    if (!planDef) return NextResponse.json({ error: 'Plano não encontrado.' }, { status: 400 })

    const config = AMOUNTS[plan]?.[billing]
    if (!config || config.amount === 0) {
      return NextResponse.json({ error: 'Configuração de valor inválida.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const admin = createAdminClient()
    const { data: tenant } = await admin
      .from('tenants')
      .select('name')
      .eq('id', tenantId)
      .single()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arquiteturaorganizada.com.br'
    const webhookToken = process.env.MP_WEBHOOK_TOKEN!
    const webhookUrl = `${baseUrl}/api/billing/webhook?token=${webhookToken}`

    const preapproval = new PreApproval(mp)
    const result = await preapproval.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: {
        reason: `${planDef.name} — ${billing === 'annual' ? 'Anual' : 'Mensal'} · ${tenant?.name ?? ''}`,
        external_reference: `${tenantId}:${plan}:${billing}`,
        payer_email: user?.email,
        auto_recurring: {
          frequency: config.frequency,
          frequency_type: 'months',
          transaction_amount: config.amount,
          currency_id: 'BRL',
        },
        back_url: `${baseUrl}/dashboard/billing?checkout=success`,
        status: 'pending',
        notification_url: webhookUrl,
      } as any,
    })

    const initPoint = result.init_point
    if (!initPoint) {
      return NextResponse.json({ error: 'Erro ao criar assinatura no MercadoPago.' }, { status: 500 })
    }

    return NextResponse.json({ url: initPoint })
  } catch (err) {
    console.error('[billing/checkout] raw error:', JSON.stringify(err, null, 2))
    const e = err as Record<string, unknown>
    const message =
      (e?.message as string) ??
      (e?.error as string) ??
      JSON.stringify(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
