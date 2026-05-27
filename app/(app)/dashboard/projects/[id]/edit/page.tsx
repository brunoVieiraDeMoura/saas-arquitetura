import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import ProjectForm from '@/components/admin/ProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: project }, { data: categories }] = await Promise.all([
    admin.from('projects').select('*').eq('id', id).eq('tenant_id', tenantId).single(),
    admin.from('categories').select('id, name').eq('tenant_id', tenantId).order('order_index'),
  ])

  if (!project) notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Editar Projeto</h1>
      <ProjectForm categories={categories ?? []} initial={project} maxFileSizeMB={15} />
    </div>
  )
}
