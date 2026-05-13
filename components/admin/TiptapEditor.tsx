'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import type { JSONContent } from '@tiptap/react'
import YoutubeEmbed, { extractYoutubeId } from '@/lib/tiptap/youtube'

const Btn = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
  <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick() }}
    className={`px-2 py-1 rounded text-sm transition-colors ${active ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
    {children}
  </button>
)

export default function TiptapEditor({ content, onChange }: { content: JSONContent | null; onChange: (json: JSONContent) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: 'Escreva a descrição do projeto...' }),
      YoutubeEmbed,
    ],
    content: content ?? undefined,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: { attributes: { class: 'prose prose-neutral max-w-none min-h-[300px] px-4 py-3 focus:outline-none text-sm' } },
  })

  if (!editor) return null

  function addImage() {
    const url = window.prompt('URL da imagem:')
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  function setLink() {
    const url = window.prompt('URL do link:')
    if (url) editor!.chain().focus().setLink({ href: url }).run()
  }

  function addYoutube() {
    const input = window.prompt('Link do YouTube:')
    if (!input) return
    const videoId = extractYoutubeId(input.trim())
    if (!videoId) {
      window.alert('Link do YouTube inválido.')
      return
    }
    editor!.chain().focus().insertContent({ type: 'youtubeEmbed', attrs: { videoId } }).run()
  }

  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-neutral-200 bg-neutral-50">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><strong>B</strong></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><em>I</em></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>• Lista</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>1. Lista</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>" Citação</Btn>
        <Btn onClick={setLink} active={editor.isActive('link')}>Link</Btn>
        <Btn onClick={addImage}>Imagem</Btn>
        <Btn onClick={addYoutube}>▶ YouTube</Btn>
        <Btn onClick={() => editor.chain().focus().undo().run()}>↩ Desfazer</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()}>↪ Refazer</Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
