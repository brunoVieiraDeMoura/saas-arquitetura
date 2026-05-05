import MarketingPricing from '@/components/marketing/Pricing'
import { getPlanPrices } from '@/lib/mercadopago/getPlanPrices'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Escolha o plano ideal para o seu escritório de arquitetura.',
}

export default async function PricingPage() {
  const priceOverrides = await getPlanPrices()
  return <MarketingPricing priceOverrides={priceOverrides} />
}
