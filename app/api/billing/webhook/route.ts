import { NextRequest, NextResponse } from 'next/server'
import { handleMPWebhook } from '@/lib/mercadopago/webhooks'

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''
  const dataId = req.nextUrl.searchParams.get('data.id') ?? ''

  if (!xSignature || !xRequestId || !dataId) {
    return NextResponse.json({ error: 'Missing signature or data id' }, { status: 400 })
  }

  try {
    await handleMPWebhook(body, xSignature, xRequestId, dataId)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  return NextResponse.json({ received: true })
}
