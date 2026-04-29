export type Plan = 'starter' | 'pro' | 'agency'

export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
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
    price: 9900,
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
    price: 16700,
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
