import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/mercadopago/plans'
import PlanBadge from '@/components/admin/PlanBadge'
import RefundButton from './_components/RefundButton'
import PricesTab from './_components/PricesTab'
import Link from 'next/link'

export default async function AdminTenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const activeTab = tab === 'prices' ? 'prices' : 'tenants'
  const admin = createAdminClient()

  const [{ data: tenants }, { data: planPricesRows }] = await Promise.all([
    admin.from('tenants').select('id, name, slug, plan, stripe_subscription_id, created_at').order('created_at', { ascending: false }),
    admin.from('plan_prices').select('*').in('plan', ['pro', 'agency']),
  ])

  const pricesMap = Object.fromEntries((planPricesRows ?? []).map((r) => [r.plan, r]))

  const initialPrices = {
    pro: {
      price_monthly: pricesMap.pro?.price_monthly ?? PLANS.pro.price,
      price_annual: pricesMap.pro?.price_annual ?? PLANS.pro.priceAnnual,
    },
    agency: {
      price_monthly: pricesMap.agency?.price_monthly ?? PLANS.agency.price,
      price_annual: pricesMap.agency?.price_annual ?? PLANS.agency.priceAnnual,
    },
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Tenants</h1>
        <p className="text-sm text-neutral-500 mt-1">{tenants?.length ?? 0} escritórios cadastrados</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit mb-6">
        {[
          { id: 'tenants', label: 'Tenants', href: '/admin/tenants' },
          { id: 'prices', label: 'Preços', href: '/admin/tenants?tab=prices' },
        ].map((t) => (
          <Link
            key={t.id}
            href={t.href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === t.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab === 'tenants' ? (
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
                    {t.stripe_subscription_id && t.plan !== 'starter' && (
                      <RefundButton tenantId={t.id} tenantName={t.name} />
                    )}
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
      ) : (
        <PricesTab initialPrices={initialPrices} />
      )}
    </div>
  )
}
