'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { slugify } from '@/lib/utils'
import type { Categoria } from '@/types'

const EMPTY: Omit<Categoria, 'id' | 'criado_em'> = { nome: '', slug: '', descricao: null, imagem: null, ordem: 0, ativo: true }

export default function CategoriasPage() {
  const supabase = createClient()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'novo' | Categoria | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const { data } = await supabase.from('categorias').select('*').order('ordem')
    setCategorias((data ?? []) as Categoria[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('novo') }
  function openEdit(c: Categoria) { setForm({ nome: c.nome, slug: c.slug, descricao: c.descricao, imagem: c.imagem, ordem: c.ordem, ativo: c.ativo }); setModal(c) }

  async function handleSave() {
    if (!form.nome) { toast.error('Nome obrigatório'); return }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.nome) }
    if (modal === 'novo') {
      const { error } = await supabase.from('categorias').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('categorias').update(payload).eq('id', (modal as Categoria).id)
      if (error) { toast.error(error.message); setSaving(false); return }
    }
    toast.success(modal === 'novo' ? 'Categoria criada!' : 'Categoria atualizada!')
    setModal(null)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('categorias').delete().eq('id', deleteId)
    if (error) { toast.error(error.message); setDeleting(false); return }
    toast.success('Categoria excluída.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <Plus size={16} /> Nova categoria
        </button>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['Nome', 'Slug', 'Ordem', 'Ativo', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : categorias.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888] text-xs">Nenhuma categoria ainda</td></tr>
            ) : categorias.map(c => (
              <tr key={c.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium">{c.nome}</td>
                <td className="px-4 py-3 text-[#888] font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-[#888]">{c.ordem}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${c.ativo ? 'text-green-400' : 'text-[#888]'}`}>{c.ativo ? 'Sim' : 'Não'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(c)} className="text-[#888] hover:text-white transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(c.id)} className="text-[#888] hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1c1c1c] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
              <h3 className="font-bold uppercase tracking-wider text-sm">{modal === 'novo' ? 'Nova categoria' : 'Editar categoria'}</h3>
              <button onClick={() => setModal(null)} className="text-[#888] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Nome *</label>
                <input
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Slug</label>
                <input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Descrição</label>
                <textarea
                  value={form.descricao ?? ''}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value || null }))}
                  rows={2}
                  className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Ordem</label>
                  <input
                    type="number"
                    value={form.ordem}
                    onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))}
                    className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-5">
                  <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="w-4 h-4 accent-[#e8ff00]" />
                  <span className="text-sm">Ativo</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-[#1c1c1c] text-[#888] text-sm hover:text-white hover:border-white/20 transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#e8ff00] text-black text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50">
                  {saving ? 'Salvando…' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Excluir categoria?" description="Produtos desta categoria perderão o vínculo." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
