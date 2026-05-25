const PROJECTS = [
  { gradient: 'from-stone-500 to-stone-700',   title: 'Residência Serra',    date: 'Jan 2023' },
  { gradient: 'from-amber-700 to-stone-800',   title: 'Apt Jardins',         date: 'Mar 2023' },
  { gradient: 'from-neutral-500 to-neutral-700', title: 'Casa Contemporânea', date: 'Jun 2023' },
  { gradient: 'from-zinc-500 to-zinc-800',     title: 'Cobertura Duplex',    date: 'Set 2023' },
]

const THUMBS = [
  'from-stone-500 to-stone-700',
  'from-amber-800 to-stone-900',
  'from-neutral-600 to-stone-800',
  'from-zinc-600 to-zinc-800',
  'from-stone-400 to-stone-600',
]

export default function HeroPreview() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-neutral-200 w-full select-none">
      {/* Browser chrome */}
      <div className="bg-neutral-100 border-b border-neutral-200 px-3 py-2 flex items-center gap-2.5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 bg-white rounded px-3 py-1 text-[11px] text-neutral-400 border border-neutral-200 text-center truncate">
          seuescritorio.arquiteturaorganizada.com.br
        </div>
      </div>

      {/* Simulated page */}
      <div className="bg-white">
        {/* Nav */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
          <div className="flex flex-col leading-none gap-[2px]">
            <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-900">Arquitetura</span>
            <span className="text-[6px] tracking-[0.2em] uppercase text-neutral-400 self-end">organizada</span>
          </div>
          <div className="flex items-center gap-2.5">
            {['Projetos', 'Depoimentos', 'FAQ'].map(l => (
              <span key={l} className="text-[8px] text-neutral-500">{l}</span>
            ))}
            <span className="text-[8px] bg-neutral-900 text-white px-2 py-0.5 rounded-md">Contato</span>
          </div>
        </div>

        {/* Hero with thumbnail strip */}
        <div className="flex" style={{ height: 156 }}>
          <div className={`relative flex-1 bg-gradient-to-br ${THUMBS[0]} overflow-hidden`}>
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-3 left-3">
              <p className="text-[7px] text-white/60 uppercase tracking-widest mb-1">Residencial</p>
              <p className="text-[15px] font-bold text-white leading-tight">Residência<br />Serra</p>
            </div>
          </div>
          <div className="flex flex-col w-10">
            {THUMBS.map((g, i) => (
              <div key={i} className={`flex-1 relative bg-gradient-to-br ${g} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30" />
                {i === 0 && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />}
              </div>
            ))}
          </div>
        </div>

        {/* Project grid */}
        <div className="px-4 pt-3 pb-3">
          <p className="text-[9px] font-bold text-neutral-700 mb-2.5 uppercase tracking-wider">Nossos Projetos</p>
          <div className="grid grid-cols-4 gap-2">
            {PROJECTS.map((p, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-neutral-100">
                <div className={`bg-gradient-to-br ${p.gradient} aspect-video`} />
                <div className="p-1.5">
                  <p className="text-[8px] font-medium text-neutral-800 leading-tight">{p.title}</p>
                  <p className="text-[7px] text-neutral-400 mt-0.5">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bar */}
        <div className="mx-4 mb-4 bg-neutral-900 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <p className="text-[9px] text-white font-medium">Transforme seu espaço</p>
          <div className="text-[8px] bg-white text-neutral-900 px-2.5 py-1 rounded-full font-medium">Fale Conosco →</div>
        </div>
      </div>
    </div>
  )
}
