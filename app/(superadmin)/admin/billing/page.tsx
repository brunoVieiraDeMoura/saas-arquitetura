import { createAdminClient } from '@/lib/supabase/admin'
import PlanBadge from '@/components/admin/PlanBadge'

export default async function AdminBillingPage() {
  const admin = createAdminClient()
  const { data: tenants } = await admin
    .from('tenants')
    .select('id, name, slug, plan, stripe_customer_id, stripe_subscription_id')
    .order('plan', { ascending: false })

  const counts = { starter: 0, pro: 0, agency: 0 }
  tenants?.forEach((t) => { if (t.plan in counts) counts[t.plan as keyof typeof counts]++ })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Billing</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.entries(counts) as [string, number][]).map(([plan, count]) => (
          <div key={plan} className="bg-white rounded-xl border border-neutral-200 p-5">
            <p className="text-xs text-neutral-500 mb-1 capitalize">{plan}</p>
            <p className="text-3xl font-bold text-neutral-900">{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        <ul className="divide-y divide-neutral-100">
          {tenants?.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">{t.name}</p>
                <p className="text-xs text-neutral-400">{t.slug}</p>
              </div>
              <div className="flex items-center gap-4">
                <PlanBadge plan={t.plan as 'starter' | 'pro' | 'agency'} />
                {t.stripe_subscription_id && (
                  <span className="text-xs text-green-600">ativo</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
