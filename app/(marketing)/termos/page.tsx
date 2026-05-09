import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos e Condições — Arquitetura Organizada',
  description: 'Termos e condições de uso da plataforma Arquitetura Organizada.',
}

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Termos e Condições de Uso</h1>
      <p className="text-sm text-neutral-400 mb-10">Última atualização: 8 de maio de 2026</p>

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-8">

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Aceitação dos Termos</h2>
          <p className="text-neutral-600">
            Ao criar uma conta ou utilizar a plataforma Arquitetura Organizada ("Plataforma", "Serviço"), você ("Usuário") declara ter lido, compreendido e concordado integralmente com estes Termos e Condições de Uso ("Termos"), bem como com nossa{' '}
            <a href="/return-policy" className="text-neutral-900 underline underline-offset-2">Política de Reembolso</a>.
            Caso não concorde com qualquer disposição, não utilize o Serviço.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. Descrição do Serviço</h2>
          <p className="text-neutral-600">
            A Arquitetura Organizada é uma plataforma SaaS (Software como Serviço) que oferece aos profissionais de arquitetura e design um portfólio digital personalizado com subdomínio, gestão de projetos, categorias, depoimentos e domínio próprio, conforme o plano contratado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. Cadastro e Conta</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>O Usuário deve ter no mínimo 18 anos ou ser representado por responsável legal.</li>
            <li>As informações fornecidas no cadastro devem ser verdadeiras, completas e atualizadas.</li>
            <li>O Usuário é responsável pela confidencialidade de sua senha e por todas as atividades realizadas em sua conta.</li>
            <li>É vedado o compartilhamento de credenciais de acesso entre terceiros não autorizados.</li>
            <li>Em caso de uso não autorizado da conta, o Usuário deve notificar imediatamente pelo e-mail de suporte.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. Planos e Pagamentos</h2>
          <p className="text-neutral-600 mb-2">
            A Plataforma oferece planos gratuito (Starter) e pagos (Pro e Agency). Os planos pagos são cobrados de forma recorrente (mensal ou anual) por meio da plataforma Stripe.
          </p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Os valores dos planos estão disponíveis na página de preços e podem ser alterados mediante aviso prévio de 30 dias.</li>
            <li>A cobrança é realizada antecipadamente no início de cada ciclo de faturamento.</li>
            <li>O Usuário autoriza expressamente a cobrança recorrente no cartão cadastrado.</li>
            <li>O cancelamento pode ser realizado a qualquer momento pelo painel de assinaturas, sem multa.</li>
            <li>Após o cancelamento, o acesso às funcionalidades do plano pago permanece ativo até o fim do período já pago.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. Uso Aceitável</h2>
          <p className="text-neutral-600 mb-2">É expressamente proibido:</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Utilizar a Plataforma para fins ilegais ou que violem direitos de terceiros.</li>
            <li>Publicar conteúdo ofensivo, discriminatório, pornográfico ou que viole a legislação brasileira.</li>
            <li>Tentar acessar sistemas, dados ou contas de outros usuários sem autorização.</li>
            <li>Realizar engenharia reversa, descompilar ou modificar qualquer parte da Plataforma.</li>
            <li>Utilizar bots, scrapers ou meios automatizados para acessar o Serviço sem autorização expressa.</li>
            <li>Revender ou sublicenciar o acesso à Plataforma.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Propriedade Intelectual</h2>
          <p className="text-neutral-600">
            Todo o código, design, marca, logotipo e demais elementos da Plataforma são de propriedade exclusiva da Arquitetura Organizada e estão protegidos pela legislação brasileira de propriedade intelectual (Lei nº 9.279/1996 e Lei nº 9.609/1998). O Usuário retém a propriedade sobre o conteúdo por ele publicado, mas concede à Plataforma licença não exclusiva para hospedar, exibir e distribuir esse conteúdo exclusivamente para a prestação do Serviço.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">7. Privacidade e Dados Pessoais</h2>
          <p className="text-neutral-600">
            O tratamento de dados pessoais é realizado em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD). Os dados coletados são utilizados exclusivamente para a prestação do Serviço, comunicações relacionadas à conta e melhoria da Plataforma. Não comercializamos dados pessoais de Usuários com terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">8. Disponibilidade do Serviço</h2>
          <p className="text-neutral-600">
            A Plataforma empenhará esforços razoáveis para manter disponibilidade contínua, mas não garante operação ininterrupta. Manutenções programadas serão comunicadas com antecedência. Interrupções por caso fortuito ou força maior não geram direito à indenização.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">9. Limitação de Responsabilidade</h2>
          <p className="text-neutral-600">
            Na máxima extensão permitida pela legislação aplicável, a Arquitetura Organizada não se responsabiliza por danos indiretos, incidentais, especiais ou consequentes decorrentes do uso ou da impossibilidade de uso do Serviço. A responsabilidade total da Plataforma fica limitada ao valor pago pelo Usuário nos últimos 3 (três) meses anteriores ao evento gerador do dano.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">10. Rescisão</h2>
          <p className="text-neutral-600">
            A Arquitetura Organizada reserva-se o direito de suspender ou encerrar a conta do Usuário, sem aviso prévio, em caso de violação destes Termos, uso fraudulento, ou atividade que cause dano à Plataforma ou a terceiros. Em caso de encerramento por iniciativa da Plataforma sem justa causa, os valores já pagos referentes ao período não utilizado serão reembolsados proporcionalmente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">11. Alterações nos Termos</h2>
          <p className="text-neutral-600">
            Estes Termos podem ser alterados a qualquer momento. Alterações relevantes serão comunicadas por e-mail com antecedência mínima de 30 dias. O uso continuado do Serviço após o prazo comunicado constitui aceitação dos novos Termos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">12. Lei Aplicável e Foro</h2>
          <p className="text-neutral-600">
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca do Rio de Janeiro/RJ para dirimir quaisquer controvérsias decorrentes destes Termos, renunciando as partes a qualquer outro, por mais privilegiado que seja.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">13. Contato</h2>
          <p className="text-neutral-600">
            Dúvidas sobre estes Termos podem ser enviadas para:{' '}
            <a href="mailto:contato@arquiteturaorganizada.com.br" className="text-neutral-900 underline underline-offset-2">
              contato@arquiteturaorganizada.com.br
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
