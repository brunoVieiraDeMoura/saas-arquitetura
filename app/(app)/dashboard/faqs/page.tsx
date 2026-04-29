import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import FAQsManager from './_components/FAQsManager'

export default async function FAQsPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()
  const { data: faqs } = await admin
    .from('faqs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">FAQs</h1>
      <FAQsManager initial={faqs ?? []} />
    </div>
  )
}
