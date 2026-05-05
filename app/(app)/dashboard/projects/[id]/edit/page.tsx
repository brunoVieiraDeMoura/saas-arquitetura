import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import type { Plan } from '@/lib/mercadopago/plans'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: project }, { data: categories }, { data: tenant }] = await Promise.all([
    admin.from('projects').select('*').eq('id', id).eq('tenant_id', tenantId).single(),
    admin.from('categories').select('id, name').eq('tenant_id', tenantId).order('order_index'),
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
  ])

  if (!project) notFound()

  const plan = (tenant?.plan ?? 'starter') as Plan
  const galleryLimit = PLANS[plan].galleryLimit
  const maxFileSizeMB = plan === 'agency' ? 15 : plan === 'pro' ? 10 : 5

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Editar Projeto</h1>
      <ProjectForm categories={categories ?? []} initial={project} galleryLimit={galleryLimit} maxFileSizeMB={maxFileSizeMB} />
    </div>
  )
}
