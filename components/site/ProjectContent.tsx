'use client'

import { useState, useEffect } from 'react'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'

export default function ProjectContent({ content }: { content: unknown }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (!content) return
    let parsed = content
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch { return }
    }
    try { setHtml(generateHTML(parsed as any, [StarterKit, TiptapImage])) } catch {}
  }, [content])

  if (!html) return null

  return (
    <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  )
}
