import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const destaque = searchParams.get('destaque')
  const categoria = searchParams.get('categoria')

  const supabase = createServiceClient()

  let query = supabase
    .from('produtos')
    .select('id, nome, slug, descricao, imagem, caracteristicas, destaque, categoria:categorias(id, nome, slug)')
    .eq('ativo', true)
    .order('criado_em', { ascending: false })

  if (destaque === 'true') query = query.eq('destaque', true)
  if (categoria) query = query.eq('categorias.slug', categoria)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  }

  return NextResponse.json(data ?? [], { headers: { ...CORS, 'Cache-Control': 'public, s-maxage=60' } })
}
