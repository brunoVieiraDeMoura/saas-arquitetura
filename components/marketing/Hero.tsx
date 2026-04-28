import Link from 'next/link'
import HeroMockup from './HeroMockup'

export default function MarketingHero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

        {/* Left — copy */}
        <div className="md:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Já usado por escritórios de arquitetura no Brasil
          </div>
          <h1 className="text-5xl md:text-[3.25rem] font-bold text-neutral-900 leading-[1.1] mb-6">
            Seu portfólio de arquitetura,{' '}
            <span className="text-neutral-400">sem complicação</span>
          </h1>
          <p className="text-lg text-neutral-500 mb-10 leading-relaxed max-w-md">
            Crie um site profissional para seu escritório em minutos. Gerencie projetos,
            depoimentos e muito mais — tudo em um painel simples.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/signup"
              className="px-8 py-3.5 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors">
              Criar meu site grátis
            </Link>
            <Link href="/pricing"
              className="px-8 py-3.5 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors">
              Ver planos
            </Link>
          </div>
          <p className="mt-4 text-xs text-neutral-400">Sem cartão de crédito. Plano gratuito para sempre.</p>
        </div>

        {/* Right — interactive mockup */}
        <div>
          <HeroMockup />
        </div>

      </div>
    </section>
  )
}
