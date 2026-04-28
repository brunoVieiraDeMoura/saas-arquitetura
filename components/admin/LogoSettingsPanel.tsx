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

type Props = {
  initial: {
    companyName: string
    type: 'text' | 'image'
    name: string
    subname: string
    imageUrl: string
    logoFont: string
    subnameAlign: 'start' | 'center' | 'end'
  }
}

export default function LogoSettingsPanel({ initial }: Props) {
  const [companyName, setCompanyName] = useState(initial.companyName)
  const [type, setType] = useState<'text' | 'image'>(initial.type)
  const [name, setName] = useState(initial.name)
  const [subname, setSubname] = useState(initial.subname)
  const [imageUrl, setImageUrl] = useState(initial.imageUrl)
  const [logoFont, setLogoFont] = useState(initial.logoFont)
  const [subnameAlign, setSubnameAlign] = useState<'start' | 'center' | 'end'>(initial.subnameAlign || 'end')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

        {/* Logo type */}
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

        <button type="button" onClick={handleSave} disabled={saving}
          className="w-full py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-60 transition-colors">
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      {/* ── Preview ── */}
      <div className="xl:w-80 xl:shrink-0 xl:sticky xl:top-8 xl:self-start space-y-3">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Preview</p>

        {/* Navbar clara */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <LogoBrand type={type} name={name} subname={subname} imageUrl={imageUrl} logoFont={logoFont} subnameAlign={subnameAlign} />
            <div className="flex gap-3">
              <div className="w-10 h-1.5 bg-neutral-200 rounded" />
              <div className="w-10 h-1.5 bg-neutral-200 rounded" />
              <div className="w-10 h-1.5 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="bg-neutral-50 px-4 py-6">
            <div className="w-32 h-2 bg-neutral-200 rounded mb-2" />
            <div className="w-48 h-1.5 bg-neutral-100 rounded" />
          </div>
          <div className="px-3 py-1.5 bg-white border-t border-neutral-100">
            <p className="text-[10px] text-neutral-400">Modo claro</p>
          </div>
        </div>

        {/* Navbar escura */}
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <div className="bg-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="text-white">
              <LogoBrand type={type} name={name} subname={subname} imageUrl={imageUrl} logoFont={logoFont} subnameAlign={subnameAlign} />
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-1.5 bg-neutral-700 rounded" />
              <div className="w-10 h-1.5 bg-neutral-700 rounded" />
              <div className="w-10 h-1.5 bg-neutral-700 rounded" />
            </div>
          </div>
          <div className="bg-neutral-800 px-4 py-6">
            <div className="w-32 h-2 bg-neutral-700 rounded mb-2" />
            <div className="w-48 h-1.5 bg-neutral-700 rounded" />
          </div>
          <div className="px-3 py-1.5 bg-neutral-900 border-t border-neutral-800">
            <p className="text-[10px] text-neutral-500">Modo escuro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
