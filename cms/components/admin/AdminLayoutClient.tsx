'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import type { Profile } from '@/types'

const pageTitles: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/produtos':      'Produtos',
  '/categorias':    'Categorias',
  '/portfolio':     'Portfólio',
  '/banners':       'Banners',
  '/depoimentos':   'Depoimentos',
  '/leads':         'Leads',
  '/midia':         'Mídia',
  '/configuracoes': 'Configurações',
  '/usuarios':      'Usuários',
}

function getTitle(pathname: string) {
  for (const [key, val] of Object.entries(pageTitles)) {
    if (pathname === key || pathname.startsWith(key + '/')) return val
  }
  return 'Admin'
}

interface Props {
  profile: Profile | null
  children: React.ReactNode
}

export default function AdminLayoutClient({ profile, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Sidebar profile={profile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">
        <Header title={getTitle(pathname)} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}
