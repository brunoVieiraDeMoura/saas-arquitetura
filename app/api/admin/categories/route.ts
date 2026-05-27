import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const body = await req.json()
  const { name, slug, description, order_index } = body

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
