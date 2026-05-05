import { requireSuperAdmin } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  await requireSuperAdmin()
  const admin = createAdminClient()
  const { data, error } = await admin.from('plan_prices').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}

export async function PUT(req: NextRequest) {
  await requireSuperAdmin()
  const admin = createAdminClient()
  const body = await req.json()

  for (const [plan, prices] of Object.entries(body) as [string, { price_monthly: number; price_annual: number }][]) {
    const { error } = await admin
      .from('plan_prices')
      .upsert({ plan, price_monthly: prices.price_monthly, price_annual: prices.price_annual, updated_at: new Date().toISOString() })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
