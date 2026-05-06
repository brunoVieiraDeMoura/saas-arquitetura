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
    const raw = await res.text()
    let detail: any
    try { detail = JSON.parse(raw) } catch { detail = raw }
    console.error(`[PagBank ${res.status}] ${base}${path}`, detail)
    const err = Object.assign(
      new Error(`PagBank ${res.status} ${path}: ${raw.slice(0, 300)}`),
      { status: res.status, cause: detail },
    )
    throw err
  }

  if (res.status === 204) return null
  return res.json()
}
