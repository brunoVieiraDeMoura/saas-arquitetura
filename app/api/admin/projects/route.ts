import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const body = await req.json()
  const { category_id, gallery, ...rest } = body

  const galleryArr = Array.isArray(gallery) ? gallery : []

  const { data, error } = await admin
    .from('projects')
    .insert({ tenant_id: tenantId, category_id, gallery: galleryArr, ...rest })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
