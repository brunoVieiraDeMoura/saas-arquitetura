import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tenantSlug = searchParams.get('tenant')
  if (!tenantSlug) return NextResponse.json({ error: 'tenant param required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: tenant } = await admin.from('tenants').select('id').eq('slug', tenantSlug).single()
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const tenantId = tenant.id

  const { data: row } = await admin
    .from('settings')
    .select('value')
    .eq('tenant_id', tenantId)
    .eq('key', '_snapshot')
    .single()

  if (!row?.value) {
    return NextResponse.json({ error: 'No snapshot found. POST /api/admin/snapshot first.' }, { status: 400 })
  }

  const snapshot = JSON.parse(row.value) as {
    categories: any[]
    projects: any[]
    testimonials: any[]
    faqs: any[]
    settings: any[]
  }

  await admin.from('projects').delete().eq('tenant_id', tenantId)
  await admin.from('categories').delete().eq('tenant_id', tenantId)
  await admin.from('testimonials').delete().eq('tenant_id', tenantId)
  await admin.from('faqs').delete().eq('tenant_id', tenantId)

  if (snapshot.categories.length) await admin.from('categories').insert(snapshot.categories)
  if (snapshot.projects.length) await admin.from('projects').insert(snapshot.projects)
  if (snapshot.testimonials.length) await admin.from('testimonials').insert(snapshot.testimonials)
  if (snapshot.faqs.length) await admin.from('faqs').insert(snapshot.faqs)

  for (const s of snapshot.settings) {
    await admin.from('settings').upsert(s, { onConflict: 'tenant_id,key' })
  }

  return NextResponse.json({
    ok: true,
    restored: {
      categories: snapshot.categories.length,
      projects: snapshot.projects.length,
      testimonials: snapshot.testimonials.length,
      faqs: snapshot.faqs.length,
    },
  })
}
