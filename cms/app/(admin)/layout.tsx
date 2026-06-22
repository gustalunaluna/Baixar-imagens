import { redirect } from 'next/navigation'
import { createAuthClient } from '@/lib/supabase-server'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'
import type { Profile } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient()
  // getSession reads the JWT cookie locally without a network call to Supabase.
  // getUser() was failing with "Auth session missing!" on this deployment.
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const user = session.user

  let profile: Profile | null = null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile = data as Profile | null

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <AdminLayoutClient profile={profile}>{children}</AdminLayoutClient>
    </div>
  )
}
