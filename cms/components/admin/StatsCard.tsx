import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: number | string
  icon: LucideIcon
  accent?: boolean
}

export default function StatsCard({ title, value, icon: Icon, accent }: Props) {
  return (
    <div className="bg-[#111] border border-[#1c1c1c] p-6 flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${accent ? 'bg-[#e8ff00]' : 'bg-[#1c1c1c]'}`}>
        <Icon size={22} className={accent ? 'text-black' : 'text-[#e8ff00]'} />
      </div>
      <div>
        <p className="text-[#888] text-xs uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black mt-0.5">{value}</p>
      </div>
    </div>
  )
}
