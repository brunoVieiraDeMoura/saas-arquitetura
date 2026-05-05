import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryForm from '@/components/admin/CategoryForm'
import DeleteProjectButton from '@/app/(app)/dashboard/projects/_components/DeleteProjectButton'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: category }, { data: projects }, { data: allCategories }] = await Promise.all([
    admin.from('categories').select('*').eq('id', id).eq('tenant_id', tenantId).single(),
    admin
      .from('projects')
      .select('id, title, date, is_featured, slug')
      .eq('category_id', id)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false }),
    admin.from('categories').select('id, name, order_index').eq('tenant_id', tenantId).order('order_index', { ascending: true }),
  ])

  if (!category) notFound()

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard/categories" className="text-xs text-neutral-400 hover:underline mb-1 block">
              ← Categorias
            </Link>
            <h1 className="text-2xl font-semibold text-neutral-900">{category.name}</h1>
          </div>
        </div>
        <CategoryForm initial={category} allCategories={allCategories ?? []} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Projetos
            {projects && projects.length > 0 && (
              <span className="ml-2 text-sm font-normal text-neutral-400">({projects.length})</span>
            )}
          </h2>
          <Link
            href={`/dashboard/projects/new?categoryId=${id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            + Novo Projeto
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200">
          {projects && projects.length > 0 ? (
            <ul className="divide-y divide-neutral-100">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-800">{p.title}</p>
                      {p.is_featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Destaque</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">{p.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/projects/${p.id}/edit`} className="text-xs text-neutral-500 hover:underline">
                      Editar
                    </Link>
                    <DeleteProjectButton id={p.id} title={p.title} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center text-sm text-neutral-400">
              Nenhum projeto nesta categoria.{' '}
              <Link href={`/dashboard/projects/new?categoryId=${id}`} className="underline text-neutral-600">
                Criar primeiro projeto
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
