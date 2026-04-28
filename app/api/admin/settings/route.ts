import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const rows: { key: string; value: string }[] = await req.json()
  const admin = createAdminClient()

  for (const row of rows) {
    await admin.from('settings').upsert(
      { tenant_id: profile.tenant_id, key: row.key, value: row.value },
      { onConflict: 'tenant_id,key' }
    )
  }

  return NextResponse.json({ ok: true })
}
