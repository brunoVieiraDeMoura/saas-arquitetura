import { createAdminClient } from '@/lib/supabase/admin'
import type { Plan } from './plans'

export type PriceOverride = { price: number; priceAnnual: number; annualDiscount: number }
export type PriceOverrides = Partial<Record<Plan, PriceOverride>>

export async function getPlanPrices(): Promise<PriceOverrides> {
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('plan_prices').select('plan, price_monthly, price_annual')
    if (!data?.length) return {}
    return Object.fromEntries(
      data.map((r) => {
        const monthly = r.price_monthly
        const annual = r.price_annual
        const discount = monthly > 0 ? Math.round((1 - annual / monthly) * 100) : 0
        return [r.plan, { price: monthly, priceAnnual: annual, annualDiscount: discount }]
      })
    ) as PriceOverrides
  } catch {
    return {}
  }
}
