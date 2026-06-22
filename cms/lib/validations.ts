import { z } from 'zod'

export const produtoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  categoria_id: z.string().uuid().nullable().optional(),
  descricao_curta: z.string().nullable().optional(),
  descricao: z.string().nullable().optional(),
  imagem_principal: z.string().nullable().optional(),
  imagens_secundarias: z.array(z.string()).default([]),
  caracteristicas: z.array(z.object({ chave: z.string(), valor: z.string() })).default([]),
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
})

export const categoriaSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  descricao: z.string().nullable().optional(),
  imagem: z.string().nullable().optional(),
  ordem: z.number().default(0),
  ativo: z.boolean().default(true),
})

export const portfolioSchema = z.object({
  cliente: z.string().min(2, 'Cliente obrigatório'),
  titulo: z.string().min(2, 'Título obrigatório'),
  descricao: z.string().nullable().optional(),
  imagens: z.array(z.string()).default([]),
  categoria: z.string().nullable().optional(),
  data: z.string().nullable().optional(),
  destaque: z.boolean().default(false),
  ativo: z.boolean().default(true),
})

export const bannerSchema = z.object({
  titulo: z.string().min(2, 'Título obrigatório'),
  subtitulo: z.string().nullable().optional(),
  imagem: z.string().nullable().optional(),
  botao_texto: z.string().nullable().optional(),
  botao_link: z.string().nullable().optional(),
  ativo: z.boolean().default(true),
  ordem: z.number().default(0),
})

export const depoimentoSchema = z.object({
  nome_cliente: z.string().min(2, 'Nome obrigatório'),
  empresa: z.string().nullable().optional(),
  texto: z.string().min(10, 'Depoimento muito curto'),
  imagem: z.string().nullable().optional(),
  nota: z.number().min(1).max(5).default(5),
  ativo: z.boolean().default(true),
})

export const leadUpdateSchema = z.object({
  status: z.enum(['novo', 'atendido', 'arquivado']),
  observacoes: z.string().nullable().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type ProdutoForm = z.infer<typeof produtoSchema>
export type CategoriaForm = z.infer<typeof categoriaSchema>
export type PortfolioForm = z.infer<typeof portfolioSchema>
export type BannerForm = z.infer<typeof bannerSchema>
export type DepoimentoForm = z.infer<typeof depoimentoSchema>
export type LeadUpdateForm = z.infer<typeof leadUpdateSchema>
export type LoginForm = z.infer<typeof loginSchema>
