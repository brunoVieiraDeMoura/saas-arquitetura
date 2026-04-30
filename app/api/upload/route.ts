import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ALLOWED_BUCKETS = ['projects', 'categories', 'logo']

const MAX_SIZE: Record<string, number> = {
  agency:  15 * 1024 * 1024,
  pro:     10 * 1024 * 1024,
  starter:  5 * 1024 * 1024,
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function ensureBucketExists(admin: ReturnType<typeof createAdminClient>, bucket: string) {
  const { data: buckets } = await admin.storage.listBuckets()
  if (!buckets?.some((b) => b.id === bucket)) {
    await admin.storage.createBucket(bucket, { public: true })
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  let admin: ReturnType<typeof createAdminClient>
  try {
    admin = createAdminClient()
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  const { data: tenant } = profile
    ? await admin.from('tenants').select('plan').eq('id', profile.tenant_id).single()
    : { data: null }

  const plan = tenant?.plan ?? 'starter'
  const maxSize = MAX_SIZE[plan] ?? MAX_SIZE.starter

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const bucket = (formData.get('bucket') as string) || 'projects'

  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  if (file.size > maxSize) {
    const mb = maxSize / 1024 / 1024
    return NextResponse.json({ error: `Imagem deve ter no máximo ${mb}MB` }, { status: 400 })
  }
  if (!ALLOWED_BUCKETS.includes(bucket)) return NextResponse.json({ error: 'Bucket inválido' }, { status: 400 })

  await ensureBucketExists(admin, bucket)

  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const { data, error } = await admin.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType: file.type })

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Erro ao enviar arquivo' }, { status: 500 })

  const { data: { publicUrl } } = admin.storage.from(bucket).getPublicUrl(data.path)
  return NextResponse.json({ url: publicUrl })
}
