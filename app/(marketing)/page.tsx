import MarketingHero from '@/components/marketing/Hero'
import SocialProofStrip from '@/components/marketing/SocialProofStrip'
import MarketingTestimonials from '@/components/marketing/Testimonials'
import MarketingFeatures from '@/components/marketing/Features'
import MarketingPricing from '@/components/marketing/Pricing'
import MarketingFAQ from '@/components/marketing/FAQ'
import MarketingContact from '@/components/marketing/Contact'

export default function MarketingHomePage() {
  return (
    <>
      <MarketingHero />
      <SocialProofStrip />
      <MarketingTestimonials />
      <MarketingFeatures />
      <MarketingPricing />
      <MarketingFAQ />
      <MarketingContact />
    </>
  )
}
