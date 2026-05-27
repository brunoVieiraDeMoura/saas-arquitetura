import { LayoutDashboard, Images, FolderOpen, Globe, Smartphone, Wrench } from 'lucide-react'

const FEATURES = [
  {
    Icon: Images,
    title: 'Fotos com SEO por projeto',
    description: 'Cada foto recebe título, descrição e alt text otimizados — seu trabalho aparece no Google do jeito certo.',
  },
  {
    Icon: FolderOpen,
    title: 'Categorias organizadas',
    description: 'Residencial, comercial, interiores, reformas — organizo tudo por tipo para o visitante encontrar rápido.',
  },
  {
    Icon: Globe,
    title: 'Link próprio',
    description: 'Seu escritório em seu-nome.arquiteturaorganizada.com.br, no ar assim que o site estiver pronto.',
  },
  {
    Icon: Smartphone,
    title: '100% responsivo',
    description: 'Site perfeito no celular, tablet e desktop — sem nenhuma configuração extra da sua parte.',
  },
  {
    Icon: LayoutDashboard,
    title: 'Painel para o cliente',
    description: 'Você recebe acesso ao painel para acompanhar o site, ver analytics e solicitar manutenções.',
  },
  {
    Icon: Wrench,
    title: '3 manutenções anuais',
    description: 'Precisou adicionar projetos novos ou ajustar algo? Você tem 3 manutenções por ano já inclusas no valor.',
  },
]

export default function MarketingFeatures() {
  return (
    <section id="features" className="py-24 px-6 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">O que está incluso</p>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Eu faço tudo por você
          </h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            Você me envia as fotos e informações do seu escritório. Eu monto o site completo — categorias, descrições, SEO — e entrego pronto para uso.
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
