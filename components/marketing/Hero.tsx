import Link from 'next/link'
import HeroMockup from './HeroMockup'

const AVATARS = [
  { initials: 'MC', color: '#c4956a' },
  { initials: 'RM', color: '#8b9dc3' },
  { initials: 'AL', color: '#a8b5a0' },
]

export default function MarketingHero() {
  return (
    <section className="pt-20 pb-12 md:pt-32 md:pb-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

        {/* Copy — texto primeiro em todas as telas */}
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
          <p className="text-lg text-neutral-500 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Crie um portfólio online para seu escritório de arquitetura em minutos.
            Sem agência, sem programador — só você e seus projetos.
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
            <Link
              href="/signup"
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

        {/* Mockup — desktop only */}
        <div className="hidden md:block">
          <HeroMockup />
        </div>

      </div>
    </section>
  )
}
