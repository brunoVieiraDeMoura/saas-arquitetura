import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import type { Plan } from '@/lib/mercadopago/plans'
import Link from 'next/link'
import DeleteCategoryButton from './_components/DeleteCategoryButton'
import { Plus, Settings, FolderPlus, Lock } from 'lucide-react'

export default async function CategoriesPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: tenant }, { data: categories }] = await Promise.all([
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
    admin.from('categories').select('*, projects(id)').eq('tenant_id', tenantId).order('order_index', { ascending: true }),
  ])

  const plan = (tenant?.plan ?? 'starter') as Plan
  const catLimit = PLANS[plan].limits.categories
  const count = categories?.length ?? 0
  const atCatLimit = catLimit !== Infinity && count >= catLimit

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Categorias</h1>
          {catLimit !== Infinity && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${atCatLimit ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-500'}`}>
              {count}/{catLimit}
            </span>
          )}
        </div>
        {atCatLimit ? (
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-500 text-sm font-medium cursor-not-allowed opacity-60"
            title="Limite atingido — faça upgrade"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limite atingido</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/categories/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Categoria</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        {categories?.length ? (
          <ul className="divide-y divide-neutral-100">
            {categories.map((cat) => {
              const projCount = Array.isArray(cat.projects) ? cat.projects.length : 0
              const projLimit = PLANS[plan].limits.projects === Infinity
                ? Infinity
                : Math.floor(PLANS[plan].limits.projects / Math.max(PLANS[plan].limits.categories, 1))
              const atProjLimit = projLimit !== Infinity && projCount >= projLimit

              return (
                <li key={cat.id} className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{cat.name}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                      /{cat.slug} ·{' '}
                      <span className={atProjLimit ? 'text-red-500 font-medium' : ''}>
                        {projCount}{projLimit !== Infinity ? `/${projLimit}` : ''} projeto{projCount !== 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {atProjLimit ? (
                      <span className="p-1.5 sm:p-0 text-neutral-300 cursor-not-allowed" title="Limite de projetos atingido">
                        <Lock className="w-4 h-4 sm:hidden" />
                        <span className="hidden sm:inline text-xs text-neutral-400">Limite atingido</span>
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/projects/new?categoryId=${cat.id}`}
                        className="p-1.5 sm:p-0 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 sm:hover:bg-transparent transition-colors"
                        title="Adicionar projeto"
                      >
                        <FolderPlus className="w-4 h-4 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">+ Projeto</span>
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/categories/${cat.id}`}
                      className="p-1.5 sm:p-0 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 sm:hover:bg-transparent transition-colors"
                      title="Gerenciar"
                    >
                      <Settings className="w-4 h-4 sm:hidden" />
                      <span className="hidden sm:inline text-xs hover:underline">Gerenciar</span>
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-neutral-400">
            Nenhuma categoria criada ainda.{' '}
            <Link href="/dashboard/categories/new" className="underline">
              Criar primeira categoria
            </Link>
          </div>
        )}
      </div>

      {catLimit !== Infinity && atCatLimit && (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-200 p-4 flex items-center justify-between bg-neutral-50">
          <p className="text-xs text-neutral-500">
            Plano {PLANS[plan].name}: limite de {catLimit} categorias atingido.
          </p>
          <Link href="/dashboard/billing" className="text-xs font-medium text-neutral-900 underline">
            Fazer upgrade
          </Link>
        </div>
      )}
    </div>
  )
}
