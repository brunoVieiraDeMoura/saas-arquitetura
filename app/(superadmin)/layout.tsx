import { requireSuperAdmin } from '@/lib/tenant/guard'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin()
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-0.5 bg-red-100 text-red-700 rounded-full">SUPERADMIN</span>
            <span className="text-sm font-semibold text-neutral-900">Painel Geral</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-neutral-500">
            <a href="/admin/tenants" className="hover:text-neutral-900 transition-colors">Tenants</a>
            <a href="/admin/billing" className="hover:text-neutral-900 transition-colors">Billing</a>
            <a href="/admin/stats" className="hover:text-neutral-900 transition-colors">Stats</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
