import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/plans'
import type { Plan } from '@/lib/plans'
import CategoryForm from '@/components/admin/CategoryForm'
import Link from 'next/link'

export default async function NewCategoryPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: tenant }, { data: existingCategories }] = await Promise.all([
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
    admin.from('categories').select('id, name, order_index').eq('tenant_id', tenantId).order('order_index', { ascending: true }),
  ])
  const count = existingCategories?.length ?? 0
  const maxOrderIndex = existingCategories?.reduce((m, c) => Math.max(m, c.order_index ?? 0), -1) ?? -1
  const nextOrderIndex = maxOrderIndex + 1

  const plan = (tenant?.plan ?? 'starter') as Plan
  const limit = PLANS[plan].limits.categories
  const atLimit = limit !== Infinity && (count ?? 0) >= limit

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Nova Categoria</h1>
      {atLimit ? (
        <div className="max-w-lg bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
          <p className="text-sm font-medium text-neutral-700 mb-1">
            Limite de {limit} categoria{limit > 1 ? 's' : ''} atingido
          </p>
          <p className="text-xs text-neutral-500 mb-5">
            O plano {PLANS[plan].name} permite atÃ© {limit} categorias. FaÃ§a upgrade para criar mais.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Ver planos â†’
          </Link>
        </div>
      ) : (
        <CategoryForm defaultOrderIndex={nextOrderIndex} allCategories={existingCategories ?? []} />
      )}
    </div>
  )
}
