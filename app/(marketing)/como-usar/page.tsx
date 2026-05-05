import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Como usar — Arquitetura Organizada',
  description: 'Aprenda a criar e publicar seu portfólio de arquitetura em poucos minutos, sem precisar de conhecimento técnico.',
}

const STEPS = [
  {
    number: '01',
    title: 'Crie sua conta',
    items: [
      'Acesse arquiteturaorganizada.com.br e clique em "Começar grátis".',
      'Informe seu e-mail e crie uma senha. Nenhum cartão de crédito é necessário para começar.',
      'Após entrar, você já tem um site publicado com conteúdo de exemplo — é só personalizar.',
    ],
  },
  {
    number: '02',
    title: 'Configure o nome e o logo',
    items: [
      'No menu lateral, clique em "Identidade".',
      'Escolha entre logo em texto (nome do escritório dividido em duas linhas) ou faça upload da sua própria logo em imagem.',
      'Selecione a fonte e veja a prévia em tempo real antes de salvar.',
    ],
  },
  {
    number: '03',
    title: 'Organize suas categorias',
    items: [
      'Categorias são as seções do portfólio — ex: Residencial, Comercial, Interiores.',
      'Clique em "Categorias" no menu e adicione as que fazem sentido para o seu escritório.',
      'Você pode reordenar arrastando. A ordem aqui define a ordem no menu do site.',
    ],
    note: { label: 'Starter', text: 'até 2 categorias — Pro e Agency: ilimitadas' },
  },
  {
    number: '04',
    title: 'Adicione seus projetos',
    items: [
      'Clique em "Projetos" → "Novo projeto". Escolha a categoria, escreva o nome e faça upload da imagem principal.',
      'Use o editor de texto para contar a história do projeto — quanto mais detalhes, melhor para o cliente.',
      'Adicione fotos à galeria do projeto para mostrar diferentes ângulos e ambientes.',
      'Marque os melhores como "destaque" — eles aparecem em destaque na página inicial.',
    ],
    note: { label: 'Starter', text: 'até 6 projetos e 2 fotos por projeto — Pro: até 6 fotos — Agency: fotos ilimitadas' },
  },
  {
    number: '05',
    title: 'Adicione depoimentos de clientes',
    items: [
      'Clique em "Depoimentos" no menu lateral.',
      'Preencha nome, cargo ou empresa e o texto do depoimento.',
      'Cole o link de uma foto do cliente para personalizar. Se não tiver, as iniciais aparecem automaticamente.',
    ],
  },
  {
    number: '06',
    title: 'Crie sua lista de perguntas frequentes',
    items: [
      'Clique em "FAQs" no menu.',
      'Responda as dúvidas mais comuns: prazo, processo, valores, atendimento.',
      'Isso economiza tempo nas conversas e transmite profissionalismo para novos clientes.',
    ],
  },
  {
    number: '07',
    title: 'Configure WhatsApp, Instagram e e-mail',
    items: [
      'Clique em "Contato" no menu lateral.',
      'Informe seu número de WhatsApp com código do país e DDD (ex: 5511999999999). Ative o botão flutuante para que ele apareça em todas as páginas do site.',
      'Adicione seu @username do Instagram — um ícone de acesso direto aparece no menu e rodapé.',
      'Configure o e-mail de contato para receber as mensagens enviadas pelo formulário do site. Requer uma Senha de App do Gmail.',
    ],
  },
  {
    number: '08',
    title: 'Use seu próprio domínio',
    items: [
      'Por padrão, seu site fica em arquiteturaorganizada.com.br/seu-slug.',
      'Com o plano Pro ou Agency, você pode usar um domínio próprio como meuescritorio.com.br.',
      'Compre o domínio em Registro.br, GoDaddy ou Hostinger, configure um CNAME apontando para cname.vercel-dns.com e cole o domínio em Configurações → Domínio customizado.',
      'O certificado SSL é gerado automaticamente. A propagação pode levar até 48h.',
    ],
    badge: 'Pro e Agency',
  },
  {
    number: '09',
    title: 'Acompanhe as visitas com Analytics',
    items: [
      'Acesse "Analytics" no menu lateral para ver quantas pessoas visitaram seu site nos últimos 7 e 30 dias.',
      'Veja o gráfico de visitas por dia e descubra quais projetos atraem mais visitantes.',
      'Use esse dado para priorizar o tipo de projeto que você mais quer mostrar.',
    ],
    badge: 'Agency',
  },
  {
    number: '10',
    title: 'Adicione membros à sua equipe',
    items: [
      'No plano Agency, acesse "Equipe" no menu lateral.',
      'Gere um link de convite e compartilhe com quem vai ajudar a gerenciar o site.',
      'O link expira em 10 dias. O convidado cria a conta na hora de aceitar. Limite de 3 usuários por conta.',
    ],
    badge: 'Agency',
  },
]

export default function ComoUsarPage() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 text-center bg-white border-b border-neutral-100">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 bg-neutral-100 px-3 py-1 rounded-full">
            Passo a passo
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-4">
            Como usar o<br />Arquitetura Organizada
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Do cadastro ao portfólio publicado em menos de 10 minutos.
            Sem código, sem agência, sem complicação.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">
            Vídeo explicativo
          </p>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/--TTnKPEjlc?vq=hd1080"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-xs text-neutral-400 mt-4">
            Assista ao tutorial completo e veja como é simples montar seu portfólio.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">Passo a passo completo</h2>
            <p className="text-neutral-500">Siga cada etapa na ordem e seu site estará pronto em minutos.</p>
          </div>

          {/* Site online callout */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-700 p-6 flex gap-5 items-start mb-6">
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Seu site já está no ar desde o cadastro 🎉</p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Populamos tudo automaticamente com conteúdo de exemplo. Clique em{' '}
                <span className="text-white font-medium">"Ver site"</span> no menu lateral e veja funcionando agora mesmo.
                O que vem a seguir é só personalizar do seu jeito.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-6 bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="shrink-0 w-10 h-10 rounded-full bg-neutral-900 text-white text-sm font-bold flex items-center justify-center">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                    {step.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-neutral-600 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {step.note && (
                    <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <span className="font-semibold">{step.note.label}:</span> {step.note.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-neutral-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Pronto para começar?</h2>
          <p className="text-neutral-400 mb-8">
            Crie seu portfólio agora. É gratuito e leva menos de 10 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="bg-white text-neutral-900 font-semibold px-8 py-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Criar meu site grátis
            </Link>
            <Link
              href="/pricing"
              className="border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
