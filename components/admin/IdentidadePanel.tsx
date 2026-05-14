'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import LogoBrand from '@/components/LogoBrand'

const FONTS = [
  { label: 'Sistema',      cssVar: '' },
  { label: 'Geist',        cssVar: 'var(--font-geist-sans)' },
  { label: 'Playfair',     cssVar: 'var(--font-playfair)' },
  { label: 'Cormorant',    cssVar: 'var(--font-cormorant)' },
  { label: 'Montserrat',   cssVar: 'var(--font-montserrat)' },
  { label: 'Josefin Sans', cssVar: 'var(--font-josefin)' },
  { label: 'Baskerville',  cssVar: 'var(--font-baskerville)' },
]

const ALIGNS: { value: 'start' | 'center' | 'end'; label: string }[] = [
  { value: 'start',  label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'end',    label: 'Direita' },
]

const PALETTES = [
  { id: 'preto',    label: 'Preto',    primary: '#000000' },
  { id: 'azul',     label: 'Azul',     primary: '#1E3A8A' },
  { id: 'vermelho', label: 'Vermelho', primary: '#991B1B' },
  { id: 'verde',    label: 'Verde',    primary: '#14532D' },
  { id: 'roxo',     label: 'Roxo',     primary: '#4C1D95' },
  { id: 'laranja',  label: 'Laranja',  primary: '#7C2D12' },
  { id: 'marrom',   label: 'Marrom',   primary: '#6B3A2A' },
  { id: 'cinza',    label: 'Cinza',    primary: '#374151' },
]

type Props = {
  logoInitial: {
    companyName: string
    type: 'text' | 'image'
    name: string
    subname: string
    imageUrl: string
    logoFont: string
    subnameAlign: 'start' | 'center' | 'end'
  }
  colorInitial: {
    primaryColor: string
    secondaryColor: string
  }
}

export default function IdentidadePanel({ logoInitial, colorInitial }: Props) {
  // Logo state
  const [companyName, setCompanyName] = useState(logoInitial.companyName)
  const [type, setType]               = useState<'text' | 'image'>(logoInitial.type)
  const [name, setName]               = useState(logoInitial.name)
  const [subname, setSubname]         = useState(logoInitial.subname)
  const [imageUrl, setImageUrl]       = useState(logoInitial.imageUrl)
  const [logoFont, setLogoFont]       = useState(logoInitial.logoFont)
  const [subnameAlign, setSubnameAlign] = useState<'start' | 'center' | 'end'>(logoInitial.subnameAlign)

  // Color state — secondary is always white
  const [primary, setPrimary] = useState(colorInitial.primaryColor)

  const titlePreviewColor = (() => {
    // approximate color-mix(primary 10%, #1a1a1a) in JS for live preview
    const hex = primary.replace('#', '')
    const r = Math.round(parseInt(hex.slice(0,2),16) * 0.10 + 26 * 0.90)
    const g = Math.round(parseInt(hex.slice(2,4),16) * 0.10 + 26 * 0.90)
    const b = Math.round(parseInt(hex.slice(4,6),16) * 0.10 + 26 * 0.90)
    return `rgb(${r},${g},${b})`
  })()

  // Save state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const selectedPaletteId = PALETTES.find(
    (p) => p.primary.toLowerCase() === primary.toLowerCase()
  )?.id ?? 'custom'

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { key: 'company_name',       value: companyName },
        { key: 'logo_type',          value: type },
        { key: 'logo_name',          value: name },
        { key: 'logo_subname',       value: subname },
        { key: 'logo_image_url',     value: imageUrl },
        { key: 'logo_font',          value: logoFont },
        { key: 'logo_subname_align', value: subnameAlign },
        { key: 'primary_color',      value: primary },
        { key: 'secondary_color',    value: '#FFFFFF' },
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

        {/* Company name */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">Nome da empresa</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Aparece no rodapé, CTA e título da aba do browser.
          </p>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Arquitetura Organizada"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {/* Logo */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Logo</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Exibido na barra de navegação do site.</p>
            </div>
            <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
              <button type="button" onClick={() => setType('text')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${type === 'text' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Texto
              </button>
              <button type="button" onClick={() => setType('image')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${type === 'image' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Imagem
              </button>
            </div>
          </div>

          {type === 'text' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Linha de cima <span className="text-neutral-400 font-normal">(destaque)</span>
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="ARQUITETURA"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Linha de baixo <span className="text-neutral-400 font-normal">(menor peso)</span>
                  </label>
                  <input type="text" value={subname} onChange={(e) => setSubname(e.target.value)}
                    placeholder="organizada"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-2">Tipografia</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {FONTS.map((f) => (
                    <button key={f.cssVar} type="button" onClick={() => setLogoFont(f.cssVar)}
                      className={`px-3 py-2.5 rounded-lg border text-xs transition-colors text-left ${logoFont === f.cssVar ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-medium' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}>
                      <span style={{ fontFamily: f.cssVar || undefined }} className="block text-sm mb-0.5">Aa</span>
                      <span className="text-[10px] text-neutral-500">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-2">
                  Alinhamento da linha de baixo
                </label>
                <div className="flex gap-2">
                  {ALIGNS.map((a) => (
                    <button key={a.value} type="button" onClick={() => setSubnameAlign(a.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-colors ${subnameAlign === a.value ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-medium' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-neutral-400 mb-3">
                Use PNG ou SVG com fundo transparente. Altura recomendada: 40–60px.
              </p>
              <ImageUpload value={imageUrl} onChange={setImageUrl} bucket="logo" label="Imagem do Logo" />
            </div>
          )}
        </div>

        {/* Palette presets */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">Paleta de Cores</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Define a cor principal dos fundos, botões e elementos de destaque do site.
          </p>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-5">
            <span className="text-amber-500 text-xs mt-px flex-shrink-0">★</span>
            <p className="text-xs text-amber-700 leading-relaxed">
              As cores pré-definidas abaixo são testadas e recomendadas para melhor contraste e visualização no site.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            {PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => setPrimary(palette.primary)}
                title={palette.label}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`w-11 h-11 rounded-full transition-all ${
                    selectedPaletteId === palette.id
                      ? 'ring-2 ring-offset-2 ring-neutral-900 border-2 border-neutral-900'
                      : 'border-2 border-neutral-200 group-hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: palette.primary }}
                />
                <span className="text-[10px] text-neutral-500 text-center leading-tight w-14">
                  {palette.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom hex */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-0.5">Personalizado</h2>
          <p className="text-xs text-neutral-400 mb-4">
            Insira qualquer hex. Contraste recomendado acima de 6:1 com branco.
          </p>
          <div className="flex items-center gap-2">
            <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300 p-0.5 bg-transparent flex-shrink-0" />
            <input type="text" value={primary} onChange={(e) => setPrimary(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 uppercase"
              maxLength={7} placeholder="#000000" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      {/* ── Preview ── */}
      <div className="xl:w-80 xl:shrink-0 xl:sticky xl:top-8 xl:self-start space-y-3">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Preview</p>

        {/* Mini site template */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden text-[11px] shadow-sm">

          {/* Navbar */}
          <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <LogoBrand
              type={type}
              name={name}
              subname={subname}
              imageUrl={imageUrl}
              logoFont={logoFont}
              subnameAlign={subnameAlign}
              nameColor={primary}
            />
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex gap-1.5">
                <div className="w-6 h-1 bg-neutral-200 rounded" />
                <div className="w-6 h-1 bg-neutral-200 rounded" />
                <div className="w-6 h-1 bg-neutral-200 rounded" />
              </div>
              <div className="flex flex-col gap-[3px] ml-1">
                <div className="w-3.5 h-0.5 rounded" style={{ backgroundColor: primary }} />
                <div className="w-3.5 h-0.5 rounded" style={{ backgroundColor: primary }} />
                <div className="w-3.5 h-0.5 rounded" style={{ backgroundColor: primary }} />
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="bg-neutral-50 px-5 py-5 text-center">
            <p className="font-bold text-[15px] leading-snug mb-1">
              <span style={{ color: titlePreviewColor }}>Seu escritório de </span>
              <span style={{ color: primary }}>Arquitetura</span>
            </p>
            <p className="text-neutral-500 text-[10px] mb-3">Design de interiores e projetos exclusivos.</p>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] text-white font-medium"
                style={{ backgroundColor: primary }}>
                Ver Projetos →
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-medium border"
                style={{ borderColor: primary, color: primary }}>
                Saiba Mais
              </span>
            </div>
          </div>

          {/* Projects section */}
          <div className="bg-white px-5 py-4 border-t border-neutral-100">
            <p className="font-semibold text-[12px] text-center mb-3">
              <span style={{ color: titlePreviewColor }}>Nossos </span>
              <span style={{ color: primary }}>Projetos</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[0,1,2].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-neutral-200">
                  <div className="h-8 bg-neutral-100" />
                  <div className="px-1.5 py-1">
                    <div className="w-full h-1 bg-neutral-200 rounded mb-0.5" />
                    <div className="w-2/3 h-0.5 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <span className="text-[9px] border rounded px-2 py-0.5" style={{ borderColor: primary, color: primary }}>
                Ver todos →
              </span>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100">
            <p className="font-semibold text-[12px] text-center mb-2">
              <span style={{ color: titlePreviewColor }}>Entre em </span>
              <span style={{ color: primary }}>Contato</span>
            </p>
            <div className="flex gap-1.5">
              <span className="flex-1 text-center py-1 rounded-lg text-[9px] font-medium border"
                style={{ borderColor: primary, color: primary }}>
                WhatsApp
              </span>
              <span className="flex-1 text-center py-1 rounded-lg text-[9px] font-medium text-white"
                style={{ backgroundColor: primary }}>
                Instagram
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 py-4 text-center" style={{ backgroundColor: primary }}>
            <p className="text-white font-semibold text-[11px] mb-0.5">Pronto para começar?</p>
            <p className="text-white/60 text-[9px] mb-2">Transforme seu espaço com a gente.</p>
            <span className="px-4 py-1 rounded-full text-[9px] font-medium"
              style={{ backgroundColor: '#FFFFFF', color: primary }}>
              Fale Conosco →
            </span>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: primary }}>
            <div className="text-white/90">
              <LogoBrand
                type={type}
                name={name}
                subname={subname}
                imageUrl={imageUrl}
                logoFont={logoFont}
                subnameAlign={subnameAlign}
              />
            </div>
            <span className="text-[8px] text-white/40">© 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}
