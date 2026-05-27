import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import ProjectForm from '@/components/admin/ProjectForm'
import Link from 'next/link'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>
}) {
  const { tenantId } = await requireTenant()
  const { categoryId } = await searchParams
  const admin = createAdminClient()

  const { data: categories } = await admin
    .from('categories')
    .select('id, name')
    .eq('tenant_id', tenantId)
    .order('order_index')

  const storageReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Novo Projeto</h1>
        <Link href="/dashboard/projects" className="text-xs text-neutral-400 hover:underline">
          ← Todos os projetos
        </Link>
      </div>

      {!storageReady && (
        <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm">
          <p className="font-medium text-amber-800 mb-1">Upload de arquivos não configurado</p>
          <p className="text-amber-700">
            Adicione a{' '}
            <code className="bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> no{' '}
            <code className="bg-amber-100 px-1 rounded">.env.local</code>.
          </p>
        </div>
      )}

      <ProjectForm
        categories={categories ?? []}
        defaultCategoryId={categoryId}
        maxFileSizeMB={15}
      />
    </div>
  )
}
