'use client'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#1c1c1c] max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-[#e8ff00] flex-shrink-0" />
          <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        {description && <p className="text-[#888] text-sm mb-6">{description}</p>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-[#1c1c1c] text-[#888] text-sm hover:text-white hover:border-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
