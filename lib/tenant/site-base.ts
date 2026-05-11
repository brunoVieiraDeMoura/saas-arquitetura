import { headers } from 'next/headers'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'arquiteturaorganizada.com.br'

export async function getSiteBase(slug: string): Promise<string> {
  const h = await headers()
  const host = (h.get('host') || '').split(':')[0]
  const isMainDomain = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`
  return isMainDomain ? `/${slug}` : ''
}
