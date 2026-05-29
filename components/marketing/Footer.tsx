import Link from 'next/link'
import LogoBrand from '@/components/LogoBrand'

export default function MarketingFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <nav className="flex items-center justify-center md:justify-start gap-6 text-sm">
          <Link href="/pricing" className="hover:text-white transition-colors">Preços</Link>
          <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
          <Link href="/return-policy" className="hover:text-white transition-colors">Reembolso</Link>
        </nav>
        <div className="text-white flex flex-col items-center text-center">
          <LogoBrand name="Arquitetura" subname="organizada" subnameAlign="end" />
          <p className="text-xs text-neutral-500 mt-2">Sites profissionais para escritórios de arquitetura</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-xs">© {new Date().getFullYear()} Arquitetura Organizada</p>
          <Link href="/login" className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors">
            acesso restrito
          </Link>
          <Link href="/pagamento" className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors">
            pagamento
          </Link>
        </div>
      </div>
    </footer>
  )
}
