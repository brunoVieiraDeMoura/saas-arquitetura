import { createAdminClient } from '@/lib/supabase/admin'

export async function handlePagBankWebhook(body: string) {
  const notification = JSON.parse(body)

  // PagBank sends different shapes for subscriptions vs one-time checkout payments
  const referenceId: string | undefined =
    notification.reference_id ??
    notification.subscription?.reference_id ??
    notification.charges?.[0]?.reference_id

  const subscriptionId: string | undefined =
    notification.id ?? notification.subscription?.id

  const status: string | undefined =
    notification.status ??
    notification.subscription?.status ??
    notification.charges?.[0]?.status

  if (!referenceId) return

  const parts = referenceId.split(':')
  if (parts.length < 2) return

  const [tenantId, planId, modifier] = parts
  const isPixAnnual = modifier === 'pix_annual'

  const admin = createAdminClient()

  if (isPixAnnual) {
    // One-time PIX upfront annual — activate on PAID/COMPLETE, set 1-year expiry
    if (status === 'PAID' || status === 'COMPLETE') {
      const expiresAt = new Date()
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      await admin
        .from('tenants')
        .update({
          plan: planId,
          stripe_subscription_id: null,
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('id', tenantId)
    }
    return
  }

  // Recurring CC subscription
  if (status === 'ACTIVE') {
    await admin
      .from('tenants')
      .update({
        plan: planId,
        stripe_subscription_id: subscriptionId ?? null,
        subscription_expires_at: null,
      })
      .eq('id', tenantId)
  } else if (status === 'CANCELED' || status === 'SUSPENDED') {
    await admin
      .from('tenants')
      .update({ plan: 'starter', stripe_subscription_id: null, subscription_expires_at: null })
      .eq('id', tenantId)
  }
}
