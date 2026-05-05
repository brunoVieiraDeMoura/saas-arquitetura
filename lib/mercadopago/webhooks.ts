import crypto from 'crypto'
import { PreApproval } from 'mercadopago'
import { mp } from './client'
import { createAdminClient } from '@/lib/supabase/admin'

function verifySignature(dataId: string, xSignature: string, xRequestId: string): boolean {
  let ts = '', hash = ''
  for (const part of xSignature.split(',')) {
    const [k, v] = part.split('=')
    if (k?.trim() === 'ts') ts = v?.trim() ?? ''
    if (k?.trim() === 'v1') hash = v?.trim() ?? ''
  }
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
    .update(manifest)
    .digest('hex')
  return expected === hash
}

export async function handleMPWebhook(
  body: string,
  xSignature: string,
  xRequestId: string,
  dataId: string,
) {
  if (!verifySignature(dataId, xSignature, xRequestId)) {
    throw new Error('Invalid webhook signature')
  }

  const notification = JSON.parse(body)
  if (!['subscription_preapproval', 'payment'].includes(notification.type)) return

  const preApproval = new PreApproval(mp)
  const sub = await preApproval.get({ id: dataId })
  if (!sub?.external_reference) return

  const [tenantId, planId] = sub.external_reference.split(':')
  if (!tenantId || !planId) return

  const admin = createAdminClient()

  if (sub.status === 'authorized') {
    await admin
      .from('tenants')
      .update({ plan: planId, stripe_subscription_id: sub.id })
      .eq('id', tenantId)
  } else if (sub.status === 'cancelled' || sub.status === 'paused') {
    await admin
      .from('tenants')
      .update({ plan: 'starter', stripe_subscription_id: null })
      .eq('id', tenantId)
  }
}
