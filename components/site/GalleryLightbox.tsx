'use client'

import { useState, useEffect } from 'react'

export default function GalleryLightbox({ images }: { images: { url: string; alt: string }[] }) {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selected === null) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setSelected((s) => ((s ?? 0) + 1) % images.length)
      if (e.key === 'ArrowLeft') setSelected((s) => ((s ?? 0) - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, images.length])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt}
              className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in" />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelected(null)} aria-label="Fechar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {images.length > 1 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); setSelected((s) => ((s ?? 0) - 1 + images.length) % images.length) }} aria-label="Anterior">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[selected].url} alt={images[selected].alt}
            className="max-w-full max-h-[85vh] object-contain select-none" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-black/30 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); setSelected((s) => ((s ?? 0) + 1) % images.length) }} aria-label="Próxima">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {selected + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  )
}
