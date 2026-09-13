import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'arquiteturaorganizada.com.br'

const RESERVED_SLUGS = new Set([
  'login', 'signup', 'onboarding', 'dashboard', 'admin',
  'api', 'pricing', 'www', 'app', '_next', 'favicon.ico', 'invite',
])

// Rotas globais do app — em domínio de tenant, vão para o domínio raiz
const APP_PATHS = new Set([
  'dashboard', 'admin', 'login', 'signup', 'onboarding',
  'forgot-password', 'reset-password', 'invite',
])

export async function proxy(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const url = req.nextUrl.clone()
  const pathname = url.pathname
  const withoutPort = hostname.split(':')[0]
  const isLocalhost = withoutPort === 'localhost' || withoutPort.endsWith('.localhost')
  const firstSegment = pathname.split('/')[1] ?? ''
  const isAppPath = APP_PATHS.has(firstSegment)

  // API é global: nunca reescrever para /[tenant] (senão vira 404)
  if (firstSegment === 'api') return NextResponse.next()

  const redirectToRoot = () =>
    NextResponse.redirect(new URL(`${pathname}${url.search}`, `https://www.${ROOT_DOMAIN}`))

  // ── Subdomain detection ──────────────────────────────────────────────────
  let subdomain: string | null = null

  if (isLocalhost) {
    const parts = withoutPort.split('.')
    if (parts.length >= 2 && parts[0] !== 'localhost') subdomain = parts[0]
  } else if (withoutPort.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = withoutPort.slice(0, -(ROOT_DOMAIN.length + 1))
  }

  if (subdomain && !RESERVED_SLUGS.has(subdomain)) {
    if (isAppPath) {
      if (!isLocalhost) return redirectToRoot()
    } else {
      url.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // ── Custom domain detection ──────────────────────────────────────────────
  const isRootDomain = withoutPort === ROOT_DOMAIN || withoutPort === `www.${ROOT_DOMAIN}`

  if (!isRootDomain && !isLocalhost && !withoutPort.endsWith(`.${ROOT_DOMAIN}`)) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tenants?custom_domain=eq.${withoutPort}&select=slug&limit=1`,
        {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          },
        }
      )
      const [tenant] = await res.json()
      if (tenant?.slug) {
        if (isAppPath) return redirectToRoot()
        url.pathname = `/${tenant.slug}${pathname === '/' ? '' : pathname}`
        return NextResponse.rewrite(url)
      }
    } catch {
      // fall through
    }
  }

  // ── Auth session refresh for app routes ──────────────────────────────────
  const isAppRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/onboarding')

  if (!isAppRoute) return NextResponse.next()

  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
