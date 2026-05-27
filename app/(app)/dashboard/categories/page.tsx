import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import DeleteCategoryButton from './_components/DeleteCategoryButton'
import { Plus, Settings, FolderPlus } from 'lucide-react'

export default async function CategoriesPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const { data: categories } = await admin
    .from('categories')
    .select('*, projects(id)')
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Categorias</h1>
        <Link
          href="/dashboard/categories/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Categoria</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        {categories?.length ? (
          <ul className="divide-y divide-neutral-100">
            {categories.map((cat) => {
              const projCount = Array.isArray(cat.projects) ? cat.projects.length : 0
              return (
                <li key={cat.id}>
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{cat.name}</p>
                      <p className="text-xs text-neutral-400">
                        /{cat.slug} · {projCount} projeto{projCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link
                        href={`/dashboard/projects/new?categoryId=${cat.id}`}
                        className="p-2.5 sm:p-0 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 sm:hover:bg-transparent transition-colors"
                        title="Adicionar projeto"
                      >
                        <FolderPlus className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">+ Projeto</span>
                      </Link>
                      <Link
                        href={`/dashboard/categories/${cat.id}`}
                        className="p-2.5 sm:p-0 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 sm:hover:bg-transparent transition-colors"
                        title="Gerenciar"
                      >
                        <Settings className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">Gerenciar</span>
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
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
    </div>
  )
}
