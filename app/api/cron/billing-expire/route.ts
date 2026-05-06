import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Downgrade tenants whose PIX annual subscription has expired
  const { data: expired, error } = await admin
    .from('tenants')
    .select('id')
    .neq('plan', 'starter')
    .is('stripe_subscription_id', null)
    .not('subscription_expires_at', 'is', null)
    .lt('subscription_expires_at', new Date().toISOString())

  if (error) {
    console.error('[billing-expire cron]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!expired?.length) return NextResponse.json({ expired: 0 })

  const ids = expired.map((t) => t.id)
  await admin
    .from('tenants')
    .update({ plan: 'starter', subscription_expires_at: null })
    .in('id', ids)

  return NextResponse.json({ expired: ids.length })
}
