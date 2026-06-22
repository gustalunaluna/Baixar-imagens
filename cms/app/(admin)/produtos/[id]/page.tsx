'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { produtoSchema, type ProdutoForm } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Categoria } from '@/types'

export default function EditarProdutoPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors, isSubmitting } } = useForm<ProdutoForm>({
    resolver: zodResolver(produtoSchema),
    defaultValues: { imagens_secundarias: [], caracteristicas: [], destaque: false, ativo: true },
  })

  const { fields: caracFields, append: appendCarac, remove: removeCarac } = useFieldArray({ control, name: 'caracteristicas' })

  const nome = watch('nome')
  const slug = watch('slug')
  const imgPrincipal = watch('imagem_principal')

  useEffect(() => {
    async function load() {
      const [{ data: prod }, { data: cats }] = await Promise.all([
        supabase.from('produtos').select('*').eq('id', id).single(),
        supabase.from('categorias').select('*').order('nome'),
      ])
      if (prod) {
        reset({
          ...prod,
          categoria_id: prod.categoria_id ?? undefined,
          imagens_secundarias: prod.imagens_secundarias ?? [],
          caracteristicas: prod.caracteristicas ?? [],
        })
      }
      setCategorias((cats ?? []) as Categoria[])
      setLoading(false)
    }
    load()
  }, [id])

  async function onSubmit(data: ProdutoForm) {
    const { error } = await supabase.from('produtos').update({
      ...data,
      atualizado_em: new Date().toISOString(),
    }).eq('id', id)
    if (error) { toast.error('Erro: ' + error.message); return }
    toast.success('Produto atualizado!')
    router.push('/produtos')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl">
      <Link href="/produtos" className="flex items-center gap-2 text-[#888] hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={14} />
        Voltar para produtos
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Nome *</label>
            <input {...register('nome')} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
            {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Slug *</label>
            <input {...register('slug')} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors font-mono text-xs" />
            {slug && <p className="text-[#555] text-xs mt-1">lsconfex.com.br/produtos/{slug}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Categoria</label>
          <select {...register('categoria_id')} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors">
            <option value="">Sem categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Descrição curta</label>
          <input {...register('descricao_curta')} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Descrição completa</label>
          <textarea {...register('descricao')} rows={5} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors resize-none" />
        </div>

        <ImageUploader
          label="Imagem principal"
          pasta="produtos"
          value={imgPrincipal ?? null}
          onChange={url => setValue('imagem_principal', url ?? undefined)}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#888]">Características técnicas</label>
            <button type="button" onClick={() => appendCarac({ chave: '', valor: '' })} className="flex items-center gap-1 text-xs text-[#e8ff00] hover:text-white transition-colors">
              <Plus size={13} /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {caracFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`caracteristicas.${i}.chave`)} placeholder="Chave" className="flex-1 bg-[#111] border border-[#1c1c1c] text-white px-3 py-2 text-sm focus:border-[#e8ff00] transition-colors" />
                <input {...register(`caracteristicas.${i}.valor`)} placeholder="Valor" className="flex-1 bg-[#111] border border-[#1c1c1c] text-white px-3 py-2 text-sm focus:border-[#e8ff00] transition-colors" />
                <button type="button" onClick={() => removeCarac(i)} className="text-[#888] hover:text-red-400 px-2 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('destaque')} className="w-4 h-4 accent-[#e8ff00]" />
            <span className="text-sm font-medium">Produto em destaque</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('ativo')} className="w-4 h-4 accent-[#e8ff00]" />
            <span className="text-sm font-medium">Ativo (visível no site)</span>
          </label>
        </div>

        <div className="border-t border-[#1c1c1c] pt-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#888]">SEO</p>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#555] mb-2">Meta Title</label>
            <input {...register('seo_title')} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#555] mb-2">Meta Description</label>
            <textarea {...register('seo_description')} rows={2} className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/produtos" className="px-6 py-2.5 border border-[#1c1c1c] text-[#888] text-sm hover:text-white hover:border-white/20 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-[#e8ff00] text-black text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
