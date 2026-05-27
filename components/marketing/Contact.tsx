import CopyEmailButton from '@/components/CopyEmailButton'

export default function MarketingContact() {
  return (
    <section id="contact" className="py-20 px-6 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Pronto para ter seu site?</h2>
        <p className="text-neutral-500 mb-8">
          Me manda uma mensagem e eu te explico como funciona. Respondo em até 24h — de segunda a sexta, das 9h às 18h.
        </p>
        <div className="flex justify-center">
          <CopyEmailButton variant="dark" />
        </div>
        <p className="text-xs text-neutral-400 mt-4">Site entregue em até 3 dias úteis após envio do material.</p>
      </div>
    </section>
  )
}
