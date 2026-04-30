'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify, extractTiptapText } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import TiptapEditor from './TiptapEditor'
import TiptapPreview from './TiptapPreview'
import ImageUpload from './ImageUpload'
import GalleryUpload from './GalleryUpload'
import type { JSONContent } from '@tiptap/react'

type Category = { id: string; name: string; disabled?: boolean }
type Project = {
  id?: string; title: string; slug: string; category_id: string; date: string
  main_image: string; gallery: string[]; content: JSONContent | null
  is_featured: boolean; meta_description?: string
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center">
      <button type="button" onClick={() => setShow((v) => !v)}
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onBlur={() => setShow(false)}
        className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-bold flex items-center justify-center hover:bg-neutral-300 transition-colors touch-manipulation"
        aria-label="Informação" aria-expanded={show}>i</button>
      {show && (
        <span className="absolute left-0 top-7 md:left-6 md:top-1/2 md:-translate-y-1/2 z-50 w-64 md:w-56 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          {text}
        </span>
      )}
    </span>
  )
}

type Props = { categories: Category[]; initial?: Project; defaultCategoryId?: string; galleryLimit?: number; maxFileSizeMB?: number }

export default function ProjectForm({ categories, initial, defaultCategoryId, galleryLimit, maxFileSizeMB = 5 }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? defaultCategoryId ?? '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split('T')[0])
  const [mainImage, setMainImage] = useState<string>(initial?.main_image ?? '')
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? [])
  const [content, setContent] = useState<JSONContent | null>(initial?.content ?? null)
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false)
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!initial) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mainImage) { setError('A imagem principal é obrigatória.'); return }
    if (!categoryId) { setError('Selecione uma categoria.'); return }
    setSaving(true)
    setError('')
    const payload = {
      title, slug, category_id: categoryId, date, main_image: mainImage,
      gallery, content, is_featured: isFeatured,
      meta_description: metaDescription || null,
      updated_at: new Date().toISOString(),
    }
    if (initial) {
      const { error } = await supabase.from('projects').update(payload).eq('id', initial.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, category_id: categoryId }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erro ao criar projeto.'); setSaving(false); return }
    }
    router.push('/dashboard/projects')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 space-y-5 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Título</label>
              <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Nome do projeto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Categoria</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900">
                <option value="">Selecione...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} disabled={c.disabled}>
                    {c.name}{c.disabled ? ' (limite atingido)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Data</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input id="featured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-neutral-300" />
            <label htmlFor="featured" className="text-sm text-neutral-700">Destaque no Hero</label>
            <InfoTooltip text="Projetos marcados aparecem em destaque no carrossel da página principal (Hero)." />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-neutral-700">Imagens</span>
              <InfoTooltip text={`Tamanho máximo por imagem: ${maxFileSizeMB}MB. Formatos aceitos: JPG, PNG, WebP, GIF.`} />
            </div>
            <ImageUpload value={mainImage} onChange={setMainImage} maxSizeMB={maxFileSizeMB} />
            <div className="pt-2"><GalleryUpload value={gallery} onChange={setGallery} limit={galleryLimit} maxSizeMB={maxFileSizeMB} /></div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-neutral-700">SEO / Metadados</h3>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Título (gerado automaticamente)</label>
              <input type="text" readOnly value={title || 'Preencha o título do projeto'}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-400 bg-neutral-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                Descrição SEO <span className="text-neutral-400">({metaDescription.length}/160)</span>
              </label>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160} rows={3} placeholder="Breve descrição do projeto para motores de busca..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Conteúdo</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : initial ? 'Salvar Alterações' : 'Criar Projeto'}</Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/projects')}>Cancelar</Button>
          </div>
        </div>

        <div className="w-full lg:w-96 lg:shrink-0 lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Card Preview</span>
            </div>
            <div className="p-4">
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                  {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mainImage} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">Sem imagem</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-neutral-900 mb-1 text-sm">{title || 'Título do projeto'}</h3>
                  <p className="text-xs text-neutral-400 mb-2" suppressHydrationWarning>{date || 'Data'}</p>
                  {content && <p className="text-sm text-neutral-500 line-clamp-2">{extractTiptapText(content, 110)}</p>}
                </div>
              </div>
            </div>
          </div>
          <TiptapPreview title={title} mainImage={mainImage || null} content={content} date={date} gallery={gallery} />
        </div>
      </div>
    </form>
  )
}
