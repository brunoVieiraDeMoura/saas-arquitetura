import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/plans'
import type { Plan } from '@/lib/plans'
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
        { error: `Limite de ${limit} categoria${limit > 1 ? 's' : ''} atingido no plano ${PLANS[plan].name}. FaÃ§a upgrade para continuar.` },
        { status: 403 }
      )
    }
  }

  const body = await req.json()
  const { name, slug, description, order_index } = body

  // Shift existing categories at this position down
  const { data: toShift } = await admin
    .from('categories')
    .select('id, order_index')
    .eq('tenant_id', tenantId)
    .gte('order_index', order_index)
    .order('order_index', { ascending: false })

  for (const cat of toShift ?? []) {
    await admin.from('categories').update({ order_index: cat.order_index + 1 }).eq('id', cat.id)
  }

  const { data, error } = await admin
    .from('categories')
    .insert({ tenant_id: tenantId, name, slug, description, order_index })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
