'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Depoimento } from '@/types'

const EMPTY = { nome_cliente: '', empresa: '', texto: '', imagem: null as string | null, nota: 5, ativo: true }

export default function DepoimentosPage() {
  const supabase = createClient()
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([])
  const [modal, setModal] = useState<'novo' | Depoimento | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('depoimentos').select('*').order('criado_em', { ascending: false })
    setDepoimentos((data ?? []) as Depoimento[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('novo') }
  function openEdit(d: Depoimento) {
    setForm({ nome_cliente: d.nome_cliente, empresa: d.empresa ?? '', texto: d.texto, imagem: d.imagem, nota: d.nota, ativo: d.ativo })
    setModal(d)
  }

  async function handleSave() {
    if (!form.nome_cliente || !form.texto) { toast.error('Nome e depoimento são obrigatórios'); return }
    setSaving(true)
    const payload = { ...form, empresa: form.empresa || null }
    if (modal === 'novo') {
      const { error } = await supabase.from('depoimentos').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('depoimentos').update(payload).eq('id', (modal as Depoimento).id)
      if (error) { toast.error(error.message); setSaving(false); return }
    }
    toast.success('Depoimento salvo!')
    setModal(null)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('depoimentos').delete().eq('id', deleteId)
    toast.success('Depoimento excluído.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <Plus size={16} /> Novo depoimento
        </button>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['Cliente', 'Empresa', 'Nota', 'Ativo', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : depoimentos.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum depoimento ainda</td></tr>
            ) : depoimentos.map(d => (
              <tr key={d.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium">{d.nome_cliente}</td>
                <td className="px-4 py-3 text-[#888]">{d.empresa ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-[#e8ff00] text-xs">{'★'.repeat(d.nota)}{'☆'.repeat(5 - d.nota)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${d.ativo ? 'text-green-400' : 'text-[#888]'}`}>{d.ativo ? 'Sim' : 'Não'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(d)} className="text-[#888] hover:text-white transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(d.id)} className="text-[#888] hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
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
              <h3 className="font-bold uppercase tracking-wider text-sm">{modal === 'novo' ? 'Novo depoimento' : 'Editar depoimento'}</h3>
              <button onClick={() => setModal(null)} className="text-[#888] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Nome *</label>
                  <input value={form.nome_cliente} onChange={e => setForm(f => ({ ...f, nome_cliente: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Empresa</label>
                  <input value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Depoimento *</label>
                <textarea value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))} rows={4} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors resize-none" />
              </div>
              <ImageUploader label="Foto do cliente" pasta="clientes" value={form.imagem} onChange={url => setForm(f => ({ ...f, imagem: url }))} />
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Nota</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, nota: n }))} className={`text-xl transition-colors ${n <= form.nota ? 'text-[#e8ff00]' : 'text-[#555]'}`}>★</button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-4">
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

      <ConfirmDialog open={!!deleteId} title="Excluir depoimento?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
