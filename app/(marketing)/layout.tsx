import MarketingNavbar from '@/components/marketing/Navbar'
import MarketingFooter from '@/components/marketing/Footer'
import MobileFloatingCTA from '@/components/marketing/MobileFloatingCTA'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <MarketingFooter />
      <MobileFloatingCTA />
    </>
  )
}
