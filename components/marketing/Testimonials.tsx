const TESTIMONIALS = [
  {
    name: 'Mariana Costa',
    role: 'Arquiteta, Studio MC',
    content: 'Montei meu portfólio em menos de uma tarde. O painel é muito intuitivo e o resultado ficou profissional.',
  },
  {
    name: 'Rafael Mendes',
    role: 'Sócio, Mendes & Associados',
    content: 'Antes usávamos uma agência para atualizar o site. Agora fazemos tudo internamente, muito mais rápido.',
  },
  {
    name: 'Ana Lima',
    role: 'Arquiteta independente',
    content: 'Incrível custo-benefício. Meus clientes adoram a galeria de projetos e o site funciona perfeitamente no celular.',
  },
]

export default function MarketingTestimonials() {
  return (
    <section className="py-24 px-6 bg-neutral-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-16">
          Escritórios que já usam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-700 leading-relaxed mb-6">"{t.content}"</p>
              <div>
                <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                <p className="text-xs text-neutral-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
