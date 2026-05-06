import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlanPrices } from '@/lib/mercadopago/getPlanPrices'
import BillingPanel from '@/components/admin/BillingPanel'

export default async function BillingPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const [{ data: tenant }, priceOverrides] = await Promise.all([
    admin.from('tenants').select('plan, stripe_subscription_id, subscription_expires_at, name').eq('id', tenantId).single(),
    getPlanPrices(),
  ])

  const hasActivePixAnnual =
    tenant?.subscription_expires_at != null &&
    new Date(tenant.subscription_expires_at) > new Date()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Plano & Cobrança</h1>
        <p className="text-sm text-neutral-500 mt-1">Gerencie seu plano e informações de pagamento.</p>
      </div>
      <BillingPanel
        currentPlan={(tenant?.plan ?? 'starter') as 'starter' | 'pro' | 'agency'}
        hasSubscription={Boolean(tenant?.stripe_subscription_id) || hasActivePixAnnual}
        subscriptionExpiresAt={tenant?.subscription_expires_at ?? null}
        companyName={tenant?.name ?? ''}
        priceOverrides={priceOverrides}
      />
    </div>
  )
}
