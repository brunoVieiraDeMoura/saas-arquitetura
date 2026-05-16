import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/plans'
import type { Plan } from '@/lib/plans'
import Link from 'next/link'
import DeleteProjectButton from './_components/DeleteProjectButton'
import ProjectSearch from './_components/ProjectSearch'
import { Plus, Pencil, Lock } from 'lucide-react'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: tenant }, { data: projects }] = await Promise.all([
    admin.from('tenants').select('plan').eq('id', tenantId).single(),
    (() => {
      let query = admin
        .from('projects')
        .select('id, title, date, is_featured, category_id, categories(name)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
      if (q) query = query.ilike('title', `%${q}%`)
      return query
    })(),
  ])

  const plan = (tenant?.plan ?? 'starter') as Plan
  const planData = PLANS[plan]
  const perCatLimit = planData.limits.projects === Infinity
    ? Infinity
    : Math.floor(planData.limits.projects / Math.max(planData.limits.categories, 1))


  const totalLimit = planData.limits.projects
  const totalCount = projects?.length ?? 0
  const atTotalLimit = totalLimit !== Infinity && totalCount >= totalLimit

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900">Projetos</h1>
          {totalLimit !== Infinity && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${atTotalLimit ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-500'}`}>
              {totalCount}/{totalLimit}
            </span>
          )}
        </div>
        {atTotalLimit ? (
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-500 text-sm font-medium opacity-60 cursor-not-allowed"
            title="Limite atingido â€” faÃ§a upgrade"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limite atingido</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Projeto</span>
          </Link>
        )}
      </div>

      {atTotalLimit && (
        <div className="mb-4 rounded-xl border border-dashed border-neutral-200 p-4 flex items-center justify-between bg-neutral-50">
          <p className="text-xs text-neutral-500">
            Plano {planData.name}: limite de {totalLimit} projetos atingido.
          </p>
          <Link href="/dashboard/billing" className="text-xs font-medium text-neutral-900 underline">
            Fazer upgrade
          </Link>
        </div>
      )}

      <ProjectSearch defaultValue={q ?? ''} />

      <div className="bg-white rounded-xl border border-neutral-200 mt-4">
        {projects?.length ? (
          <ul className="divide-y divide-neutral-100">
            {projects.map((p, index) => {
              const isOverLimit = totalLimit !== Infinity && index >= totalLimit
              return (
                <li key={p.id} className={isOverLimit ? 'opacity-60' : ''}>
                  {isOverLimit && (
                    <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-100">
                      <p className="text-xs text-amber-700 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 shrink-0" />
                        Oculto no site â€” limite de {totalLimit} projetos do plano Starter
                      </p>
                      <Link href="/dashboard/billing" className="text-xs font-semibold text-amber-800 underline shrink-0">
                        Fazer upgrade
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-800">{p.title}</p>
                        {p.is_featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Destaque</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">
                        {/* @ts-ignore */}
                        {p.categories?.name} Â· {p.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link
                        href={`/dashboard/projects/${p.id}/edit`}
                        className="p-2.5 sm:p-0 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 sm:hover:bg-transparent transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5 sm:hidden" />
                        <span className="hidden sm:inline text-xs hover:underline">Editar</span>
                      </Link>
                      <DeleteProjectButton id={p.id} title={p.title} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-neutral-400">
            {q ? `Nenhum projeto encontrado para "${q}".` : 'Nenhum projeto cadastrado ainda. '}
            {!q && <Link href="/dashboard/projects/new" className="underline">Criar primeiro projeto</Link>}
          </div>
        )}
      </div>
    </div>
  )
}
