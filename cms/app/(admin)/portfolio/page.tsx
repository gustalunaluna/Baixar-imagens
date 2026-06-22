'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'
import { formatDateShort } from '@/lib/utils'
import type { Portfolio } from '@/types'

const EMPTY = { cliente: '', titulo: '', descricao: '', imagens: [] as string[], categoria: '', data: '', destaque: false, ativo: true }

export default function PortfolioPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Portfolio[]>([])
  const [modal, setModal] = useState<'novo' | Portfolio | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('portfolio').select('*').order('criado_em', { ascending: false })
    setItems((data ?? []) as Portfolio[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('novo') }
  function openEdit(p: Portfolio) {
    setForm({ cliente: p.cliente, titulo: p.titulo, descricao: p.descricao ?? '', imagens: p.imagens ?? [], categoria: p.categoria ?? '', data: p.data ?? '', destaque: p.destaque, ativo: p.ativo })
    setModal(p)
  }

  async function handleSave() {
    if (!form.cliente || !form.titulo) { toast.error('Cliente e título são obrigatórios'); return }
    setSaving(true)
    const payload = { ...form, descricao: form.descricao || null, categoria: form.categoria || null, data: form.data || null }
    if (modal === 'novo') {
      const { error } = await supabase.from('portfolio').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('portfolio').update(payload).eq('id', (modal as Portfolio).id)
      if (error) { toast.error(error.message); setSaving(false); return }
    }
    toast.success('Projeto salvo!')
    setModal(null)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('portfolio').delete().eq('id', deleteId)
    toast.success('Projeto excluído.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <Plus size={16} /> Novo projeto
        </button>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['Cliente', 'Título', 'Categoria', 'Data', 'Ativo', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum projeto ainda</td></tr>
            ) : items.map(p => (
              <tr key={p.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium">{p.cliente}</td>
                <td className="px-4 py-3 text-[#888]">{p.titulo}</td>
                <td className="px-4 py-3 text-[#888]">{p.categoria ?? '—'}</td>
                <td className="px-4 py-3 text-[#888] text-xs">{formatDateShort(p.data)}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold ${p.ativo ? 'text-green-400' : 'text-[#888]'}`}>{p.ativo ? 'Sim' : 'Não'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-[#888] hover:text-white transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="text-[#888] hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1c1c1c] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
              <h3 className="font-bold uppercase tracking-wider text-sm">{modal === 'novo' ? 'Novo projeto' : 'Editar projeto'}</h3>
              <button onClick={() => setModal(null)} className="text-[#888] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Cliente *</label>
                  <input value={form.cliente} onChange={e => setForm(f => ({ ...f, cliente: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Título *</label>
                  <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Categoria</label>
                  <input value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Data</label>
                  <input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
              </div>
              <ImageUploader label="Imagem principal" pasta="portfolio" value={form.imagens[0] ?? null} onChange={url => setForm(f => ({ ...f, imagens: url ? [url, ...f.imagens.slice(1)] : f.imagens.slice(1) }))} />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.destaque} onChange={e => setForm(f => ({ ...f, destaque: e.target.checked }))} className="w-4 h-4 accent-[#e8ff00]" />
                  <span className="text-sm">Destaque</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.ativo} onChange={e => setForm(f => ({ ...f, ativo: e.target.checked }))} className="w-4 h-4 accent-[#e8ff00]" />
                  <span className="text-sm">Ativo</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-[#1c1c1c] text-[#888] text-sm hover:text-white transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#e8ff00] text-black text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50">
                  {saving ? 'Salvando…' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Excluir projeto?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
