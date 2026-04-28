import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import type { Plan } from '@/lib/mercadopago/plans'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin.from('tenants').select('plan').eq('id', tenantId).single()
  const plan = (tenant?.plan ?? 'starter') as Plan
  const limit = PLANS[plan].limits.categories

  if (limit !== Infinity) {
    const { count } = await admin
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        { error: `Limite de ${limit} categoria${limit > 1 ? 's' : ''} atingido no plano ${PLANS[plan].name}. Faça upgrade para continuar.` },
        { status: 403 }
      )
    }
  }

  const body = await req.json()
  const { name, slug, description, order_index } = body

  const { data, error } = await admin
    .from('categories')
    .insert({ tenant_id: tenantId, name, slug, description, order_index })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
