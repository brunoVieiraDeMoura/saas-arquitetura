import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { acceptInvite, acceptInviteForce } from './actions'
import AcceptButtons from './_components/AcceptButtons'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: invite } = await admin
    .from('tenant_invites')
    .select('id, email, expires_at, accepted_at, tenants(name)')
    .eq('token', token)
    .single()

  const isValid = invite && !invite.accepted_at && new Date(invite.expires_at) > new Date()

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-lg">✕</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">Convite inválido</h1>
          <p className="text-sm text-neutral-500 mb-6">Este convite expirou ou já foi utilizado.</p>
          <Link href="/login" className="text-sm font-medium text-neutral-900 underline">
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const tenantName = (invite.tenants as any)?.name ?? 'Escritório'
  const initial = tenantName[0]?.toUpperCase() ?? 'E'

  let userProfile: { tenant_id: string | null; role: string | null } | null = null
  if (user) {
    const admin = createAdminClient()
    const { data } = await admin.from('profiles').select('tenant_id, role').eq('id', user.id).single()
    userProfile = data
  }

  const isOwnerConflict = userProfile?.role === 'owner' && !!userProfile?.tenant_id
  const isMemberConflict = userProfile?.role === 'member' && !!userProfile?.tenant_id

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">{initial}</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-1">Você foi convidado</h1>
          <p className="text-sm text-neutral-500">
            Para colaborar no portfólio{' '}
            <span className="font-medium text-neutral-700">{tenantName}</span>
          </p>
        </div>

        {!user ? (
          <div className="space-y-3">
            <Link
              href={`/signup?invite=${token}`}
              className="block w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors text-center"
            >
              Criar conta e aceitar
            </Link>
            <Link
              href={`/login?next=/invite/${token}`}
              className="block w-full py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors text-center"
            >
              Já tenho conta — Entrar
            </Link>
          </div>
        ) : isOwnerConflict ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-700">
              Você é o proprietário de outro escritório. Não é possível aceitar um convite sem antes excluir sua conta atual.
            </div>
            <Link
              href="/dashboard"
              className="block w-full py-3 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors text-center"
            >
              Voltar ao meu escritório
            </Link>
          </div>
        ) : (
          <AcceptButtons
            token={token}
            hasConflict={isMemberConflict}
            acceptInvite={acceptInvite}
            acceptInviteForce={acceptInviteForce}
          />
        )}
      </div>
    </div>
  )
}
