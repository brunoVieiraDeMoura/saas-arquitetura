import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function NewCategoryPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: existingCategories } = await admin
    .from('categories')
    .select('id, name, order_index')
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  const maxOrderIndex = existingCategories?.reduce((m, c) => Math.max(m, c.order_index ?? 0), -1) ?? -1
  const nextOrderIndex = maxOrderIndex + 1

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Nova Categoria</h1>
      <CategoryForm defaultOrderIndex={nextOrderIndex} allCategories={existingCategories ?? []} />
    </div>
  )
}
