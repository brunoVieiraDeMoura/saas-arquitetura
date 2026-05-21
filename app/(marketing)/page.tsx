import MarketingHero from '@/components/marketing/Hero'
import SocialProofStrip from '@/components/marketing/SocialProofStrip'
import DemoSection from '@/components/marketing/DemoSection'
import MarketingFeatures from '@/components/marketing/Features'
import MarketingTestimonials from '@/components/marketing/Testimonials'
import MarketingPricing from '@/components/marketing/Pricing'
import MarketingFAQ from '@/components/marketing/FAQ'
import MarketingContact from '@/components/marketing/Contact'

export default function MarketingHomePage() {
  return (
    <>
      <MarketingHero />
      <SocialProofStrip />
      <DemoSection />
      <MarketingFeatures />
      <MarketingTestimonials />
      <MarketingPricing />
      <MarketingFAQ />
      <MarketingContact />
    </>
  )
}
