'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function ProjectSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    startTransition(() => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Buscar por nome..."
        className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
      />
      {pending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">buscando...</span>
      )}
    </div>
  )
}
