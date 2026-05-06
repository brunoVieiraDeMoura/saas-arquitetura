const IS_PROD = process.env.PAGBANK_ENV === 'production'

export const PAGBANK_BASE = IS_PROD
  ? 'https://api.pagseguro.com'
  : 'https://sandbox.api.pagseguro.com'

export const PAGBANK_SUBS_BASE = IS_PROD
  ? 'https://api.assinaturas.pagseguro.com'
  : 'https://sandbox.api.assinaturas.pagseguro.com'

export async function pagbankFetch(
  path: string,
  options: RequestInit = {},
  base: string = PAGBANK_BASE,
): Promise<any> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.PAGBANK_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    let detail: any
    try { detail = await res.json() } catch { detail = {} }
    const err = Object.assign(
      new Error(`PagBank ${res.status} ${path}`),
      { status: res.status, cause: detail },
    )
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}
