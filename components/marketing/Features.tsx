import { LayoutDashboard, Images, FolderOpen, Globe, Smartphone, MessageSquare } from 'lucide-react'

const FEATURES = [
  {
    Icon: LayoutDashboard,
    title: 'Painel intuitivo',
    description: 'Gerencie projetos, depoimentos e configurações sem precisar de programador ou agência.',
  },
  {
    Icon: Images,
    title: 'Galeria de projetos',
    description: 'Fotos em alta qualidade, descrições e navegação fluida — do jeito que seu trabalho merece.',
  },
  {
    Icon: FolderOpen,
    title: 'Categorias organizadas',
    description: 'Separe por tipo — residencial, comercial, interiores — e deixe o cliente encontrar o que busca.',
  },
  {
    Icon: Globe,
    title: 'Link próprio',
    description: 'Seu escritório em seu-nome.arquiteturaorganizada.com.br, no ar no mesmo dia em que você criar.',
  },
  {
    Icon: Smartphone,
    title: '100% responsivo',
    description: 'Site perfeito no celular, tablet e desktop — sem nenhuma configuração extra.',
  },
  {
    Icon: MessageSquare,
    title: 'Depoimentos de clientes',
    description: 'Exiba avaliações reais e construa credibilidade com quem ainda não te conhece.',
  },
]

export default function MarketingFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">O que está incluso</p>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Tudo que seu escritório precisa
          </h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            Uma plataforma completa para arquitetos que querem um site bonito e profissional, sem dor de cabeça.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ Icon, title, description }) => (
            <div key={title} className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
                <Icon size={18} className="text-neutral-700" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
