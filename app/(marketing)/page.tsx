import MarketingHero from '@/components/marketing/Hero'
import MarketingFeatures from '@/components/marketing/Features'
import MarketingTestimonials from '@/components/marketing/Testimonials'
import MarketingFAQ from '@/components/marketing/FAQ'
import MarketingPricing from '@/components/marketing/Pricing'
import MarketingContact from '@/components/marketing/Contact'
import { getPlanPrices } from '@/lib/mercadopago/getPlanPrices'

export default async function MarketingHomePage() {
  const priceOverrides = await getPlanPrices()
  return (
    <>
      <MarketingHero />
      <MarketingFeatures />
      <MarketingPricing priceOverrides={priceOverrides} />
      <MarketingTestimonials />
      <MarketingFAQ />
      <MarketingContact />
    </>
  )
}
