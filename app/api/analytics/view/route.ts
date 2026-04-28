import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.tenantId || !body?.path) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('page_views').insert({
    tenant_id: body.tenantId,
    project_id: body.projectId ?? null,
    path: String(body.path).slice(0, 500),
  })

  if (error) {
    console.error('[analytics/view]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
