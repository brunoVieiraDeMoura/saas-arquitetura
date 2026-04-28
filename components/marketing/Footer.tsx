import Link from 'next/link'
import LogoBrand from '@/components/LogoBrand'

export default function MarketingFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <LogoBrand name="Arquitetura" subname="organizada" subnameAlign="end" />
          <p className="text-xs text-neutral-500 mt-2">Portfólios profissionais para escritórios de arquitetura</p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/pricing" className="hover:text-white transition-colors">Preços</Link>
          <Link href="/login" className="hover:text-white transition-colors">Entrar</Link>
          <Link href="/signup" className="hover:text-white transition-colors">Criar conta</Link>
        </nav>
        <p className="text-xs">© {new Date().getFullYear()} Arquitetura Organizada</p>
      </div>
    </footer>
  )
}
