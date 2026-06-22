import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase.auth.admin.deleteUser(params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    await supabase.from('profiles').delete().eq('id', params.id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
