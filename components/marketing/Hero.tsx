import Link from 'next/link'
import HeroPreview from './HeroPreview'

const AVATARS = [
  { initials: 'MC', color: '#c4956a' },
  { initials: 'RM', color: '#8b9dc3' },
  { initials: 'AL', color: '#a8b5a0' },
]

export default function MarketingHero() {
  return (
    <section className="pt-20 pb-12 md:pt-32 md:pb-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

        <div className="md:pt-8 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium mb-6">
            <div className="flex -space-x-1.5">
              {AVATARS.map((av) => (
                <div
                  key={av.initials}
                  style={{ background: av.color }}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <span><strong className="text-neutral-900">+200 escritórios</strong> já usam no Brasil</span>
          </div>

          <h1 className="text-4xl md:text-[3.25rem] font-bold text-neutral-900 leading-[1.1] mb-5">
            Mostre seus projetos.{' '}
            <span className="text-neutral-400">Conquiste mais clientes.</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
            <span className="text-neutral-800 font-medium">O Instagram é onde te encontram.</span>{' '}
            Seu portfólio profissional é onde te contratam — é o que você envia quando o cliente quer saber mais sobre o seu trabalho.
          </p>

          <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              primeiro contato
            </div>
            <span className="text-neutral-300 text-sm">→</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 bg-neutral-900 text-white px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              portfólio profissional
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
            <Link
              href="https://www.arquiteturaorganizada.com/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 text-white font-semibold text-base hover:bg-neutral-800 transition-colors text-center"
            >
              Criar meu site grátis →
            </Link>
            <Link
              href="https://arquiteturaorganizada.arquiteturaorganizada.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-base hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-center"
            >
              Ver exemplo de site
            </Link>
          </div>
          <p className="mt-3 text-xs text-neutral-400 text-center md:text-left">
            Sem cartão de crédito · Pronto em 10 minutos
          </p>
        </div>

        {/* Preview — desktop only */}
        <div className="hidden md:block md:pt-8">
          <HeroPreview />
        </div>

      </div>
    </section>
  )
}
