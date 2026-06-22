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
  { nome: 'Pochete Tática', cat: 'pochetes', img: 'imagens/produto-pochete-tatica.webp', destaque: true, descricao: 'Nylon tático preto com sistema MOLLE, dois compartimentos zipados e fivelas de liberação rápida. Alta resistência para uso intenso.' },
  { nome: 'Pochete Street', cat: 'pochetes', img: 'imagens/produto-pochete-thugnine.jpeg', destaque: true, descricao: 'Nylon leve com dois compartimentos zipados e painel frontal texturizado. Alça ajustável com fivela de liberação rápida.' },
  { nome: 'Pochete Clássica', cat: 'pochetes', img: 'imagens/destaque-pochete.webp', destaque: true, descricao: 'Três compartimentos, zíper reforçado e cinto ajustável. Compacta e funcional para a rotina urbana.' },
  { nome: 'Pochete Sherpa Preta', cat: 'pochetes', img: 'imagens/produto-1.jpg', descricao: 'Fanny pack em sherpa macio, zipper superior e patch de borracha. Personalizável com bordado ou silk screen.' },
  { nome: 'Pochete Cotelê Off-White', cat: 'pochetes', img: 'imagens/produto-5.jpg', descricao: 'Cotelê canelado off-white com bolso frontal zipado e patch ilustrado. Ideal para marcas de lifestyle e estilo retrô.' },
  { nome: 'Pochete Expedition', cat: 'pochetes', img: 'imagens/produto-3.jpg', descricao: 'Nylon leve verde oliva e chumbo com patch bordado estilo expedition. Perfeita para marcas de outdoor e aventura.' },
  { nome: 'Pochete Bicolor Canvas', cat: 'pochetes', img: 'imagens/produto-58.jpg', descricao: 'Canvas bicolor com dois compartimentos zipados, base em suede marrom e patch de borracha.' },
  { nome: 'Pochete Cotelê Caramelo', cat: 'pochetes', img: 'imagens/produto-94.jpg', descricao: 'Cotelê canelado marrom-caramelo com dois compartimentos e patch bordado de montanha. Estética outdoor.' },
  { nome: 'Pochete Fanny Pack', cat: 'pochetes', img: 'imagens/pochetes/005_16_58_36_763_bolovo_14917_ac_010-16060690.jpg', descricao: 'Fanny pack em ripstop leve com compartimento principal e zipper metálico. Alça ajustável para personalização de marca.' },
  { nome: 'Pochete Slim Nylon', cat: 'pochetes', img: 'imagens/pochetes/006_10_53_43_908_bolovo_2001-20copiar-10065380.jpg', descricao: 'Design slim em nylon com bolso frontal adicional e fivela de liberação rápida. Toque urbano para o dia a dia.' },
  { nome: 'Mochila Tricolor Urbana', cat: 'mochilas', img: 'imagens/produto-mochila-tricolor.jpeg', destaque: true, descricao: 'Couro sintético cinza com bolso frontal bicolor (azul e verde) e zipper dourado. Design urbano sofisticado.' },
  { nome: 'Mochila Sport', cat: 'mochilas', img: 'imagens/destaque-mochila-esportiva.jpg', destaque: true, descricao: 'Nylon de alta resistência, fivela frontal de segurança e alças ergonômicas. Ideal para marcas esportivas.' },
  { nome: 'Mochila Sport Brinde', cat: 'mochilas', img: 'imagens/brinde-mochila-sport.jpeg', descricao: 'Compartimentos organizadores, alças acolchoadas e fita de silicone para bordado de marca.' },
  { nome: 'Mochila Executiva Premium', cat: 'mochilas', img: 'imagens/brinde-mochila-executiva.jpeg', descricao: 'Compartimento para notebook, alças reforçadas e bolso frontal organizado. Perfeita para brindes corporativos.' },
  { nome: 'Mochila Vintage Canvas', cat: 'mochilas', img: 'imagens/Mochilas/006_15_26_35_994_bolovo_348-20copiar-15127510.jpg', descricao: 'Canvas resistente em tom neutro com detalhes em couro sintético e fivelas metálicas.' },
  { nome: 'Mochila Preta Clássica', cat: 'mochilas', img: 'imagens/Mochilas/007_16_25_53_109_bolovo_14917_ac_025-16065960.jpg', descricao: 'Nylon resistente com compartimentos múltiplos, alças ergonômicas acolchoadas e área de bordado.' },
  { nome: 'Mochila Slim Casual', cat: 'mochilas', img: 'imagens/Mochilas/008_00_08_19_666_bolovo_1555-20copiar-00065960.jpg', descricao: 'Perfil slim para uso diário com abertura dupla, bolso externo e alças reguláveis.' },
  { nome: 'Shoulder Esportiva', cat: 'shoulder-bags', img: 'imagens/produto-shoulder-bicolor.jpeg', destaque: true, descricao: 'Bicolor (azul marinho e branco) com formato meia-lua, painel em V e patch oval. Alça crossbody ajustável.' },
  { nome: 'Mini Shoulder Corda', cat: 'shoulder-bags', img: 'imagens/produto-shoulder-mini.webp', descricao: 'Tricolor (bege, azul e preto) com detalhe de corda trançada e patch bordado. Alça transversal ajustável.' },
  { nome: 'Mini Shoulder Bag', cat: 'shoulder-bags', img: 'imagens/destaque-shoulder.webp', destaque: true, descricao: 'Nylon tático com patch de logo em relevo e mosquetões metálicos. Pequena e cheia de personalidade.' },
  { nome: 'Shoulder Tática Urban', cat: 'shoulder-bags', img: 'imagens/produto-bag-urban.webp', descricao: 'Nylon tático com aba em tela para bordado, bolsos laterais em mesh e fivelas metálicas. Volumosa e resistente.' },
  { nome: 'Shoulder Preta Clássica', cat: 'shoulder-bags', img: 'imagens/Sholderbags/005_16_03_44_852_16_3_9_983_onlinebolovo_0003_bolsa203.jpg', descricao: 'Couro sintético preto com fivela dourada e alça metálica. Elegância urbana com área para personalização discreta.' },
  { nome: 'Shoulderzinha Preta', cat: 'shoulder-bags', img: 'imagens/Sholderbags/006_16_04_57_844_16_3_2_273_shoulderzinha20bolovo20preta.jpg', descricao: 'Mini shoulder em nylon ultra-leve com clip rápido, compartimento zipado e patch de silicone.' },
  { nome: 'Sling Bag Graffiti', cat: 'sling-bags', img: 'imagens/destaque-slingbag.webp', destaque: true, descricao: 'Estampa grafite exclusiva, fivelas táticas e alça transversal ajustável. Visual que não passa despercebido.' },
  { nome: 'Sling Bag Bicolor', cat: 'sling-bags', img: 'imagens/destaque-slingbag2.webp', destaque: true, descricao: 'Bege e verde militar com cordas elásticas e alça reforçada. Estilo urbano para uso diário.' },
  { nome: 'Sling Bag Gota', cat: 'sling-bags', img: 'imagens/produto-slingbag-cinza.webp', descricao: 'Formato teardrop em nylon cinza-azulado com design minimalista e costura diagonal. Alça cruzada ajustável.' },
  { nome: 'Sling Bag Tático', cat: 'sling-bags', img: 'imagens/produto-slingbag-tatico.jpeg', descricao: 'Nylon tático preto com bungee cord frontal, múltiplos compartimentos e alça de peito com clip.' },
  { nome: 'Sling Bag Tricolor', cat: 'sling-bags', img: 'imagens/produto-9.jpg', descricao: 'Ripstop tricolor (azul, khaki e preto) com fita étnica bordada e patch personalizado. Alça transversal ajustável.' },
  { nome: 'Tote Jeans', cat: 'tote-bags', img: 'imagens/destaque-tote-jeans.webp', destaque: true, descricao: 'Denim premium com costuras aparentes e grande área de personalização. O clássico reinventado com atitude streetwear.' },
  { nome: 'Tote Canvas Estampada', cat: 'tote-bags', img: 'imagens/produto-tote-azul.webp', descricao: 'Canvas azul royal com estampa gráfica de grande impacto visual. Alças largas e espaço interno generoso.' },
  { nome: 'Tote Mesh Roll-Top', cat: 'tote-bags', img: 'imagens/produto-tote-mesh.webp', descricao: 'Canvas bege com painel em tela, base em suede marrom e fivela de fechamento. Grande área para personalização.' },
  { nome: 'Tote Bag Térmica', cat: 'tote-bags', img: 'imagens/brinde-tote-preta.jpeg', descricao: 'Forro térmico interno para manter bebidas e itens frescos. Alças reforçadas e frente personalizável com logo.' },
  { nome: 'Eco Bag Canvas Natural', cat: 'eco-bags', img: 'imagens/categoria-ecobag.jpeg', destaque: true, descricao: 'Canvas 100% algodão natural com alças largas reforçadas. Excelente para brindes sustentáveis com bordado ou silk screen.' },
  { nome: 'Eco Bag com Alça de Corda', cat: 'eco-bags', img: 'imagens/brinde-ecobag-natural.png', descricao: 'Algodão cru com alças em corda e acabamento em madeira. Sustentável, elegante e personalizável.' },
  { nome: 'Eco Bag Slim', cat: 'eco-bags', img: 'imagens/produto-25.jpg', descricao: 'Algodão leve com alças coloridas intercambiáveis. Dobrável, compacta para o bolso e personalizável com serigrafia.' },
  { nome: 'Mala de Mão Preta', cat: 'malas', img: 'imagens/Malas/005_20_4_6_600_11_7_5_524_malademaoviagempreta4.jpg', descricao: 'Material resistente, forro interno, alça telescópica e rodinhas duplas. Personalizável com bordado ou plaqueta metálica.' },
  { nome: 'Mala de Viagem Listras', cat: 'malas', img: 'imagens/Malas/006_20_4_5_552_17_7_8_861_onlinelistras_0000_bolovo43.jpg', descricao: 'Design listrado, forro com divisória, alça reforçada e fechamento duplo. Grande área frontal para personalização.' },
  { nome: 'Mala Executiva', cat: 'malas', img: 'imagens/Malas/007_09_45_54_58_9_10_9_964_onlinebolovo_0008_bolovo20101.jpg', descricao: 'Compartimento para notebook, alça de ombro ajustável e cadeado embutido. Ideal para brindes corporativos premium.' },
  { nome: 'Mala Compacta', cat: 'malas', img: 'imagens/Malas/008_09_46_00_62_9_10_2_266_onlinebolovo_0006_bolovo20103.jpg', descricao: 'Formato compacto para viagens curtas, forro impermeável, porta-celular interno e alça telescópica retrátil.' },
  { nome: 'Crossbody Puffer', cat: 'bolsas', img: 'imagens/destaque-crossbody-puffer.jpeg', destaque: true, descricao: 'Silhueta oversized em nylon acolchoado com zíper oculto e alça diagonal extra larga. Estética premium.' },
  { nome: 'Puffer Bag', cat: 'bolsas', img: 'imagens/destaque-puffer.webp', destaque: true, descricao: 'Acolchoada com enchimento premium, zíper metálico e alça dupla. Tendência streetwear com espaço e conforto.' },
  { nome: 'Bolsa Crossbody', cat: 'bolsas', img: 'imagens/produto-6.jpg', descricao: 'Material resistente com compartimento principal e bolso frontal. Alça ajustável e fivela metálica.' },
  { nome: 'Bolsa Transversal Slim', cat: 'bolsas', img: 'imagens/produto-7.jpg', descricao: 'Fecho magnético, bolso interno em malha e alça de comprimento regulável. Visual clean para uso diário.' },
  { nome: 'Necessaire com Visor', cat: 'acessorios', img: 'imagens/brinde-necessaire.png', descricao: 'Visor em PVC transparente, zíper YKK e forro interno lavável. Ideal para brindes e kits de viagem personalizados.' },
  { nome: 'Carteira Slim', cat: 'acessorios', img: 'imagens/produto-4.jpg', descricao: 'Couro sintético slim com porta-cartões, compartimento para notas e plaqueta de marca. Brinde corporativo premium.' },
  { nome: 'Porta-Documentos', cat: 'acessorios', img: 'imagens/produto-8.jpg', descricao: 'Couro sintético com elásticos internos, compartimentos múltiplos e plaqueta metálica. Apresentação sofisticada.' },
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
    descricao: p.descricao ?? null,
    destaque: p.destaque ?? false,
    ativo: true,
    caracteristicas: [],
  }))

  const { error: prodErr } = await supabase
    .from('produtos')
    .upsert(produtos, { onConflict: 'slug', ignoreDuplicates: false })

  if (prodErr) return NextResponse.json({ error: 'produtos: ' + prodErr.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    categorias: cats?.length ?? 0,
    produtos: produtos.length,
  })
}
