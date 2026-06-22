'use client'
import { Menu } from 'lucide-react'

interface Props {
  title: string
  onMenuClick: () => void
}

export default function Header({ title, onMenuClick }: Props) {
  return (
    <header className="h-16 border-b border-[#1c1c1c] flex items-center px-6 gap-4 bg-[#080808]">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-[#888] hover:text-white"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-bold text-base uppercase tracking-widest text-white">{title}</h1>
    </header>
  )
}
