'use client'

import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import type { JSONContent } from '@tiptap/react'
import { useMemo } from 'react'
import YoutubeEmbed from '@/lib/tiptap/youtube'

type Props = { title: string; mainImage: string | null; content: JSONContent | null; date: string; gallery?: string[] }

export default function TiptapPreview({ title, mainImage, content, date, gallery }: Props) {
  const html = useMemo(() => {
    if (!content) return ''
    try { return generateHTML(content, [StarterKit, Image, YoutubeEmbed]) } catch { return '' }
  }, [content])

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Preview</span>
      </div>
      <div className="p-6">
        {mainImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mainImage} alt={title} className="w-full aspect-video object-cover rounded-lg mb-6" />
        )}
        {title && <h1 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h1>}
        {date && <p className="text-sm text-neutral-400 mb-6">{date}</p>}
        {html ? (
          <div className="prose prose-neutral max-w-none text-sm">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ) : (
          <p className="text-sm text-neutral-400 italic">O conteúdo aparecerá aqui...</p>
        )}
        {gallery && gallery.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-neutral-900 mb-3">Galeria</h2>
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`foto ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-neutral-200" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
