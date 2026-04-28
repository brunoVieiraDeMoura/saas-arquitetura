'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function acceptInvite(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/invite/${token}`)

  const admin = createAdminClient()

  const { data: invite } = await admin
    .from('tenant_invites')
    .select('id, tenant_id')
    .eq('token', token)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!invite) redirect(`/invite/${token}`)

  const { data: profile } = await admin
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (profile?.tenant_id) redirect('/dashboard')

  await admin.from('profiles').update({ tenant_id: invite.tenant_id, role: 'member' }).eq('id', user.id)
  await admin.from('tenant_invites').update({ accepted_at: new Date().toISOString() }).eq('id', invite.id)

  redirect('/dashboard')
}
