import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import type { Plan } from '@/lib/mercadopago/plans'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: tenant } = await admin.from('tenants').select('plan').eq('id', tenantId).single()
  const plan = (tenant?.plan ?? 'starter') as Plan
  const planData = PLANS[plan]

  const body = await req.json()
  const { category_id, gallery, ...rest } = body

  // Per-category project limit
  if (planData.limits.projects !== Infinity) {
    const perCatLimit = Math.floor(planData.limits.projects / Math.max(planData.limits.categories, 1))
    const { count } = await admin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('category_id', category_id)

    if ((count ?? 0) >= perCatLimit) {
      return NextResponse.json(
        { error: `Limite de ${perCatLimit} projetos por categoria atingido no plano ${planData.name}. Faça upgrade para continuar.` },
        { status: 403 }
      )
    }
  }

  // Gallery limit
  const galleryArr = Array.isArray(gallery) ? gallery : []
  const clampedGallery = planData.galleryLimit === Infinity
    ? galleryArr
    : galleryArr.slice(0, planData.galleryLimit)

  const { data, error } = await admin
    .from('projects')
    .insert({ tenant_id: tenantId, category_id, gallery: clampedGallery, ...rest })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
