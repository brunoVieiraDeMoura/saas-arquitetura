'use client'

import { useState } from 'react'

type Settings = {
  whatsapp_number: string
  whatsapp_message: string
  whatsapp_floating: string
  instagram_path: string
  contact_email: string
  gmail_user: string
  gmail_app_password: string
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative shrink-0" onClick={() => onChange(!checked)}>
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-neutral-900' : 'bg-neutral-300'}`} />
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-700">{label}</p>
        {description && <p className="text-xs text-neutral-400 mt-0.5">{description}</p>}
      </div>
    </label>
  )
}

function SaveButton({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-5 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-60 transition-colors"
    >
      {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar'}
    </button>
  )
}

export default function ContactSettingsForm({ initial }: { initial: Settings }) {
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsapp_number)
  const [whatsappMessage, setWhatsappMessage] = useState(initial.whatsapp_message)
  const [whatsappFloating, setWhatsappFloating] = useState(initial.whatsapp_floating === 'true')
  const [instagramPath, setInstagramPath] = useState(initial.instagram_path)
  const [gmailUser, setGmailUser] = useState(initial.gmail_user)
  const [gmailAppPassword, setGmailAppPassword] = useState(initial.gmail_app_password)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { key: 'whatsapp_number',    value: whatsappNumber },
        { key: 'whatsapp_message',   value: whatsappMessage },
        { key: 'whatsapp_floating',  value: String(whatsappFloating) },
        { key: 'instagram_path',     value: instagramPath },
        { key: 'gmail_user',         value: gmailUser },
        { key: 'gmail_app_password', value: gmailAppPassword },
      ]),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    else { const d = await res.json().catch(() => ({})); setError(d.error ?? 'Erro ao salvar.') }
    setSaving(false)
  }

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
  const instagramHref = `https://instagram.com/${instagramPath}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

      {/* ── WhatsApp ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">WhatsApp</h2>
            <p className="text-xs text-neutral-400">Botão de contato direto no site.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Número <span className="text-neutral-400 font-normal">— DDI + DDD + número, só dígitos</span>
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
              <span className="px-3 py-2 bg-neutral-50 text-xs text-neutral-400 border-r border-neutral-200 select-none shrink-0">+</span>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="5511999999999"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Ex: 5511999999999 → Brasil (55) + DDD (11) + número</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Mensagem pré-preenchida <span className="text-neutral-400 font-normal">— aparece no chat ao clicar</span>
            </label>
            <textarea
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              placeholder="Olá! Gostaria de saber mais sobre os projetos."
            />
          </div>

          <Toggle
            checked={whatsappFloating}
            onChange={setWhatsappFloating}
            label="Botão flutuante"
            description="Ícone verde fixo no canto inferior direito em todas as páginas do site."
          />

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg hover:border-neutral-400 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            Testar link do WhatsApp
          </a>
        </div>
      </div>

      {/* ── Instagram ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Instagram</h2>
            <p className="text-xs text-neutral-400">Ícone no rodapé e na navbar do site.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Usuário</label>
            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
              <span className="px-3 py-2 bg-neutral-50 text-sm text-neutral-400 border-r border-neutral-200 select-none">@</span>
              <input
                type="text"
                value={instagramPath}
                onChange={(e) => setInstagramPath(e.target.value.replace('@', ''))}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="domu.arquitetura"
              />
            </div>
          </div>

          {instagramPath && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg hover:border-neutral-400 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
              Abrir perfil
            </a>
          )}
        </div>
      </div>

      {/* ── Email ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Email de contato</h2>
            <p className="text-xs text-neutral-400">Recebe as mensagens enviadas pelo formulário do site.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Gmail que recebe os contatos</label>
            <input
              type="email"
              value={gmailUser}
              onChange={(e) => setGmailUser(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="seuemail@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Senha de App do Google</label>
            <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
              <input
                type={showPassword ? 'text' : 'password'}
                value={gmailAppPassword}
                onChange={(e) => setGmailAppPassword(e.target.value)}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="xxxx xxxx xxxx xxxx"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="px-3 py-2 text-xs text-neutral-400 hover:text-neutral-700 border-l border-neutral-200 bg-neutral-50 transition-colors"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
              <p className="text-xs text-blue-800 font-medium">Como gerar:</p>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline font-medium">myaccount.google.com/apppasswords</a></li>
                <li>No campo "Nome do app" coloque o nome do seu escritório</li>
                <li>Clique em <strong>Criar</strong></li>
                <li className="font-semibold text-blue-800">O código aparece apenas uma vez — copie, cole aqui e salve imediatamente.</li>
              </ol>
              <a
                href="https://myaccount.google.com/signinoptions/twosv"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-500 underline hover:text-blue-700"
              >
                Requer verificação em 2 etapas ativada na conta Google.
              </a>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <SaveButton saving={saving} saved={saved} />
    </form>
  )
}
