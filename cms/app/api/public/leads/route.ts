import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nome, email, telefone, empresa, mensagem, origem } = body
    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }
    const supabase = createServiceClient()
    const { error } = await supabase.from('leads').insert({
      nome,
      email: email || null,
      telefone,
      empresa: empresa || null,
      mensagem: mensagem || null,
      origem: origem || 'site',
      status: 'novo',
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
