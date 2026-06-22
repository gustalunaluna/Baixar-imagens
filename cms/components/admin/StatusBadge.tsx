import type { LeadStatus } from '@/types'
import { cn } from '@/lib/utils'

const config: Record<LeadStatus, { label: string; className: string }> = {
  novo:      { label: 'Novo',      className: 'bg-[#e8ff00] text-black' },
  atendido:  { label: 'Atendido',  className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  arquivado: { label: 'Arquivado', className: 'bg-white/5 text-[#888] border border-[#1c1c1c]' },
}

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const { label, className } = config[status] ?? config.novo
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wider', className)}>
      {label}
    </span>
  )
}
