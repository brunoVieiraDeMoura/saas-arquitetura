import crypto from 'crypto'
import { PreApproval } from 'mercadopago'
import { mp } from './client'
import { createAdminClient } from '@/lib/supabase/admin'

export function verifyMPSignature(req: Request, rawBody: string): boolean {
  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  const url = new URL(req.url)
  const dataId = url.searchParams.get('data.id')

  if (!xSignature) return false

  const parts = Object.fromEntries(xSignature.split(',').map((p) => p.split('=')))
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const parts2: string[] = []
  if (dataId) parts2.push(`id:${dataId}`)
  if (xRequestId) parts2.push(`request-id:${xRequestId}`)
  parts2.push(`ts:${ts}`)

  const template = parts2.join(';') + ';'
  const secret = process.env.MP_WEBHOOK_SECRET!
  const computed = crypto.createHmac('sha256', secret).update(template).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1))
}

export async function handleMPWebhook(body: MPWebhookPayload) {
  const admin = createAdminClient()

  if (body.type === 'subscription_preapproval') {
    const preapproval = new PreApproval(mp)
    const sub = await preapproval.get({ id: body.data.id })

    const externalRef = sub.external_reference // format: tenantId:planId:billing
    if (!externalRef) return

    const [tenantId, planId] = externalRef.split(':')
    if (!tenantId || !planId) return

    if (sub.status === 'authorized') {
      await admin
        .from('tenants')
        .update({ plan: planId, subscription_id: sub.id })
        .eq('id', tenantId)
    } else if (sub.status === 'cancelled' || sub.status === 'paused') {
      await admin
        .from('tenants')
        .update({ plan: 'starter', subscription_id: null })
        .eq('id', tenantId)
    }
  }
}

type MPWebhookPayload = {
  type: string
  action: string
  data: { id: string }
  api_version: string
  date_created: string
  user_id: number
}
