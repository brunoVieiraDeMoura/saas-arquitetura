import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import TestimonialsManager from './_components/TestimonialsManager'

export default async function TestimonialsPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()
  const { data: testimonials } = await admin
    .from('testimonials')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Depoimentos</h1>
      <TestimonialsManager initial={testimonials ?? []} />
    </div>
  )
}
