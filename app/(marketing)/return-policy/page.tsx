import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Reembolso — Arquitetura Organizada',
  description: 'Política de reembolsos e devoluções da plataforma Arquitetura Organizada.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Política de Reembolso e Devoluções</h1>
      <p className="text-sm text-neutral-400 mb-10">Última atualização: 8 de maio de 2026</p>

      <div className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-8">

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">1. Direito de Arrependimento — 7 dias</h2>
          <p className="text-neutral-600">
            Em conformidade com o art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), o Usuário que contratar um plano pago pela internet tem o direito de se arrepender e solicitar o cancelamento e reembolso integral no prazo de <strong>7 (sete) dias corridos</strong> a contar da data da primeira cobrança, sem necessidade de justificativa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">2. Como Solicitar o Reembolso</h2>
          <p className="text-neutral-600 mb-2">Para exercer o direito de arrependimento ou solicitar reembolso dentro do prazo, o Usuário deve:</p>
          <ol className="list-decimal list-inside space-y-2 text-neutral-600">
            <li>Enviar e-mail para <a href="mailto:contato@arquiteturaorganizada.com.br" className="text-neutral-900 underline underline-offset-2">contato@arquiteturaorganizada.com.br</a> com o assunto <strong>"Solicitação de Reembolso"</strong>.</li>
            <li>Informar o e-mail cadastrado na conta e o motivo (opcional dentro dos 7 dias).</li>
            <li>Aguardar confirmação em até 2 dias úteis.</li>
          </ol>
          <p className="text-neutral-600 mt-3">
            O reembolso será processado pelo Stripe diretamente no cartão utilizado na compra em até <strong>10 dias úteis</strong>, conforme o prazo da operadora do cartão.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">3. Reembolso Proporcional após 7 dias</h2>
          <p className="text-neutral-600">
            Após o prazo de 7 dias, não há reembolso por período não utilizado em planos mensais. Para planos anuais, avaliamos reembolso proporcional caso a caso mediante solicitação justificada enviada ao e-mail de suporte. Cancelamentos de planos anuais após os 7 dias não geram reembolso automático, mas o acesso permanece ativo até o fim do período pago.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">4. Situações não Elegíveis a Reembolso</h2>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Solicitações realizadas após o prazo de 7 dias da primeira cobrança (exceto planos anuais avaliados individualmente).</li>
            <li>Contas suspensas ou encerradas por violação dos <a href="/termos" className="text-neutral-900 underline underline-offset-2">Termos e Condições</a>.</li>
            <li>Cobranças de renovação subsequentes já iniciadas após o período de aviso de cancelamento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">5. Cancelamento da Assinatura</h2>
          <p className="text-neutral-600">
            O cancelamento pode ser realizado a qualquer momento pelo painel em{' '}
            <strong>Dashboard → Plano → Gerenciar / Cancelar assinatura</strong>. O acesso ao plano pago permanece disponível até o final do ciclo já pago. O cancelamento não gera reembolso automático, exceto dentro do prazo de 7 dias da primeira cobrança.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">6. Contato</h2>
          <p className="text-neutral-600">
            Para dúvidas sobre esta política:{' '}
            <a href="mailto:contato@arquiteturaorganizada.com.br" className="text-neutral-900 underline underline-offset-2">
              contato@arquiteturaorganizada.com.br
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
