export type Plan = 'starter' | 'pro' | 'agency'
export type BillingCycle = 'monthly' | 'annual'

export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceAnnual: 0,
    annualDiscount: 0,
    limits: { categories: 2, projects: 6 },
    galleryLimit: 2,
    features: [
      '2 categorias',
      'Até 3 projetos por categoria',
      'Até 2 fotos por projeto',
      'Subdomínio incluído',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 13000,      // R$130/mês (mensal)
    priceAnnual: 9900, // R$99/mês (anual — cobrado R$1.188/ano)
    annualDiscount: 24,
    limits: { categories: Infinity, projects: Infinity },
    galleryLimit: 6,
    features: [
      'Categorias e projetos ilimitados',
      'Utilize seu próprio domínio',
      'Até 6 fotos por projeto',
      'Email prioritário',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 25000,        // R$250/mês (mensal)
    priceAnnual: 17000,  // R$170/mês (anual — cobrado R$2.040/ano)
    annualDiscount: 32,
    limits: { categories: Infinity, projects: Infinity },
    galleryLimit: Infinity,
    features: [
      'Tudo do Pro',
      'Fotos ilimitadas por projeto',
      'Analytics',
      'Convide até 3 usuários para sua conta',
      'Suporte ativo pelo WhatsApp',
      'Chamada privada para configurar tudo com você',
    ],
  },
} satisfies Record<Plan, {
  id: string
  name: string
  price: number
  priceAnnual: number
  annualDiscount: number
  limits: { categories: number; projects: number }
  galleryLimit: number
  features: string[]
}>

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export function getPrice(plan: typeof PLANS[Plan], billing: BillingCycle): number {
  return billing === 'annual' ? plan.priceAnnual : plan.price
}
