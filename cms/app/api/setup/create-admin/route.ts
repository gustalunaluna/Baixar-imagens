import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({
      error: 'SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel. Adicione essa variável de ambiente.',
      url: url ? '✅' : '❌ MISSING',
      serviceKey: serviceKey ? '✅' : '❌ MISSING',
    }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const email = 'lunasgustavo@hotmail.com'
  const password = 'Sexylovers100%'

  // Check if user already exists
  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users?.find(u => u.email === email)

  if (found) {
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(found.id, {
      password,
      email_confirm: true,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, action: 'password updated', email, id: found.id })
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insert profile
  await supabase.from('profiles').upsert({
    id: data.user.id,
    nome: 'Gustavo Luna',
    email,
    role: 'admin',
  })

  return NextResponse.json({ ok: true, action: 'user created', email, id: data.user.id })
}
