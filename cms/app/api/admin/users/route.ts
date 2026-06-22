import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const { nome, email, role, password } = await req.json()
    const supabase = createServiceClient()
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome, role },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    await supabase.from('profiles').upsert({ id: data.user.id, email, nome, role })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
