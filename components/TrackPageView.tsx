'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type Props = { tenantId: string; projectId?: string }

export default function TrackPageView({ tenantId, projectId }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, projectId, path: pathname }),
      signal: controller.signal,
    }).catch(() => {})
    return () => controller.abort()
  }, [pathname, tenantId, projectId])

  return null
}
