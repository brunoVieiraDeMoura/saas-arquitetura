import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_SITE_COMPLETO
    if (!priceId) {
      return NextResponse.json({ error: 'Preço não configurado.' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: 'pt-BR',
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_options: {
        card: {
          installments: { enabled: true },
        },
      },
      success_url: `${baseUrl}/?pagamento=sucesso`,
      cancel_url: `${baseUrl}/#pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout-site]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
