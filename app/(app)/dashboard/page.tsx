import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function DashboardPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ count: categoriesCount }, { count: projectsCount }] = await Promise.all([
    admin.from('categories').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    admin.from('projects').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
  ])

  const { data: recentProjects } = await admin
    .from('projects')
    .select('id, title, date, categories(name)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Visão Geral</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500 mb-1">Categorias</p>
          <p className="text-3xl font-bold text-neutral-900">{categoriesCount ?? 0}</p>
          <Link href="/dashboard/categories" className="text-xs text-neutral-400 hover:underline mt-2 inline-block">
            Gerenciar →
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500 mb-1">Projetos</p>
          <p className="text-3xl font-bold text-neutral-900">{projectsCount ?? 0}</p>
          <Link href="/dashboard/projects" className="text-xs text-neutral-400 hover:underline mt-2 inline-block">
            Gerenciar →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-sm font-medium text-neutral-900">Projetos Recentes</h2>
        </div>
        <ul className="divide-y divide-neutral-100">
          {recentProjects?.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">{p.title}</p>
                <p className="text-xs text-neutral-400">
                  {/* @ts-ignore */}
                  {p.categories?.name} · {p.date}
                </p>
              </div>
              <Link href={`/dashboard/projects/${p.id}/edit`} className="text-xs text-neutral-400 hover:underline">
                Editar
              </Link>
            </li>
          ))}
          {!recentProjects?.length && (
            <li className="px-6 py-8 text-center text-sm text-neutral-400">
              Nenhum projeto cadastrado ainda.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
