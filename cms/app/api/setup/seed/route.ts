import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://lsconfex.com.br/'

const CATEGORIAS = [
  { nome: 'Pochetes', slug: 'pochetes' },
  { nome: 'Mochilas', slug: 'mochilas' },
  { nome: 'Shoulder Bags', slug: 'shoulder-bags' },
  { nome: 'Sling Bags', slug: 'sling-bags' },
  { nome: 'Tote Bags', slug: 'tote-bags' },
  { nome: 'Eco Bags', slug: 'eco-bags' },
  { nome: 'Malas', slug: 'malas' },
  { nome: 'Bolsas', slug: 'bolsas' },
  { nome: 'Acessórios', slug: 'acessorios' },
]

const PRODUTOS = [
  { nome: 'Pochete Tática', cat: 'pochetes', img: 'imagens/produto-pochete-tatica.webp', destaque: true },
  { nome: 'Pochete Street', cat: 'pochetes', img: 'imagens/produto-pochete-thugnine.jpeg', destaque: true },
  { nome: 'Pochete Clássica', cat: 'pochetes', img: 'imagens/destaque-pochete.webp', destaque: true },
  { nome: 'Pochete Sherpa Preta', cat: 'pochetes', img: 'imagens/produto-1.jpg' },
  { nome: 'Pochete Cotelê Off-White', cat: 'pochetes', img: 'imagens/produto-5.jpg' },
  { nome: 'Pochete Expedition', cat: 'pochetes', img: 'imagens/produto-3.jpg' },
  { nome: 'Pochete Bicolor Canvas', cat: 'pochetes', img: 'imagens/produto-58.jpg' },
  { nome: 'Pochete Cotelê Caramelo', cat: 'pochetes', img: 'imagens/produto-94.jpg' },
  { nome: 'Pochete Fanny Pack', cat: 'pochetes', img: 'imagens/pochetes/005_16_58_36_763_bolovo_14917_ac_010-16060690.jpg' },
  { nome: 'Pochete Slim Nylon', cat: 'pochetes', img: 'imagens/pochetes/006_10_53_43_908_bolovo_2001-20copiar-10065380.jpg' },
  { nome: 'Mochila Tricolor Urbana', cat: 'mochilas', img: 'imagens/produto-mochila-tricolor.jpeg', destaque: true },
  { nome: 'Mochila Sport', cat: 'mochilas', img: 'imagens/destaque-mochila-esportiva.jpg', destaque: true },
  { nome: 'Mochila Sport Brinde', cat: 'mochilas', img: 'imagens/brinde-mochila-sport.jpeg' },
  { nome: 'Mochila Executiva Premium', cat: 'mochilas', img: 'imagens/brinde-mochila-executiva.jpeg' },
  { nome: 'Mochila Vintage Canvas', cat: 'mochilas', img: 'imagens/Mochilas/006_15_26_35_994_bolovo_348-20copiar-15127510.jpg' },
  { nome: 'Mochila Preta Clássica', cat: 'mochilas', img: 'imagens/Mochilas/007_16_25_53_109_bolovo_14917_ac_025-16065960.jpg' },
  { nome: 'Mochila Slim Casual', cat: 'mochilas', img: 'imagens/Mochilas/008_00_08_19_666_bolovo_1555-20copiar-00065960.jpg' },
  { nome: 'Shoulder Esportiva', cat: 'shoulder-bags', img: 'imagens/produto-shoulder-bicolor.jpeg', destaque: true },
  { nome: 'Mini Shoulder Corda', cat: 'shoulder-bags', img: 'imagens/produto-shoulder-mini.webp' },
  { nome: 'Mini Shoulder Bag', cat: 'shoulder-bags', img: 'imagens/destaque-shoulder.webp', destaque: true },
  { nome: 'Shoulder Tática Urban', cat: 'shoulder-bags', img: 'imagens/produto-bag-urban.webp' },
  { nome: 'Shoulder Preta Clássica', cat: 'shoulder-bags', img: 'imagens/Sholderbags/005_16_03_44_852_16_3_9_983_onlinebolovo_0003_bolsa203.jpg' },
  { nome: 'Shoulderzinha Preta', cat: 'shoulder-bags', img: 'imagens/Sholderbags/006_16_04_57_844_16_3_2_273_shoulderzinha20bolovo20preta.jpg' },
  { nome: 'Sling Bag Graffiti', cat: 'sling-bags', img: 'imagens/destaque-slingbag.webp', destaque: true },
  { nome: 'Sling Bag Bicolor', cat: 'sling-bags', img: 'imagens/destaque-slingbag2.webp', destaque: true },
  { nome: 'Sling Bag Gota', cat: 'sling-bags', img: 'imagens/produto-slingbag-cinza.webp' },
  { nome: 'Sling Bag Tático', cat: 'sling-bags', img: 'imagens/produto-slingbag-tatico.jpeg' },
  { nome: 'Sling Bag Tricolor', cat: 'sling-bags', img: 'imagens/produto-9.jpg' },
  { nome: 'Tote Jeans', cat: 'tote-bags', img: 'imagens/destaque-tote-jeans.webp', destaque: true },
  { nome: 'Tote Canvas Estampada', cat: 'tote-bags', img: 'imagens/produto-tote-azul.webp' },
  { nome: 'Tote Mesh Roll-Top', cat: 'tote-bags', img: 'imagens/produto-tote-mesh.webp' },
  { nome: 'Tote Bag Térmica', cat: 'tote-bags', img: 'imagens/brinde-tote-preta.jpeg' },
  { nome: 'Eco Bag Canvas Natural', cat: 'eco-bags', img: 'imagens/categoria-ecobag.jpeg', destaque: true },
  { nome: 'Eco Bag com Alça de Corda', cat: 'eco-bags', img: 'imagens/brinde-ecobag-natural.png' },
  { nome: 'Eco Bag Slim', cat: 'eco-bags', img: 'imagens/produto-25.jpg' },
  { nome: 'Mala de Mão Preta', cat: 'malas', img: 'imagens/Malas/005_20_4_6_600_11_7_5_524_malademaoviagempreta4.jpg' },
  { nome: 'Mala de Viagem Listras', cat: 'malas', img: 'imagens/Malas/006_20_4_5_552_17_7_8_861_onlinelistras_0000_bolovo43.jpg' },
  { nome: 'Mala Executiva', cat: 'malas', img: 'imagens/Malas/007_09_45_54_58_9_10_9_964_onlinebolovo_0008_bolovo20101.jpg' },
  { nome: 'Mala Compacta', cat: 'malas', img: 'imagens/Malas/008_09_46_00_62_9_10_2_266_onlinebolovo_0006_bolovo20103.jpg' },
  { nome: 'Crossbody Puffer', cat: 'bolsas', img: 'imagens/destaque-crossbody-puffer.jpeg', destaque: true },
  { nome: 'Puffer Bag', cat: 'bolsas', img: 'imagens/destaque-puffer.webp', destaque: true },
  { nome: 'Bolsa Crossbody', cat: 'bolsas', img: 'imagens/produto-6.jpg' },
  { nome: 'Bolsa Transversal Slim', cat: 'bolsas', img: 'imagens/produto-7.jpg' },
  { nome: 'Necessaire com Visor', cat: 'acessorios', img: 'imagens/brinde-necessaire.png' },
  { nome: 'Carteira Slim', cat: 'acessorios', img: 'imagens/produto-4.jpg' },
  { nome: 'Porta-Documentos', cat: 'acessorios', img: 'imagens/produto-8.jpg' },
]

function toSlug(nome: string) {
  return nome.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !key) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Insert categories
  const { data: cats, error: catErr } = await supabase
    .from('categorias')
    .upsert(CATEGORIAS.map(c => ({ nome: c.nome, slug: c.slug, ativo: true })), { onConflict: 'slug' })
    .select()

  if (catErr) return NextResponse.json({ error: 'categorias: ' + catErr.message }, { status: 500 })

  const catMap: Record<string, string> = {}
  for (const c of (cats ?? [])) catMap[c.slug] = c.id

  // Fetch existing cat ids if upsert returned empty
  if (Object.keys(catMap).length === 0) {
    const { data } = await supabase.from('categorias').select('id, slug')
    for (const c of (data ?? [])) catMap[c.slug] = c.id
  }

  // Insert products
  const produtos = PRODUTOS.map(p => ({
    nome: p.nome,
    slug: toSlug(p.nome),
    categoria_id: catMap[p.cat] ?? null,
    imagem: BASE_URL + p.img,
    destaque: p.destaque ?? false,
    ativo: true,
    caracteristicas: [],
  }))

  const { error: prodErr, count } = await supabase
    .from('produtos')
    .upsert(produtos, { onConflict: 'slug', ignoreDuplicates: false })

  if (prodErr) return NextResponse.json({ error: 'produtos: ' + prodErr.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    categorias: cats?.length ?? 0,
    produtos: produtos.length,
  })
}
