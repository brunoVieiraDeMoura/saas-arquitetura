import { createAdminClient } from '@/lib/supabase/admin'

export async function handlePagBankWebhook(body: string) {
  const notification = JSON.parse(body)

  // PagBank subscription notifications include id, reference_id, status
  const subscriptionId: string | undefined =
    notification.id ?? notification.subscription?.id
  const referenceId: string | undefined =
    notification.reference_id ?? notification.subscription?.reference_id
  const status: string | undefined =
    notification.status ?? notification.subscription?.status

  if (!referenceId) return

  const [tenantId, planId] = referenceId.split(':')
  if (!tenantId || !planId) return

  const admin = createAdminClient()

  if (status === 'ACTIVE') {
    await admin
      .from('tenants')
      .update({ plan: planId, stripe_subscription_id: subscriptionId ?? null })
      .eq('id', tenantId)
  } else if (status === 'CANCELED' || status === 'SUSPENDED') {
    await admin
      .from('tenants')
      .update({ plan: 'starter', stripe_subscription_id: null })
      .eq('id', tenantId)
  }
}
