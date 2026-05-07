import { createAdminClient } from '@/lib/supabase/admin'
import PlanBadge from '@/components/admin/PlanBadge'

export default async function AdminTenantsPage() {
  const admin = createAdminClient()
  const { data: tenants } = await admin
    .from('tenants')
    .select('id, name, slug, plan, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Tenants</h1>
        <p className="text-sm text-neutral-500 mt-1">{tenants?.length ?? 0} escritórios cadastrados</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        {tenants?.length ? (
          <ul className="divide-y divide-neutral-100">
            {tenants.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-neutral-800">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.slug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}</p>
                </div>
                <div className="flex items-center gap-4">
                  <PlanBadge plan={t.plan as 'starter' | 'pro' | 'agency'} />
                  <p className="text-xs text-neutral-400">
                    {new Date(t.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-neutral-400">Nenhum tenant ainda.</p>
        )}
      </div>
    </div>
  )
}
