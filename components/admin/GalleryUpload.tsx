'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { Lock } from 'lucide-react'

type Props = { value: string[]; onChange: (urls: string[]) => void; limit?: number; maxSizeMB?: number }

export default function GalleryUpload({ value, onChange, limit, maxSizeMB = 5 }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const atLimit = limit !== undefined && limit !== Infinity && value.length >= limit

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setError('')
    const slots = limit !== undefined && limit !== Infinity ? limit - value.length : acceptedFiles.length
    const filesToUpload = acceptedFiles.slice(0, slots)
    const uploaded: string[] = []
    for (const file of filesToUpload) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'projects')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const json = await res.json()
        if (!res.ok || json.error) setError(json.error ?? 'Erro ao enviar imagem')
        else uploaded.push(json.url)
      } catch {
        setError('Falha na conexão ao enviar imagem')
      }
    }
    if (uploaded.length > 0) onChange([...value, ...uploaded])
    setUploading(false)
  }, [value, onChange, limit])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: atLimit,
    onDropRejected: (r) => {
      setError(r.some((x) => x.errors.some((e) => e.code === 'file-too-large'))
        ? `Cada imagem deve ter no máximo ${maxSizeMB}MB` : 'Arquivo inválido')
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-neutral-700">Galeria de Fotos</label>
        {limit !== undefined && limit !== Infinity && (
          <span className={`text-xs ${atLimit ? 'text-amber-600 font-medium' : 'text-neutral-400'}`}>
            {value.length}/{limit} fotos
          </span>
        )}
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {value.map((url) => (
            <div key={url} className="relative aspect-square max-h-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-neutral-200" />
              <button type="button" onClick={() => onChange(value.filter((u) => u !== url))}
                className="absolute top-1 right-1 bg-white border border-neutral-200 rounded-full w-6 h-6 flex items-center justify-center text-xs text-neutral-500 hover:bg-neutral-50">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {atLimit ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center shrink-0">
              <Lock size={14} className="text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">
                Limite de {limit} foto{limit !== 1 ? 's' : ''} atingido
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Faça upgrade para adicionar mais fotos por projeto.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 text-xs font-medium px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Upgrade →
          </Link>
        </div>
      ) : (
        <div {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragActive ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400'} ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          <input {...getInputProps()} />
          <p className="text-sm text-neutral-500">
            {uploading ? 'Enviando...' : 'Arraste fotos ou clique para adicionar à galeria'}
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
