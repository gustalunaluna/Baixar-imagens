import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatDateShort(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 13) {
    return `+${digits.slice(0,2)} (${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9)}`
  }
  if (digits.length === 11) {
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }
  return phone
}

export function waLink(phone: string, message = ''): string {
  const digits = phone.replace(/\D/g, '')
  const num = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${num}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function fileSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
