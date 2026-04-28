import MarketingPricing from '@/components/marketing/Pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Escolha o plano ideal para o seu escritório de arquitetura.',
}

export default function PricingPage() {
  return <MarketingPricing />
}
