'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MobileFloatingCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href="/signup"
        className="block w-full py-3.5 rounded-xl bg-neutral-900 text-white font-semibold text-center text-sm"
      >
        Criar meu site grátis →
      </Link>
    </div>
  )
}
