import { NextRequest, NextResponse } from 'next/server'
import { handlePagBankWebhook } from '@/lib/pagbank/webhooks'

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!token || token !== process.env.PAGBANK_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.text()

  try {
    await handlePagBankWebhook(body)
  } catch (err: any) {
    console.error('[PagBank webhook error]', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  return NextResponse.json({ received: true })
}
