import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  await admin.from('projects').delete().eq('category_id', id).eq('tenant_id', tenantId)
  const { error } = await admin.from('categories').delete().eq('id', id).eq('tenant_id', tenantId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const body = await req.json()
  const { name, slug, description, order_index } = body

  if (order_index !== undefined) {
    const { data: current } = await admin
      .from('categories')
      .select('order_index')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single()

    const oldIndex = current?.order_index ?? order_index

    if (order_index < oldIndex) {
      // Moving to lower position: shift categories in [newIndex, oldIndex) up by 1
      const { data: toShift } = await admin
        .from('categories')
        .select('id, order_index')
        .eq('tenant_id', tenantId)
        .gte('order_index', order_index)
        .lt('order_index', oldIndex)
        .neq('id', id)
        .order('order_index', { ascending: false })

      for (const cat of toShift ?? []) {
        await admin.from('categories').update({ order_index: cat.order_index + 1 }).eq('id', cat.id)
      }
    } else if (order_index > oldIndex) {
      // Moving to higher position: shift categories in (oldIndex, newIndex] down by 1
      const { data: toShift } = await admin
        .from('categories')
        .select('id, order_index')
        .eq('tenant_id', tenantId)
        .gt('order_index', oldIndex)
        .lte('order_index', order_index)
        .neq('id', id)
        .order('order_index', { ascending: true })

      for (const cat of toShift ?? []) {
        await admin.from('categories').update({ order_index: cat.order_index - 1 }).eq('id', cat.id)
      }
    }
  }

  const { data, error } = await admin
    .from('categories')
    .update({ name, slug, description, order_index })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
