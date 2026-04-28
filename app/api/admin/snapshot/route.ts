import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const admin = createAdminClient()
  const tenantId = profile.tenant_id

  const [categories, projects, testimonials, faqs, settings] = await Promise.all([
    admin.from('categories').select('*').eq('tenant_id', tenantId).order('order_index', { ascending: true }),
    admin.from('projects').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: true }),
    admin.from('testimonials').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: true }),
    admin.from('faqs').select('*').eq('tenant_id', tenantId).order('order_index', { ascending: true }),
    admin.from('settings').select('*').eq('tenant_id', tenantId).not('key', 'like', '_%'),
  ])

  const snapshot = JSON.stringify({
    categories: categories.data ?? [],
    projects: projects.data ?? [],
    testimonials: testimonials.data ?? [],
    faqs: faqs.data ?? [],
    settings: settings.data ?? [],
  })

  await admin.from('settings').upsert(
    { tenant_id: tenantId, key: '_snapshot', value: snapshot },
    { onConflict: 'tenant_id,key' }
  )

  return NextResponse.json({
    ok: true,
    saved: {
      categories: categories.data?.length,
      projects: projects.data?.length,
      testimonials: testimonials.data?.length,
      faqs: faqs.data?.length,
    },
  })
}
