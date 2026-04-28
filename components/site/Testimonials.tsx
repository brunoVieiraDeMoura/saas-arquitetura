type Testimonial = { id: string; author: string; role: string; content: string; avatar: string | null }

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null
  return (
    <section id="depoimentos" className="py-16 md:py-24 px-6 bg-neutral-50">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">O que dizem nossos clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <div key={t.id} className={`bg-white rounded-xl border border-neutral-200 p-6 flex flex-col${i >= 4 ? ' hidden md:flex' : ''}`}>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">"{t.content}"</p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 text-sm font-medium text-neutral-500">
                    {t.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-neutral-900 text-sm">{t.author}</p>
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
