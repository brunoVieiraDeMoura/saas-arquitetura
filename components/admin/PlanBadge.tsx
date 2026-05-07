import { PLANS, type Plan } from '@/lib/plans'

export default function PlanBadge({ plan }: { plan: string }) {
  const p = PLANS[plan as Plan] ?? PLANS.starter
  const colors: Record<string, string> = {
    starter: 'bg-neutral-100 text-neutral-600',
    pro:     'bg-blue-100 text-blue-700',
    agency:  'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[plan] ?? colors.starter}`}>
      {p.name}
    </span>
  )
}
