import { NextResponse } from 'next/server'
import { verifyMPSignature, handleMPWebhook } from '@/lib/mercadopago/webhooks'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  if (token !== process.env.MP_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawBody = await req.text()

  if (!verifyMPSignature(req, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(rawBody)
  await handleMPWebhook(body)

  return NextResponse.json({ ok: true })
}
