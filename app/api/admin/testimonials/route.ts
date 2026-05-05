import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { author, role, content, avatar } = await req.json()

  const { data, error } = await admin
    .from('testimonials')
    .insert({ tenant_id: tenantId, author, role, content, avatar: avatar || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
