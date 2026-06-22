'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import { createClient } from '@/lib/supabase'
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    init()
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <Sidebar
        profile={profile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">
        <Header
          title={getTitle(pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
