import Link from 'next/link'
import CopyEmailButton from '@/components/CopyEmailButton'

const SECTIONS = [
  {
    id: 'identidade',
    icon: '🎨',
    title: 'Identidade Visual',
    route: '/dashboard/identidade',
    items: [
      { label: 'Logo em texto', desc: 'Configure o nome principal e sub-nome que aparecem no topo do site. Ex: "Bruno Moura" + "Arquitetura" como sub-nome.' },
      { label: 'Logo em imagem', desc: 'Prefere usar sua própria logo? Selecione "Imagem" e faça upload de um PNG ou SVG.' },
      { label: 'Fonte do logo', desc: 'Escolha entre as fontes disponíveis para personalizar o estilo tipográfico do nome.' },
      { label: 'Preview em tempo real', desc: 'A prévia mostra como o logo ficará no topo do site (claro e escuro) antes de salvar.' },
    ],
  },
  {
    id: 'categorias',
    icon: '📂',
    title: 'Categorias',
    route: '/dashboard/categories',
    items: [
      { label: 'O que são', desc: 'Categorias organizam seu portfólio. Ex: Residencial, Comercial, Interiores. Cada uma vira uma seção no site.' },
      { label: 'Criar uma categoria', desc: 'Clique em "+ Nova categoria". Preencha nome e slug (URL). O slug é gerado automaticamente mas pode ser editado.' },
      { label: 'Limite por plano', desc: 'Starter: 2 categorias. Pro e Agency: ilimitadas. Um aviso aparece quando você atingir o limite do seu plano.' },
    ],
  },
  {
    id: 'projetos',
    icon: '🏠',
    title: 'Projetos',
    route: '/dashboard/projects',
    items: [
      { label: 'Criar um projeto', desc: 'Clique em "+ Novo projeto". Escolha a categoria, adicione título, data, imagem principal e descreva o projeto com o editor de texto.' },
      { label: 'Galeria de fotos', desc: 'Arraste ou clique para adicionar fotos ao projeto. Starter: até 2 fotos. Pro: até 6. Agency: ilimitadas.' },
      { label: 'Projeto em destaque', desc: 'Marque projetos como "destaque" para que apareçam na seção principal da página inicial do site.' },
      { label: 'Meta descrição', desc: 'Preencha a meta descrição para melhorar como o projeto aparece no Google.' },
      { label: 'Limite por plano', desc: 'Starter: 6 projetos no total (3 por categoria). Pro e Agency: ilimitados. O indicador X/6 aparece no topo da lista.' },
    ],
  },
  {
    id: 'depoimentos',
    icon: '💬',
    title: 'Depoimentos',
    route: '/dashboard/testimonials',
    items: [
      { label: 'Adicionar depoimento', desc: 'Clique em "Novo depoimento". Preencha nome do cliente, cargo ou empresa, e o texto do depoimento.' },
      { label: 'Foto do cliente', desc: 'Cole o link de uma foto do cliente. Se não tiver, o sistema exibe as iniciais do nome automaticamente.' },
      { label: 'Exibição no site', desc: 'Os depoimentos aparecem em cards na seção de depoimentos da página inicial.' },
    ],
  },
  {
    id: 'faqs',
    icon: '❓',
    title: 'FAQs',
    route: '/dashboard/faqs',
    items: [
      { label: 'Para que serve', desc: 'Responda as dúvidas mais comuns dos seus clientes: prazo, processo, valores, atendimento. Aparece na página inicial.' },
      { label: 'Ordenação', desc: 'Arraste as perguntas para reordenar. A primeira da lista aparece expandida por padrão no site.' },
    ],
  },
  {
    id: 'contato',
    icon: '📱',
    title: 'Contato',
    route: '/dashboard/contact',
    items: [
      { label: 'WhatsApp', desc: 'Informe o número com código do país e DDD, sem espaços. Ex: 5511999999999. Use o link de teste para verificar se está correto.' },
      { label: 'Botão flutuante', desc: 'Ative o toggle "Exibir botão flutuante" para mostrar um botão verde fixo no canto inferior direito em todas as páginas do seu site.' },
      { label: 'Mensagem padrão', desc: 'Personalize o texto que aparece pré-preenchido quando o cliente clicar no botão do WhatsApp.' },
      { label: 'Instagram', desc: 'Digite só o @username, sem o link completo. Um ícone aparecerá no menu e rodapé do site.' },
      { label: 'Email de contato', desc: 'Informe o email que receberá as mensagens enviadas pelo formulário do site. Requer uma Senha de App do Gmail (não a senha normal da conta).' },
    ],
  },
  {
    id: 'configuracoes',
    icon: '⚙️',
    title: 'Configurações',
    route: '/dashboard/settings',
    items: [
      { label: 'Nome do site', desc: 'O nome da empresa que aparece no título do site, no rodapé e nas mensagens automáticas.' },
      { label: 'Slug (URL)', desc: 'Seu endereço padrão é arquiteturaorganizada.com.br/seu-slug. Só pode ser alterado com cuidado pois muda o link do site.' },
      { label: 'Domínio customizado', desc: 'Disponível no plano Pro e Agency. Compre um domínio em Registro.br, GoDaddy ou Hostinger e configure o DNS apontando um CNAME para cname.vercel-dns.com. A configuração SSL é automática.' },
    ],
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analytics',
    route: '/dashboard/analytics',
    badge: 'Agency',
    items: [
      { label: 'Visitas por período', desc: 'Veja quantas visitas seu site recebeu nos últimos 7 e 30 dias. O gráfico mostra a evolução diária.' },
      { label: 'Projetos mais vistos', desc: 'Ranking dos 5 projetos com mais acessos nos últimos 30 dias. Útil para saber o que mais atrai clientes.' },
      { label: 'Disponibilidade', desc: 'Recurso exclusivo do plano Agency. Faça upgrade em Plano & Cobrança para desbloquear.' },
    ],
  },
  {
    id: 'equipe',
    icon: '👥',
    title: 'Equipe',
    route: '/dashboard/team',
    badge: 'Agency',
    items: [
      { label: 'Convidar membros', desc: 'Gere um link de convite e compartilhe com quem vai ajudar a gerenciar o site. O link expira em 10 dias.' },
      { label: 'Copiar o link', desc: 'Clique em "Copiar link" para copiar o endereço de convite. O convidado não precisa ter conta ainda — cria na hora de aceitar.' },
      { label: 'Limite de usuários', desc: 'O plano Agency suporta até 3 usuários por conta. Membros removidos perdem o acesso imediatamente.' },
      { label: 'Disponibilidade', desc: 'Recurso exclusivo do plano Agency. Faça upgrade em Plano & Cobrança para desbloquear.' },
    ],
  },
  {
    id: 'plano',
    icon: '💳',
    title: 'Plano & Cobrança',
    route: '/dashboard/billing',
    items: [
      { label: 'Starter (Grátis)', desc: '2 categorias, 6 projetos no total, até 2 fotos por projeto. Subdomínio padrão incluído. Ideal para começar.' },
      { label: 'Pro — R$99/mês', desc: 'Categorias e projetos ilimitados, domínio customizado, até 6 fotos por projeto, email prioritário.' },
      { label: 'Agency — R$167/mês', desc: 'Tudo do Pro + fotos ilimitadas por projeto, analytics, até 3 usuários na conta, suporte ativo WhatsApp e call de onboarding.' },
      { label: 'Assinar ou cancelar', desc: 'Clique em "Assinar" no card do plano desejado. O pagamento é processado pelo Mercado Pago. Para cancelar, use o botão "Cancelar assinatura" na mesma página.' },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Documentação</h1>
        <p className="text-sm text-neutral-500">Tudo que você precisa para configurar e publicar seu portfólio.</p>
      </div>

      {/* Video */}
      <div className="mb-8 bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 pt-6 pb-3">
          <p className="text-sm font-semibold text-neutral-900 mb-1">Vídeo explicativo</p>
          <p className="text-xs text-neutral-500">Assista ao tutorial completo antes de começar — leva menos de 10 minutos.</p>
        </div>
        <div className="relative aspect-video bg-neutral-950 mx-6 mb-6 rounded-xl overflow-hidden">
          {/*
            Quando tiver o vídeo, substitua o conteúdo abaixo pelo iframe:
            <iframe
              src="https://www.youtube.com/embed/SEU_VIDEO_ID"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white/40 text-xs">Vídeo em breve</p>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="mb-8 bg-white rounded-2xl border border-neutral-200 p-5">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Ir para seção</p>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              {s.icon} {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="bg-white rounded-2xl border border-neutral-200 p-6 scroll-mt-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <h2 className="text-sm font-semibold text-neutral-900">{section.title}</h2>
                {section.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                    {section.badge}
                  </span>
                )}
              </div>
              <Link
                href={section.route}
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Abrir →
              </Link>
            </div>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                    <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
        <p className="text-sm font-semibold text-neutral-900 mb-4">💡 Dicas rápidas</p>
        <ul className="space-y-2.5">
          {[
            'Seu site já está no ar desde o momento do cadastro — clique em "Ver site" no menu lateral para conferir.',
            'Crie as categorias antes dos projetos. Todo projeto precisa pertencer a uma categoria.',
            'Use imagens com boa resolução (mínimo 1200px de largura) para melhor qualidade no site.',
            'Ative o botão flutuante do WhatsApp em Contato — aumenta muito o contato de novos clientes.',
            'Projetos marcados como "destaque" aparecem na página inicial. Escolha os melhores.',
            'No plano Agency, use o Analytics para descobrir quais projetos atraem mais visitantes.',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-neutral-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Support */}
      <div className="mt-6 rounded-2xl bg-neutral-900 text-white p-6">
        <p className="font-semibold text-sm mb-1">Ainda com dúvidas?</p>
        <p className="text-neutral-400 text-sm mb-4">Nossa equipe responde em até 24h.</p>
        <CopyEmailButton variant="dark" />
      </div>

    </div>
  )
}
