import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const PREVIEW_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'

export default function DemoSection() {
  return (
    <section className="py-20 px-6 bg-neutral-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
            Site de exemplo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            É assim que o seu site vai ficar
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Site real criado na plataforma. Projetos, depoimentos e contato — tudo organizado e pronto para conquistar clientes.
          </p>
        </div>

        {/* Browser mockup */}
        <Link
          href="https://www.arquiteturaorganizada.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition-all shadow-2xl"
        >
          {/* Chrome bar */}
          <div className="bg-neutral-800 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-neutral-600" />
              <div className="w-3 h-3 rounded-full bg-neutral-600" />
              <div className="w-3 h-3 rounded-full bg-neutral-600" />
            </div>
            <div className="flex-1 bg-neutral-700 rounded-md px-3 py-1.5 text-xs text-neutral-400 text-center truncate">
              arquiteturaorganizada.com
            </div>
            <div className="shrink-0 flex items-center gap-1.5 text-xs text-neutral-500 group-hover:text-neutral-300 transition">
              <ExternalLink size={12} />
              <span className="hidden sm:inline">Abrir</span>
            </div>
          </div>

          {/* Site preview */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PREVIEW_IMG}
              alt="Exemplo de site de portfólio"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">Residencial</p>
              <p className="text-white text-2xl md:text-4xl font-bold mb-5">Residência Serra</p>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-white/20 transition">
                <ExternalLink size={14} />
                Abrir site ao vivo
              </div>
            </div>
          </div>
        </Link>

        <div className="text-center mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-xl font-semibold text-base hover:bg-neutral-100 transition-colors"
          >
            Criar o meu site grátis →
          </Link>
          <p className="mt-3 text-xs text-neutral-500">Grátis para começar · Sem cartão de crédito</p>
        </div>
      </div>
    </section>
  )
}
