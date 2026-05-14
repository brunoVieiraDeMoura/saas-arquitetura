'use server'

import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveTheme(section: string, value: string) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()
  await admin
    .from('settings')
    .upsert(
      { tenant_id: tenantId, key: `theme_${section}`, value },
      { onConflict: 'tenant_id,key' }
    )
  revalidatePath('/dashboard/temas')
}
