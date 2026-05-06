import { requireSuperAdmin } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try { await requireSuperAdmin() } catch { return NextResponse.json({ error: 'Não autorizado' }, { status: 403 }) }
  const admin = createAdminClient()
  const { data, error } = await admin.from('plan_prices').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}

export async function PUT(req: NextRequest) {
  try { await requireSuperAdmin() } catch { return NextResponse.json({ error: 'Não autorizado' }, { status: 403 }) }
  const admin = createAdminClient()
  const body = await req.json()

  for (const [plan, prices] of Object.entries(body) as [string, { price_monthly: number; price_annual: number }][]) {
    const monthly = Number(prices.price_monthly)
    const annual = Number(prices.price_annual)

    if (!Number.isFinite(monthly) || monthly <= 0) {
      return NextResponse.json({ error: `Preço mensal inválido para ${plan}` }, { status: 400 })
    }
    if (!Number.isFinite(annual) || annual <= 0) {
      return NextResponse.json({ error: `Preço anual inválido para ${plan}` }, { status: 400 })
    }
    if (annual > monthly) {
      return NextResponse.json({ error: `Preço anual não pode ser maior que mensal para ${plan}` }, { status: 400 })
    }

    const { error } = await admin
      .from('plan_prices')
      .upsert({ plan, price_monthly: monthly, price_annual: annual, updated_at: new Date().toISOString() })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
