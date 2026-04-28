'use server'

import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

export async function createInvite(_prev: unknown, formData: FormData) {
  const { tenantId, userId } = await requireTenant()
  const email = (formData.get('email') as string | null)?.trim()

  if (!email) return { error: 'Email é obrigatório' }

  const admin = createAdminClient()

  const { count } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  if ((count ?? 0) >= 3) return { error: 'Limite de 3 membros atingido' }

  const token = randomBytes(32).toString('hex')

  const { error } = await admin
    .from('tenant_invites')
    .insert({
      tenant_id: tenantId,
      email,
      token,
      created_by: userId,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    })

  if (error) {
    console.error('[createInvite]', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard/team')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arquiteturaorganizada.com.br'
  return { inviteUrl: `${baseUrl}/invite/${token}` }
}

export async function removeMember(memberId: string) {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  await admin
    .from('profiles')
    .update({ tenant_id: null, role: 'owner' })
    .eq('id', memberId)
    .eq('tenant_id', tenantId)

  revalidatePath('/dashboard/team')
}
