import { createAdminClient } from '@/lib/supabase/admin'

// Supabase free tier limits
const LIMITS = {
  storageMB: 1024,       // 1 GB
  dbMB: 500,             // 500 MB
  authUsers: 50_000,
}

function UsageBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const pct = Math.min((used / total) * 100, 100)
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-xs text-neutral-500">
          {used.toLocaleString('pt-BR')} / {total.toLocaleString('pt-BR')} {unit}
          <span className={`ml-2 font-semibold ${pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
            ({pct.toFixed(1)}%)
          </span>
        </span>
      </div>
      <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function AdminStatsPage() {
  const admin = createAdminClient()

  const [
    { count: tenantsCount },
    { count: projectsCount },
    { count: categoriesCount },
    { count: profilesCount },
    { count: analyticsCount },
    { count: settingsCount },
    { count: faqsCount },
    { count: testimonialsCount },
  ] = await Promise.all([
    admin.from('tenants').select('*', { count: 'exact', head: true }),
    admin.from('projects').select('*', { count: 'exact', head: true }),
    admin.from('categories').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('analytics_events').select('*', { count: 'exact', head: true }),
    admin.from('settings').select('*', { count: 'exact', head: true }),
    admin.from('faqs').select('*', { count: 'exact', head: true }),
    admin.from('testimonials').select('*', { count: 'exact', head: true }),
  ])

  // Storage: list files per bucket (flat structure, no subfolders)
  let storageMBUsed = 0
  let storageFileCount = 0
  try {
    const BUCKETS = ['projects', 'categories', 'logo']
    const results = await Promise.all(
      BUCKETS.map((b) => admin.storage.from(b).list('', { limit: 2000 }))
    )
    for (const { data: files } of results) {
      if (!files) continue
      for (const file of files) {
        const size = file.metadata?.size
        if (typeof size === 'number') {
          storageFileCount++
          storageMBUsed += size / (1024 * 1024)
        }
      }
    }
  } catch {
    // storage unavailable
  }

  const totalRows = (tenantsCount ?? 0) + (projectsCount ?? 0) + (categoriesCount ?? 0)
    + (profilesCount ?? 0) + (analyticsCount ?? 0) + (settingsCount ?? 0)
    + (faqsCount ?? 0) + (testimonialsCount ?? 0)

  // Rough DB size estimate: ~1 KB per analytics row, ~2 KB per project, ~0.5 KB other
  const dbEstimateKB = ((analyticsCount ?? 0) * 1) + ((projectsCount ?? 0) * 2) + (totalRows * 0.5)
  const dbEstimateMB = dbEstimateKB / 1024

  const stats = [
    { label: 'Escritórios', value: tenantsCount ?? 0 },
    { label: 'Projetos', value: projectsCount ?? 0 },
    { label: 'Categorias', value: categoriesCount ?? 0 },
    { label: 'Usuários', value: profilesCount ?? 0 },
    { label: 'Analytics rows', value: analyticsCount ?? 0 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Stats</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-neutral-200 p-5">
            <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-neutral-900">{s.value.toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-neutral-900">Uso do Supabase Free Tier</h2>
          <span className="text-xs text-neutral-400">Limites do plano gratuito</span>
        </div>

        <UsageBar
          label="Storage (fotos)"
          used={parseFloat(storageMBUsed.toFixed(1))}
          total={LIMITS.storageMB}
          unit="MB"
        />
        <p className="text-xs text-neutral-400 -mt-3">
          {storageFileCount} arquivo{storageFileCount !== 1 ? 's' : ''} · ~{storageMBUsed.toFixed(1)} MB usados de 1 024 MB
        </p>

        <UsageBar
          label="Banco de dados (estimativa)"
          used={parseFloat(dbEstimateMB.toFixed(1))}
          total={LIMITS.dbMB}
          unit="MB"
        />
        <p className="text-xs text-neutral-400 -mt-3">
          {totalRows.toLocaleString('pt-BR')} linhas totais · estimativa baseada em volume de rows
        </p>

        <UsageBar
          label="Usuários autenticados"
          used={profilesCount ?? 0}
          total={LIMITS.authUsers}
          unit="usuários"
        />

        <div className="pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            ⚠️ O maior risco de estourar o free tier é o <strong>storage</strong> (fotos dos projetos).
            Considere migrar para o plano Pro do Supabase (~$25/mês) quando storage passar de 70%.
          </p>
        </div>
      </div>
    </div>
  )
}
