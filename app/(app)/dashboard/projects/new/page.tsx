import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import type { Plan } from '@/lib/mercadopago/plans'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>
}) {
  const { tenantId } = await requireTenant()
  const { categoryId } = await searchParams
  const admin = createAdminClient()

  const [{ data: categories }, { data: tenant }, { data: projectRows }] = await Promise.all([
    admin.from('categories').select('id, name').eq('tenant_id', tenantId).order('order_index'),
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
    admin.from('projects').select('category_id').eq('tenant_id', tenantId),
  ])

  const plan = (tenant?.plan ?? 'starter') as Plan
  const planData = PLANS[plan]
  const galleryLimit = planData.galleryLimit
  const maxFileSizeMB = plan === 'agency' ? 15 : plan === 'pro' ? 10 : 5

  // Compute per-category project limit and current counts
  const perCatLimit = planData.limits.projects === Infinity
    ? Infinity
    : Math.floor(planData.limits.projects / Math.max(planData.limits.categories, 1))

  const countPerCat: Record<string, number> = {}
  for (const p of projectRows ?? []) {
    countPerCat[p.category_id] = (countPerCat[p.category_id] ?? 0) + 1
  }

  // Full categories (at limit)
  const fullCategoryIds = perCatLimit === Infinity
    ? new Set<string>()
    : new Set((categories ?? []).filter(c => (countPerCat[c.id] ?? 0) >= perCatLimit).map(c => c.id))

  const selectedCategoryFull = categoryId ? fullCategoryIds.has(categoryId) : false
  const allCategoriesFull = (categories ?? []).length > 0 && (categories ?? []).every(c => fullCategoryIds.has(c.id))

  const storageReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Novo Projeto</h1>
        <Link href="/dashboard/projects" className="text-xs text-neutral-400 hover:underline">
          ← Todos os projetos
        </Link>
      </div>

      {allCategoriesFull ? (
        <div className="max-w-lg bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
          <p className="text-sm font-medium text-neutral-700 mb-1">
            Limite de {perCatLimit} projeto{perCatLimit !== 1 ? 's' : ''} por categoria atingido
          </p>
          <p className="text-xs text-neutral-500 mb-5">
            O plano {planData.name} permite até {perCatLimit} projetos por categoria. Faça upgrade para criar mais.
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Ver planos →
          </Link>
        </div>
      ) : (
        <>
          {selectedCategoryFull && (
            <div className="max-w-lg bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 p-8 text-center mb-6">
              <p className="text-sm font-medium text-neutral-700 mb-1">
                Limite de {perCatLimit} projeto{perCatLimit !== 1 ? 's' : ''} por categoria atingido
              </p>
              <p className="text-xs text-neutral-500 mb-5">
                Selecione outra categoria ou faça upgrade para criar mais projetos.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Ver planos →
              </Link>
            </div>
          )}

          {!storageReady && (
            <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm">
              <p className="font-medium text-amber-800 mb-1">Upload de arquivos não configurado</p>
              <p className="text-amber-700">
                Adicione a{' '}
                <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> no{' '}
                <code className="bg-amber-100 px-1 rounded">.env.local</code>.
              </p>
            </div>
          )}

          <ProjectForm
            categories={(categories ?? []).map(c => ({
              ...c,
              disabled: fullCategoryIds.has(c.id),
            }))}
            defaultCategoryId={categoryId}
            galleryLimit={galleryLimit}
            maxFileSizeMB={maxFileSizeMB}
          />
        </>
      )}
    </div>
  )
}
