const BASE = 'https://api.vercel.com'
const PROJECT_ID = process.env.VERCEL_PROJECT_ID!
const TOKEN = process.env.VERCEL_TOKEN!

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function addVercelDomain(domain: string) {
  const res = await fetch(`${BASE}/v10/projects/${PROJECT_ID}/domains`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name: domain }),
  })
  return res.json() as Promise<{ error?: { code: string; message: string } }>
}

export async function removeVercelDomain(domain: string) {
  await fetch(`${BASE}/v10/projects/${PROJECT_ID}/domains/${domain}`, {
    method: 'DELETE',
    headers: headers(),
  })
}

export async function getVercelDomainStatus(domain: string): Promise<'verified' | 'pending' | 'error'> {
  const res = await fetch(`${BASE}/v10/projects/${PROJECT_ID}/domains/${domain}`, {
    headers: headers(),
  })
  const data = await res.json()
  if (data.verified) return 'verified'
  if (data.error) return 'error'
  return 'pending'
}
