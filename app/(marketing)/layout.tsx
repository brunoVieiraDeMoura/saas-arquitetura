import MarketingNavbar from '@/components/marketing/Navbar'
import MarketingFooter from '@/components/marketing/Footer'
import WhatsAppFloat from '@/components/site/WhatsAppFloat'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      <main>{children}</main>
      <MarketingFooter />
      <WhatsAppFloat number="5521999433890" message="Olá! Gostaria de solicitar um orçamento para o meu site de portfólio de arquitetura." />
    </>
  )
}
