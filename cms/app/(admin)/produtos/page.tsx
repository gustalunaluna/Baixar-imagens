'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { formatDate } from '@/lib/utils'
import type { Produto, Categoria } from '@/types'
import Image from 'next/image'

export default function ProdutosPage() {
  const supabase = createClient()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('produtos').select('*, categoria:categorias(id,nome)').order('criado_em', { ascending: false }),
      supabase.from('categorias').select('*').order('nome'),
    ])
    setProdutos((prods ?? []) as Produto[])
    setCategorias((cats ?? []) as Categoria[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleDestaque(p: Produto) {
    await supabase.from('produtos').update({ destaque: !p.destaque }).eq('id', p.id)
    setProdutos(prev => prev.map(x => x.id === p.id ? { ...x, destaque: !x.destaque } : x))
  }

  async function toggleAtivo(p: Produto) {
    await supabase.from('produtos').update({ ativo: !p.ativo }).eq('id', p.id)
    setProdutos(prev => prev.map(x => x.id === p.id ? { ...x, ativo: !x.ativo } : x))
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('produtos').delete().eq('id', deleteId)
    if (error) { toast.error('Erro ao excluir.'); setDeleting(false); return }
    toast.success('Produto excluído.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  const filtered = produtos.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || (p.categoria as { id: string } | null)?.id === catFilter
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar produto…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#111] border border-[#1c1c1c] text-white px-4 py-2 text-sm focus:border-[#e8ff00] transition-colors w-56"
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="bg-[#111] border border-[#1c1c1c] text-white px-4 py-2 text-sm focus:border-[#e8ff00] transition-colors"
        >
          <option value="">Todas as categorias</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <Link
          href="/produtos/novo"
          className="ml-auto flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['', 'Nome', 'Categoria', 'Destaque', 'Ativo', 'Data', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum produto encontrado</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  {p.imagem_principal ? (
                    <div className="w-10 h-10 relative bg-[#1c1c1c] overflow-hidden flex-shrink-0">
                      <Image src={p.imagem_principal} alt={p.nome} fill className="object-cover" />
                    </div>
                  ) : <div className="w-10 h-10 bg-[#1c1c1c]" />}
                </td>
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 text-[#888]">{(p.categoria as { nome: string } | null)?.nome ?? '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleDestaque(p)}
                    className={`text-sm transition-colors ${p.destaque ? 'text-[#e8ff00]' : 'text-[#555] hover:text-[#888]'}`}
                    title="Alternar destaque"
                  >
                    <Star size={16} fill={p.destaque ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAtivo(p)}
                    className={`text-xs font-bold px-2 py-0.5 transition-colors ${
                      p.ativo ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888]'
                    }`}
                  >
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-[#888] text-xs whitespace-nowrap">{formatDate(p.criado_em)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/produtos/${p.id}`}
                      className="text-[#888] hover:text-white transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="text-[#888] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Excluir produto?"
        description="Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}
