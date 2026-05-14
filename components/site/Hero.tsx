'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  slug: string
  main_image: string
  date: string
  categories: { name: string; slug: string } | null
}

type Props = { projects: Project[]; tenantSlug: string; theme?: number }

export default function Hero({ projects, tenantSlug, theme = 1 }: Props) {
  const pathname = usePathname()
  const base = pathname.startsWith(`/${tenantSlug}`) ? `/${tenantSlug}` : ''
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (projects.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % projects.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length])

  if (!projects.length) return null

  const project = projects[current]

  function goTo(i: number) { setCurrent(i); startTimer() }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) < 40) return
    goTo(delta > 0 ? (current + 1) % projects.length : (current - 1 + projects.length) % projects.length)
    touchStartX.current = null
  }

  const projectHref = `${base}/${project.categories?.slug ?? 'projetos'}/${project.slug}`

  // ── Style 2: Centered fullscreen ──────────────────────────────────────────
  if (theme === 2) {
    return (
      <section
        className="relative h-[100svh] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {projects.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.main_image} alt={p.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          {project.categories && (
            <span className="text-xs font-medium text-white/60 uppercase tracking-[0.25em] mb-4 block">
              {project.categories.name}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-3xl">
            {project.title}
          </h1>
          <Link href={projectHref}
            className="inline-flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors border border-white/40 px-6 py-3 rounded-full hover:bg-white/10">
            Ver Projeto →
          </Link>
        </div>

        {projects.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
            {projects.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`} />
            ))}
          </div>
        )}
      </section>
    )
  }

  // ── Style 3: Minimal editorial ────────────────────────────────────────────
  if (theme === 3) {
    return (
      <section
        className="relative overflow-hidden bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photo: 65svh */}
        <div className="relative h-[65svh] overflow-hidden">
          {projects.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={p.main_image} alt={p.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
          ))}
          {projects.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
              {projects.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/50 w-1'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Text bar */}
        <div className="px-6 py-8 sm:py-10 max-w-[1000px] mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            {project.categories && (
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2 block">
                {project.categories.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight" style={{ color: 'var(--site-title)' }}>
              {project.title}
            </h1>
          </div>
          <Link href={projectHref}
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium border border-neutral-300 px-5 py-3 rounded-lg hover:bg-neutral-50 transition-colors"
            style={{ color: 'var(--site-title)' }}>
            Ver Projeto →
          </Link>
        </div>
      </section>
    )
  }

  // ── Style 1 (default): Split ──────────────────────────────────────────────
  return (
    <section className="relative h-[100svh] overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Mobile */}
      <div className="md:hidden absolute inset-0">
        {projects.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={p.main_image} alt={p.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8">
          <div className="mb-8">
            {project.categories && (
              <span className="text-xs font-medium text-white/70 uppercase tracking-widest mb-3 block">
                {project.categories.name}
              </span>
            )}
            <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">{project.title}</h1>
            <Link href={projectHref}
              className="inline-flex items-center text-sm text-white border border-white/50 px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Ver Projeto →
            </Link>
          </div>
          {projects.length > 1 && (
            <div className="flex gap-2">
              {projects.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-full">
        <div className="relative overflow-hidden flex-1">
          {projects.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={p.main_image} alt={p.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        </div>
        {projects.length > 1 && (
          <div className="w-52 flex flex-col">
            {projects.map((p, i) => (
              <button key={p.id} onClick={() => goTo(i)} aria-label={`Projeto ${i + 1}`}
                className={`flex-1 relative overflow-hidden transition-opacity duration-300 ${i === current ? 'opacity-100' : 'opacity-35 hover:opacity-70'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.main_image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
                {i === current && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white" />}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-medium line-clamp-1">{p.title}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block absolute bottom-14 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="max-w-xl pointer-events-auto">
            {project.categories && (
              <span className="text-xs font-medium text-white/60 uppercase tracking-[0.2em] mb-4 block">
                {project.categories.name}
              </span>
            )}
            <h1 className="text-6xl font-bold text-white leading-[1.1] mb-8">{project.title}</h1>
            <Link href={projectHref}
              className="inline-flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors group">
              <span className="w-8 h-px bg-white/50 group-hover:w-12 group-hover:bg-white transition-all duration-300" />
              Ver Projeto
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
