import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Plan } from '@/lib/plans'
import Sidebar from '@/components/admin/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tenantSlug, tenantId } = await requireTenant()
  const admin = createAdminClient()
  const { data: tenant } = await admin.from('tenants').select('plan').eq('id', tenantId).single()
  const plan = (tenant?.plan ?? 'starter') as Plan

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-50">
      <Sidebar tenantSlug={tenantSlug} plan={plan} />
      <main className="flex-1 px-6 py-8 pt-22 md:pt-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
