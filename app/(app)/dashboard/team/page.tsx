import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { removeMember } from './actions'
import InviteForm from './_components/InviteForm'
import PendingInviteRow from './_components/PendingInviteRow'

export default async function TeamPage() {
  const { tenantId, userId } = await requireTenant()
  const admin = createAdminClient()

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, role')
    .eq('tenant_id', tenantId)

  const members = await Promise.all(
    (profiles ?? []).map(async (p) => {
      const { data: { user } } = await admin.auth.admin.getUserById(p.id)
      return { id: p.id, role: p.role as string, email: user?.email ?? p.id }
    })
  )

  const { data: invites } = await admin
    .from('tenant_invites')
    .select('id, email, expires_at, token')
    .eq('tenant_id', tenantId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arquiteturaorganizada.com.br'

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900">Equipe</h1>
        <p className="text-sm text-neutral-500 mt-1">Gerencie os membros da sua equipe.</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">
          Membros ativos <span className="text-neutral-400 font-normal">({members.length})</span>
        </h2>
        <div className="divide-y divide-neutral-100">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-neutral-900">{m.email}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {m.role === 'owner' ? 'Proprietário' : 'Membro'}
                </p>
              </div>
              {m.role !== 'owner' && m.id !== userId && (
                <form action={removeMember.bind(null, m.id)}>
                  <button type="submit" className="text-xs text-red-500 hover:underline">
                    Remover
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>

      {(invites ?? []).length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Convites pendentes</h2>
          <div className="divide-y divide-neutral-100">
            {invites!.map((inv) => (
              <PendingInviteRow
                key={inv.id}
                id={inv.id}
                email={inv.email}
                expiresAt={inv.expires_at}
                token={inv.token}
                baseUrl={baseUrl}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-1">Convidar membro</h2>
        <p className="text-xs text-neutral-400 mb-4">
          Gere um link de convite e compartilhe com o colaborador.
        </p>
        <InviteForm />
      </div>
    </div>
  )
}
