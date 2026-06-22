export type Role = 'admin' | 'editor' | 'viewer'
export type LeadStatus = 'novo' | 'atendido' | 'arquivado'

export interface Profile {
  id: string
  nome: string | null
  email: string | null
  role: Role
  criado_em: string
}

export interface Categoria {
  id: string
  nome: string
  slug: string
  descricao: string | null
  ativo: boolean
  criado_em: string
}

export interface Produto {
  id: string
  nome: string
  slug: string
  categoria_id: string | null
  descricao: string | null
  imagem: string | null
  caracteristicas: string[]
  destaque: boolean
  ativo: boolean
  meta_titulo: string | null
  meta_descricao: string | null
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
  email: string | null
  telefone: string
  empresa: string | null
  mensagem: string | null
  origem: string
  status: LeadStatus
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface Configuracao {
  chave: string
  valor: string | null
  label: string | null
  grupo: string
}

export interface Midia {
  id: string
  nome: string
  url: string
  tipo: string | null
  tamanho: number | null
  pasta: string
  criado_em: string
}

export interface DashboardStats {
  total_produtos: number
  total_leads: number
  leads_novos: number
  produtos_destaque: number
}
