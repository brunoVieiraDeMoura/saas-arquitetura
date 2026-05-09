import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const body = await req.json()

  const { data, error } = await admin
    .from('projects')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: project } = await admin
    .from('projects')
    .select('main_image, gallery')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single()

  const { error } = await admin
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (project) {
    const urls: string[] = [
      ...(project.main_image ? [project.main_image] : []),
      ...(Array.isArray(project.gallery) ? project.gallery : []),
    ]

    const paths = urls
      .map((url) => {
        try {
          const u = new URL(url)
          const match = u.pathname.match(/\/projects\/(.+)$/)
          return match ? match[1] : null
        } catch {
          return null
        }
      })
      .filter((p): p is string => p !== null)

    if (paths.length > 0) {
      await admin.storage.from('projects').remove(paths)
    }
  }

  return NextResponse.json({ ok: true })
}
