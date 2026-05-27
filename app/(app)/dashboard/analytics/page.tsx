import { requireTenant } from '@/lib/tenant/guard'
import { createAdminClient } from '@/lib/supabase/admin'

function AreaChart({ data }: { data: [string, number][] }) {
  const W = 560
  const H = 110
  const PL = 28, PR = 8, PT = 10, PB = 24

  const chartW = W - PL - PR
  const chartH = H - PT - PB
  const maxVal = Math.max(...data.map(([, v]) => v), 1)

  const pts = data.map(([, v], i) => ({
    x: PL + (i / (data.length - 1)) * chartW,
    y: PT + chartH * (1 - v / maxVal),
    v,
  }))

  let linePath = `M ${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2
    linePath += ` C ${cpx},${pts[i - 1].y} ${cpx},${pts[i].y} ${pts[i].x},${pts[i].y}`
  }

  const bottom = PT + chartH
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${bottom} L ${pts[0].x},${bottom} Z`

  const yTicks = [0, Math.ceil(maxVal / 2), maxVal]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28 sm:h-32">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171717" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#171717" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {yTicks.map((tick, i) => {
        const y = PT + chartH * (1 - tick / maxVal)
        return (
          <g key={i}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f0f0" strokeWidth="1" />
            <text x={PL - 5} y={y + 3.5} textAnchor="end" fontSize="9" fill="#a3a3a3">{tick}</text>
          </g>
        )
      })}

      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={linePath} fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {pts.map((pt, i) => pt.v > 0 ? (
        <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="white" stroke="#171717" strokeWidth="1.5" />
      ) : null)}

      {data.map(([day], i) => (
        <text key={i} x={pts[i].x} y={H - 5} textAnchor="middle" fontSize="9" fill="#a3a3a3">
          {day.slice(5)}
        </text>
      ))}
    </svg>
  )
}

export default async function AnalyticsPage() {
  const { tenantId } = await requireTenant()
  const admin = createAdminClient()

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const since7  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: views30, error: e30 },
    { data: views7 },
    { data: projViews },
  ] = await Promise.all([
    admin.from('page_views').select('id').eq('tenant_id', tenantId).gte('created_at', since30),
    admin.from('page_views').select('id, created_at').eq('tenant_id', tenantId).gte('created_at', since7),
    admin.from('page_views').select('project_id').eq('tenant_id', tenantId).not('project_id', 'is', null).gte('created_at', since30),
  ])

  if (e30?.message?.includes('does not exist')) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Analytics</h1>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-sm font-medium text-amber-800 mb-2">Tabela não criada</p>
          <p className="text-sm text-amber-700">Execute o SQL de configuração no Supabase para habilitar o analytics.</p>
        </div>
      </div>
    )
  }

  const dayMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dayMap[d.toISOString().split('T')[0]] = 0
  }
  for (const v of (views7 ?? [])) {
    const day = (v.created_at as string).split('T')[0]
    if (day in dayMap) dayMap[day]++
  }
  const days = Object.entries(dayMap)

  const projCount: Record<string, number> = {}
  for (const v of (projViews ?? [])) {
    const pid = v.project_id as string
    projCount[pid] = (projCount[pid] ?? 0) + 1
  }
  const topIds = Object.entries(projCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id)
  const { data: topProjects } = topIds.length > 0
    ? await admin.from('projects').select('id, title').in('id', topIds)
    : { data: [] }
  const topList = topIds.map(id => ({
    title: topProjects?.find(p => p.id === id)?.title ?? 'Projeto',
    count: projCount[id],
  }))

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Visitas ao seu site público.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
          <p className="text-xs text-neutral-500 mb-1">Últimos 7 dias</p>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{views7?.length ?? 0}</p>
          <p className="text-xs text-neutral-400 mt-1">visitas</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
          <p className="text-xs text-neutral-500 mb-1">Últimos 30 dias</p>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{views30?.length ?? 0}</p>
          <p className="text-xs text-neutral-400 mt-1">visitas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4 sm:mb-5">Visitas por dia — últimos 7 dias</h2>
        <AreaChart data={days} />
      </div>

      {topList.length > 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4 sm:mb-5">Projetos mais vistos — 30 dias</h2>
          <div className="space-y-3">
            {topList.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-1">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 w-5 text-xs text-neutral-400 font-medium">{i + 1}</span>
                  <span className="text-sm text-neutral-800 truncate">{p.title}</span>
                </div>
                <span className="shrink-0 text-xs font-medium text-neutral-500 whitespace-nowrap">{p.count} visitas</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 text-center">
          <p className="text-sm text-neutral-500">Nenhum projeto visitado nos últimos 30 dias.</p>
        </div>
      )}
    </div>
  )
}
