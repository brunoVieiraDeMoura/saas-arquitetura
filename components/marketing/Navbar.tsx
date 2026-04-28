import Link from 'next/link'
import LogoBrand from '@/components/LogoBrand'

export default function MarketingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-neutral-900">
          <LogoBrand name="Arquitetura" subname="organizada" subnameAlign="end" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
          <Link href="/#features" className="hover:text-neutral-900 transition-colors">Funcionalidades</Link>
          <Link href="/pricing" className="hover:text-neutral-900 transition-colors">Preços</Link>
          <Link href="/como-usar" className="hover:text-neutral-900 transition-colors">Como usar</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block px-4 py-2 rounded-lg hover:bg-neutral-100">
            Entrar
          </Link>
          <Link href="/signup"
            className="text-sm px-5 py-2.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  )
}
