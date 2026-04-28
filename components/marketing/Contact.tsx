import CopyEmailButton from '@/components/CopyEmailButton'

export default function MarketingContact() {
  return (
    <section className="py-20 px-6 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Fale com a gente</h2>
        <p className="text-neutral-500 mb-8">
          Dúvidas sobre planos, reembolso ou como usar a plataforma? Nossa equipe responde em até 24h.
        </p>
        <div className="flex justify-center">
          <CopyEmailButton variant="dark" />
        </div>
        <p className="text-xs text-neutral-400 mt-4">Atendimento de segunda a sexta, das 9h às 18h.</p>
      </div>
    </section>
  )
}
