import MarketingHero from '@/components/marketing/Hero'
import MarketingFeatures from '@/components/marketing/Features'
import MarketingTestimonials from '@/components/marketing/Testimonials'
import MarketingFAQ from '@/components/marketing/FAQ'
import MarketingPricing from '@/components/marketing/Pricing'
import MarketingContact from '@/components/marketing/Contact'

export default function MarketingHomePage() {
  return (
    <>
      <MarketingHero />
      <MarketingFeatures />
      <MarketingPricing />
      <MarketingTestimonials />
      <MarketingFAQ />
      <MarketingContact />
    </>
  )
}
