'use client'

import { useState } from 'react'

const PALETTES = [
  { id: 'classic',  label: 'Clássico',     primary: '#1E1E1E', secondary: '#FFFFFF' },
  { id: 'navy',     label: 'Azul Naval',   primary: '#0F2C45', secondary: '#E8D5B0' },
  { id: 'forest',   label: 'Floresta',     primary: '#1B3A2D', secondary: '#F0E6C8' },
  { id: 'espresso', label: 'Espresso',     primary: '#2B1D0E', secondary: '#F5E6C8' },
  { id: 'midnight', label: 'Meia-Noite',   primary: '#1A1A2E', secondary: '#C9A96E' },
  { id: 'charcoal', label: 'Carvão Bronze',primary: '#1C1C1C', secondary: '#C9A96E' },
  { id: 'ocean',    label: 'Oceano Teal',  primary: '#0D3349', secondary: '#7EC8C8' },
  { id: 'bordeaux', label: 'Bordô',        primary: '#3D1517', secondary: '#F5E0C8' },
]

type Props = {
  initial: {
    primaryColor: string
    secondaryColor: string
  }
}

export default function ColorSettingsPanel({ initial }: Props) {
  const [primary, setPrimary]     = useState(initial.primaryColor)
  const [secondary, setSecondary] = useState(initial.secondaryColor)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  const selectedId = PALETTES.find(
    (p) => p.primary.toLowerCase() === primary.toLowerCase() &&
           p.secondary.toLowerCase() === secondary.toLowerCase()
  )?.id ?? 'custom'

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { key: 'primary_color',   value: primary },
        { key: 'secondary_color', value: secondary },
      ]),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-5xl">

      {/* ── Settings ── */}
      <div className="flex-1 space-y-4">

        {/* Palette presets */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">Paleta de Cores</h2>
          <p className="text-xs text-neutral-400 mb-5">
            Primária define fundos e botões. Secundária contrasta dentro das seções escuras.
          </p>
          <div className="flex flex-wrap gap-5">
            {PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => { setPrimary(palette.primary); setSecondary(palette.secondary) }}
                title={palette.label}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-11 h-11 rounded-full overflow-hidden transition-all ${
                    selectedId === palette.id
                      ? 'ring-2 ring-offset-2 ring-neutral-900 border-2 border-neutral-900'
                      : 'border-2 border-neutral-200 group-hover:border-neutral-400'
                  }`}
                >
                  <div className="flex h-full">
                    <div className="flex-1" style={{ backgroundColor: palette.primary }} />
                    <div className="flex-1" style={{ backgroundColor: palette.secondary }} />
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500 text-center leading-tight w-14">
                  {palette.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom hex inputs */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">Personalizado</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Insira um hex qualquer. Contraste recomendado acima de 6:1.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-2">Cor Primária</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase min-w-0"
                  maxLength={7}
                  placeholder="#1E1E1E"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-2">Cor Secundária</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5 bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase min-w-0"
                  maxLength={7}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar cores'}
        </button>
      </div>

      {/* ── Preview ── */}
      <div className="xl:w-80 xl:shrink-0 xl:sticky xl:top-8 xl:self-start space-y-3">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Preview</p>

        {/* Navbar + botões (fundo claro) */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: primary }}
              >
                LOGO
              </span>
              <span className="text-[8px] tracking-widest uppercase opacity-50 text-neutral-500">
                nome
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex gap-2">
                <div className="w-7 h-1 bg-neutral-200 rounded" />
                <div className="w-7 h-1 bg-neutral-200 rounded" />
                <div className="w-7 h-1 bg-neutral-200 rounded" />
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="w-4 h-0.5 rounded" style={{ backgroundColor: primary }} />
                <div className="w-4 h-0.5 rounded" style={{ backgroundColor: primary }} />
                <div className="w-4 h-0.5 rounded" style={{ backgroundColor: primary }} />
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 px-4 py-5 flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              <span
                className="px-3 py-1.5 rounded-lg text-[11px] text-white font-medium"
                style={{ backgroundColor: primary }}
              >
                Botão CTA
              </span>
              <span
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                style={{ borderColor: primary, color: primary }}
              >
                Saiba Mais
              </span>
            </div>
            <div className="flex gap-2">
              <span
                className="flex-1 text-center px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                style={{ borderColor: primary, color: primary }}
              >
                WhatsApp
              </span>
              <span
                className="flex-1 text-center px-3 py-1.5 rounded-lg text-[11px] font-medium text-white"
                style={{ backgroundColor: primary }}
              >
                Instagram
              </span>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-white border-t border-neutral-100">
            <p className="text-[10px] text-neutral-400">Modo claro</p>
          </div>
        </div>

        {/* CTA + Footer (fundo escuro) */}
        <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: primary }}>
          {/* CTA mini */}
          <div className="px-4 py-5 text-center" style={{ backgroundColor: primary }}>
            <div className="w-28 h-1.5 bg-white/20 rounded mx-auto mb-1.5" />
            <div className="w-20 h-1 bg-white/10 rounded mx-auto mb-3" />
            <span
              className="px-4 py-1.5 rounded-full text-[11px] font-medium"
              style={{ backgroundColor: secondary, color: primary }}
            >
              Fale Conosco →
            </span>
          </div>

          {/* Footer mini */}
          <div
            className="px-4 py-3 flex items-center justify-between border-t border-white/10"
            style={{ backgroundColor: primary }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold tracking-widest uppercase text-white/90">LOGO</span>
              <span className="text-[7px] tracking-widest uppercase text-white/40">nome</span>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-1 bg-white/20 rounded" />
              <div className="w-7 h-1 bg-white/20 rounded" />
            </div>
            <span className="text-[8px] text-white/40">© 2025</span>
          </div>

          <div className="px-3 py-1.5 border-t border-white/10" style={{ backgroundColor: primary }}>
            <p className="text-[10px] text-white/30">Modo escuro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
