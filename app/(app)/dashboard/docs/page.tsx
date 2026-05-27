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
      { label: 'Preview em tempo real', desc: 'A prévia mostra como o logo ficará no topo do site antes de salvar.' },
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
      { label: 'Reordenar', desc: 'A ordem das categorias define a ordem no menu do site. Reordene pela página de gerenciamento de cada categoria.' },
    ],
  },
  {
    id: 'projetos',
    icon: '🏠',
    title: 'Projetos',
    route: '/dashboard/projects',
    items: [
      { label: 'Criar um projeto', desc: 'Clique em "+ Novo projeto". Escolha a categoria, adicione título, data, imagem principal e descreva o projeto com o editor de texto.' },
      { label: 'Galeria de fotos', desc: 'Arraste ou clique para adicionar fotos à galeria do projeto. Sem limite de quantidade.' },
      { label: 'Projeto em destaque', desc: 'Marque projetos como "destaque" para que apareçam na seção principal da página inicial do site.' },
      { label: 'Meta descrição', desc: 'Preencha a meta descrição para melhorar como o projeto aparece no Google.' },
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
      { label: 'WhatsApp', desc: 'Informe o número com código do país e DDD, sem espaços. Ex: 5521999999999. Use o link de teste para verificar.' },
      { label: 'Botão flutuante', desc: 'Ative o toggle "Exibir botão flutuante" para mostrar um botão verde fixo em todas as páginas do site.' },
      { label: 'Mensagem padrão', desc: 'Personalize o texto pré-preenchido quando o visitante clicar no WhatsApp.' },
      { label: 'Instagram', desc: 'Digite só o @username, sem o link completo. Um ícone aparecerá no menu e rodapé do site.' },
      { label: 'Email de contato', desc: 'Informe o email que receberá as mensagens do formulário do site. Requer uma Senha de App do Gmail.' },
    ],
  },
  {
    id: 'configuracoes',
    icon: '⚙️',
    title: 'Configurações',
    route: '/dashboard/settings',
    items: [
      { label: 'Slug (URL)', desc: 'Seu endereço padrão é arquiteturaorganizada.com.br/seu-slug. Altere com cuidado pois muda o link do site.' },
      { label: 'Domínio customizado', desc: 'Compre um domínio em Registro.br, GoDaddy ou Hostinger e configure o DNS com um CNAME apontando para cname.vercel-dns.com. O SSL é automático.' },
    ],
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Analytics',
    route: '/dashboard/analytics',
    items: [
      { label: 'Visitas por período', desc: 'Veja quantas visitas seu site recebeu nos últimos 7 e 30 dias. O gráfico mostra a evolução diária.' },
      { label: 'Projetos mais vistos', desc: 'Ranking dos 5 projetos com mais acessos nos últimos 30 dias. Útil para saber o que mais atrai visitantes.' },
    ],
  },
  {
    id: 'equipe',
    icon: '👥',
    title: 'Equipe',
    route: '/dashboard/team',
    items: [
      { label: 'Convidar membros', desc: 'Gere um link de convite e compartilhe com quem vai ajudar a gerenciar o site. O link expira em 10 dias.' },
      { label: 'Copiar o link', desc: 'Clique em "Copiar link". O convidado não precisa ter conta — cria na hora de aceitar.' },
      { label: 'Remover membros', desc: 'Membros removidos perdem o acesso imediatamente.' },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="max-w-3xl">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Documentação</h1>
        <p className="text-sm text-neutral-500">Guia completo para configurar e publicar seu portfólio.</p>
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
            'Crie as categorias antes dos projetos — todo projeto precisa pertencer a uma categoria.',
            'Use imagens com boa resolução (mínimo 1200px de largura) para melhor qualidade.',
            'Ative o botão flutuante do WhatsApp em Contato — aumenta muito o contato de novos clientes.',
            'Projetos marcados como "destaque" aparecem na página inicial. Escolha os melhores trabalhos.',
            'Preencha a meta descrição de cada projeto para melhorar o posicionamento no Google.',
            'Clique em "Ver site" no menu lateral para conferir como o site está ficando em tempo real.',
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
        <p className="text-neutral-400 text-sm mb-4">Respondo em até 24h.</p>
        <CopyEmailButton variant="dark" />
      </div>

    </div>
  )
}
