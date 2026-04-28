import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugifyLib from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, locale: 'pt' })
}

export function extractTiptapText(content: unknown, maxLength = 120): string {
  if (!content || typeof content !== 'object') return ''
  const parts: string[] = []
  function walk(node: any) {
    if (node.type === 'text' && typeof node.text === 'string') parts.push(node.text)
    if (Array.isArray(node.content)) node.content.forEach(walk)
  }
  walk(content)
  const text = parts.join(' ').trim()
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text
}

export function truncate(text: string, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
