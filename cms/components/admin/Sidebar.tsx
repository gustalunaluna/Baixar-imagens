'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, Package, Tag, Images, Monitor,
  MessageSquare, Users, Image, Settings, UserCog, LogOut, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const navItems = [
  { href: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/produtos',      label: 'Produtos',     icon: Package },
  { href: '/categorias',    label: 'Categorias',   icon: Tag },
  { href: '/portfolio',     label: 'Portfólio',    icon: Images },
  { href: '/banners',       label: 'Banners',      icon: Monitor },
  { href: '/depoimentos',   label: 'Depoimentos',  icon: MessageSquare },
  { href: '/leads',         label: 'Leads',        icon: Users },
  { href: '/midia',         label: 'Mídia',        icon: Image },
  { href: '/configuracoes', label: 'Config.',      icon: Settings },
  { href: '/usuarios',      label: 'Usuários',     icon: UserCog },
]

interface Props {
  profile: Profile | null
  open: boolean
  onClose: () => void
}

export default function Sidebar({ profile, open, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada.')
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-[240px] bg-[#0d0d0d] border-r border-[#1c1c1c] z-40 flex flex-col',
        'transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#1c1c1c]">
          <span className="font-black uppercase tracking-widest text-sm">
            LS <span className="text-[#e8ff00]">Admin</span>
          </span>
          <button onClick={onClose} className="lg:hidden text-[#888] hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-5 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-[#e8ff00]/10 text-[#e8ff00] font-semibold border-r-2 border-[#e8ff00]'
                    : 'text-[#888] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="border-t border-[#1c1c1c] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#e8ff00] flex items-center justify-center">
              <span className="text-black text-xs font-black">
                {profile?.nome?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.nome ?? 'Admin'}</p>
              <p className="text-[#888] text-xs capitalize">{profile?.role ?? 'admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#888] hover:text-red-400 text-xs transition-colors w-full"
          >
            <LogOut size={13} />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
