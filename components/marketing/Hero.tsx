import Link from 'next/link'

export default function MarketingHero() {
  return (
    <section className="pt-20 pb-12 md:pt-32 md:pb-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span>Entrega em até <strong className="text-neutral-900">3 dias úteis</strong></span>
        </div>

        <h1 className="text-4xl md:text-[3.25rem] font-bold text-neutral-900 leading-[1.1] mb-5">
          Seu site de arquitetura,{' '}
          <span className="text-neutral-400">feito por completo para você.</span>
        </h1>

        <p className="text-lg text-neutral-500 mb-6 leading-relaxed">
          <span className="text-neutral-800 font-medium">Você cuida dos projetos.</span>{' '}
          Eu cuido do site — categorias, fotos, descrições e SEO de cada trabalho. Seu portfólio profissional no ar em até 3 dias úteis.
        </p>

        <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
            ✓ Site completo configurado
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
            ✓ Fotos + SEO por projeto
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium bg-neutral-900 text-white px-3 py-1.5 rounded-full">
            ✓ 3 manutenções/ano inclusas
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 text-white font-semibold text-base hover:bg-neutral-800 transition-colors text-center"
          >
            Ver preços →
          </Link>
          <Link
            href="https://www.arquiteturaorganizada.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-base hover:border-neutral-300 hover:bg-neutral-50 transition-colors text-center"
          >
            Ver exemplo de site
          </Link>
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Pagamento único · Sem mensalidade obrigatória
        </p>
      </div>
    </section>
  )
}
