import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: url ? `✅ set (${url})` : '❌ MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon ? `✅ set (${anon.slice(0, 20)}...)` : '❌ MISSING',
    SUPABASE_SERVICE_ROLE_KEY: service ? `✅ set (${service.slice(0, 20)}...)` : '❌ MISSING',
  }

  if (!url || !anon) {
    return NextResponse.json({ error: 'Env vars missing', envStatus })
  }

  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const authCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'))

  let userResult: unknown = null
  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    })
    const { data, error } = await supabase.auth.getUser()
    userResult = error ? { error: error.message } : { user: data.user?.email, id: data.user?.id }
  } catch (e) {
    userResult = { exception: String(e) }
  }

  return NextResponse.json({
    envStatus,
    authCookiesFound: authCookies.map(c => c.name),
    totalCookies: allCookies.length,
    supabaseGetUser: userResult,
  })
}
