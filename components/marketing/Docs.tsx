const STEPS = [
  {
    number: '01',
    title: 'Crie sua conta',
    desc: 'Cadastre-se em segundos com seu e-mail. Nenhum cartão de crédito necessário para começar.',
  },
  {
    number: '02',
    title: 'Configure sua identidade',
    desc: 'Adicione o nome do escritório, logo, cores e links de contato. Seu site já vai ao ar com conteúdo de exemplo.',
  },
  {
    number: '03',
    title: 'Adicione seus projetos',
    desc: 'Crie categorias (Residencial, Comercial…), suba fotos e escreva sobre cada projeto com o editor integrado.',
  },
  {
    number: '04',
    title: 'Publique e compartilhe',
    desc: 'Seu portfólio fica disponível em arquiteturaorganizada.com.br/seu-escritorio. Compartilhe nas redes e no WhatsApp.',
  },
]

const CAPABILITIES = [
  { icon: '🏷️', text: 'Categorias de projetos' },
  { icon: '🖼️', text: 'Galeria com múltiplas fotos' },
  { icon: '⭐', text: 'Projetos em destaque' },
  { icon: '💬', text: 'Depoimentos de clientes' },
  { icon: '❓', text: 'Perguntas frequentes (FAQ)' },
  { icon: '📱', text: 'Botão flutuante de WhatsApp' },
  { icon: '📸', text: 'Link direto pro Instagram' },
  { icon: '🔍', text: 'SEO e Open Graph automáticos' },
  { icon: '🌐', text: 'Domínio personalizado (Pro)' },
  { icon: '🎨', text: 'Logo em texto ou imagem' },
  { icon: '📝', text: 'Editor de conteúdo rico' },
  { icon: '📊', text: 'Painel de gestão completo' },
]

export default function MarketingDocs() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Como funciona
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl mx-auto">
            Do cadastro ao portfólio publicado em menos de 10 minutos. Sem código, sem agência.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-5xl font-bold text-neutral-100 mb-4 leading-none select-none">{step.number}</div>
              <h3 className="font-semibold text-neutral-900 mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Capabilities grid */}
        <div className="bg-neutral-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 text-center">O que está incluso</h3>
          <p className="text-neutral-500 text-sm text-center mb-8">Tudo configurado pelo painel, sem precisar mexer em código.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((c) => (
              <div key={c.text} className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 px-4 py-3">
                <span className="text-lg">{c.icon}</span>
                <span className="text-sm text-neutral-700">{c.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
