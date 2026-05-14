type Testimonial = { id: string; author: string; role: string; content: string; avatar: string | null }

type Props = { testimonials: Testimonial[]; theme?: number }

function Avatar({ t }: { t: Testimonial }) {
  return t.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 text-sm font-medium text-neutral-500">
      {t.author.charAt(0).toUpperCase()}
    </div>
  )
}

export default function Testimonials({ testimonials, theme = 1 }: Props) {
  if (!testimonials.length) return null

  // ── Style 2: Dark ─────────────────────────────────────────────────────────
  if (theme === 2) {
    return (
      <section id="depoimentos" className="py-16 md:py-24 px-6 bg-neutral-900">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
            O que dizem <span style={{ color: 'var(--site-primary)' }}>nossos clientes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={t.id} className={`flex flex-col${i >= 4 ? ' hidden md:flex' : ''}`}>
                <span className="text-5xl leading-none font-serif mb-3" style={{ color: 'var(--site-primary)' }}>"</span>
                <p className="text-neutral-300 text-sm leading-relaxed flex-1 mb-6">
                  {t.content}
                </p>
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center shrink-0 text-sm font-medium text-neutral-300">
                      {t.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-white">{t.author}</p>
                    {t.role && <p className="text-xs text-neutral-500">{t.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Style 3: Featured ─────────────────────────────────────────────────────
  if (theme === 3) {
    const [featured, ...rest] = testimonials.slice(0, 5)
    return (
      <section id="depoimentos" className="py-16 md:py-24 px-6 bg-neutral-50">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--site-title)' }}>
            O que dizem <span style={{ color: 'var(--site-primary)' }}>nossos clientes</span>
          </h2>

          {/* Featured testimonial */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 mb-6 flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center shrink-0">
              <Avatar t={featured} />
              <div className="sm:text-center">
                <p className="font-semibold text-sm" style={{ color: 'var(--site-title)' }}>{featured.author}</p>
                {featured.role && <p className="text-xs text-neutral-400">{featured.role}</p>}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-4xl leading-none font-serif text-neutral-200 block mb-3">"</span>
              <p className="text-neutral-600 leading-relaxed">"{featured.content}"</p>
            </div>
          </div>

          {/* Smaller grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {rest.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col">
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4 flex-1">"{t.content}"</p>
                  <div className="flex items-center gap-2">
                    <Avatar t={t} />
                    <div>
                      <p className="font-medium text-xs" style={{ color: 'var(--site-title)' }}>{t.author}</p>
                      {t.role && <p className="text-xs text-neutral-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  // ── Style 1 (default): Cards grid ─────────────────────────────────────────
  return (
    <section id="depoimentos" className="py-16 md:py-24 px-6 bg-neutral-50">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--site-title)' }}>
          O que dizem <span style={{ color: 'var(--site-primary)' }}>nossos clientes</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <div key={t.id} className={`bg-white rounded-xl border border-neutral-200 p-6 flex flex-col${i >= 4 ? ' hidden md:flex' : ''}`}>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <Avatar t={t} />
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--site-title)' }}>{t.author}</p>
                  {t.role && <p className="text-xs text-neutral-400">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
