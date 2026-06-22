export type NivelAcesso = 'admin' | 'editor' | 'vendedor'
export type LeadStatus = 'novo' | 'atendido' | 'arquivado'

export interface Profile {
  id: string
  nome: string
  email: string
  nivel_acesso: NivelAcesso
  avatar_url: string | null
  criado_em: string
}

export interface Categoria {
  id: string
  nome: string
  slug: string
  descricao: string | null
  imagem: string | null
  ordem: number
  ativo: boolean
  criado_em: string
}

export interface Produto {
  id: string
  nome: string
  slug: string
  categoria_id: string | null
  descricao: string | null
  descricao_curta: string | null
  imagem_principal: string | null
  imagens_secundarias: string[]
  caracteristicas: { chave: string; valor: string }[]
  destaque: boolean
  ativo: boolean
  ordem: number
  seo_title: string | null
  seo_description: string | null
  criado_em: string
  atualizado_em: string
  categoria?: Categoria
}

export interface Portfolio {
  id: string
  cliente: string
  titulo: string
  descricao: string | null
  imagens: string[]
  categoria: string | null
  data: string | null
  destaque: boolean
  ativo: boolean
  criado_em: string
}

export interface Banner {
  id: string
  titulo: string
  subtitulo: string | null
  imagem: string | null
  botao_texto: string | null
  botao_link: string | null
  ativo: boolean
  ordem: number
  criado_em: string
}

export interface Depoimento {
  id: string
  nome_cliente: string
  empresa: string | null
  texto: string
  imagem: string | null
  nota: number
  ativo: boolean
  criado_em: string
}

export interface Lead {
  id: string
  nome: string
  empresa: string | null
  whatsapp: string
  email: string | null
  interesse: string | null
  mensagem: string | null
  status: LeadStatus
  observacoes: string | null
  criado_em: string
}

export interface Configuracao {
  chave: string
  valor: string | null
  tipo: string
  label: string | null
  grupo: string
}

export interface Midia {
  id: string
  nome: string
  url: string
  tipo: string
  tamanho: number | null
  pasta: string
  alt: string | null
  criado_em: string
}

export interface DashboardStats {
  total_produtos: number
  total_leads: number
  leads_novos: number
  produtos_destaque: number
}
