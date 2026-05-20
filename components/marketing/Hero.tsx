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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

        {/* Mockup primeiro no mobile — aparece above-the-fold */}
        <div className="order-1 md:order-2">
          <HeroMockup />
        </div>

        {/* Copy abaixo do mockup no mobile */}
        <div className="order-2 md:order-1 md:pt-8 text-center md:text-left">
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

          <h1 className="text-5xl md:text-[3.25rem] font-bold text-neutral-900 leading-[1.1] mb-6">
            Seu portfólio de arquitetura,{' '}
            <span className="text-neutral-400">sem complicação</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Crie um site profissional para seu escritório em minutos. Gerencie projetos,
            depoimentos e muito mais — tudo em um painel simples.
          </p>

          <div className="flex flex-col items-center md:items-start gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 text-white font-semibold text-base hover:bg-neutral-800 transition-colors text-center"
            >
              Criar meu site grátis →
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors underline underline-offset-2"
            >
              Ver planos e preços
            </Link>
          </div>
          <p className="mt-3 text-xs text-neutral-400">Sem cartão de crédito · Pronto em 10 minutos</p>
        </div>

      </div>
    </section>
  )
}
