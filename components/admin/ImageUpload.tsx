'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {
  value: string | null
  onChange: (url: string) => void
  bucket?: string
  label?: string
}
type Mode = 'upload' | 'url'

export default function ImageUpload({ value, onChange, bucket = 'projects', label = 'Imagem Principal' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<Mode>('upload')
  const [urlInput, setUrlInput] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok || json.error) setError(json.error ?? 'Erro ao enviar imagem')
      else onChange(json.url)
    } catch {
      setError('Falha na conexão ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }, [bucket, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: (r) => {
      const err = r[0]?.errors[0]
      setError(err?.code === 'file-too-large' ? 'Imagem deve ter no máximo 5MB' : 'Arquivo inválido')
    },
  })

  function handleUrlConfirm() {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http')) { setError('URL inválida. Deve começar com http:// ou https://'); return }
    onChange(trimmed)
    setUrlInput('')
    setError('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-neutral-700">
          {label} <span className="text-red-500">*</span>
        </label>
        {!value && (
          <div className="flex items-center gap-1 text-xs">
            <button type="button" onClick={() => { setMode('upload'); setError('') }}
              className={`px-2 py-0.5 rounded ${mode === 'upload' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'}`}>
              Upload
            </button>
            <button type="button" onClick={() => { setMode('url'); setError('') }}
              className={`px-2 py-0.5 rounded ${mode === 'url' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'}`}>
              URL
            </button>
          </div>
        )}
      </div>

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full max-h-48 object-cover rounded-lg border border-neutral-200" />
          <button type="button" onClick={() => { onChange(''); setError('') }}
            className="absolute top-2 right-2 bg-white border border-neutral-200 rounded-full w-7 h-7 flex items-center justify-center text-sm text-neutral-500 hover:bg-neutral-50">
            ✕
          </button>
        </div>
      ) : mode === 'upload' ? (
        <div {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400'} ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          <input {...getInputProps()} />
          <p className="text-sm text-neutral-500">
            {uploading ? 'Enviando...' : isDragActive ? 'Solte aqui' : 'Arraste uma imagem ou clique para selecionar (máx. 5MB)'}
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlConfirm())}
            placeholder="https://exemplo.com/imagem.jpg"
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900" />
          <button type="button" onClick={handleUrlConfirm}
            className="px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800">
            Usar
          </button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
