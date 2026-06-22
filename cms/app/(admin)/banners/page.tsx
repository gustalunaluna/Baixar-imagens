'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Banner } from '@/types'

const EMPTY = { titulo: '', subtitulo: '', imagem: null as string | null, botao_texto: '', botao_link: '', ativo: true, ordem: 0 }

export default function BannersPage() {
  const supabase = createClient()
  const [banners, setBanners] = useState<Banner[]>([])
  const [modal, setModal] = useState<'novo' | Banner | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('banners_home').select('*').order('ordem')
    setBanners((data ?? []) as Banner[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setModal('novo') }
  function openEdit(b: Banner) {
    setForm({ titulo: b.titulo, subtitulo: b.subtitulo ?? '', imagem: b.imagem, botao_texto: b.botao_texto ?? '', botao_link: b.botao_link ?? '', ativo: b.ativo, ordem: b.ordem })
    setModal(b)
  }

  async function toggleAtivo(b: Banner) {
    await supabase.from('banners_home').update({ ativo: !b.ativo }).eq('id', b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, ativo: !x.ativo } : x))
  }

  async function handleSave() {
    if (!form.titulo) { toast.error('Título obrigatório'); return }
    setSaving(true)
    if (modal === 'novo') {
      const { error } = await supabase.from('banners_home').insert(form)
      if (error) { toast.error(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('banners_home').update(form).eq('id', (modal as Banner).id)
      if (error) { toast.error(error.message); setSaving(false); return }
    }
    toast.success('Banner salvo!')
    setModal(null)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('banners_home').delete().eq('id', deleteId)
    toast.success('Banner excluído.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <Plus size={16} /> Novo banner
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-[#888] text-sm">Carregando…</p> :
          banners.length === 0 ? <p className="text-[#888] text-sm">Nenhum banner ainda.</p> :
          banners.map(b => (
            <div key={b.id} className="bg-[#111] border border-[#1c1c1c] flex items-center gap-4 px-5 py-3">
              <div className="flex-1">
                <p className="font-medium text-sm">{b.titulo}</p>
                {b.subtitulo && <p className="text-[#888] text-xs mt-0.5">{b.subtitulo}</p>}
              </div>
              <span className="text-xs text-[#888]">Ordem: {b.ordem}</span>
              <button onClick={() => toggleAtivo(b)} className={`text-xs font-bold px-2 py-0.5 ${b.ativo ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[#888]'}`}>
                {b.ativo ? 'Ativo' : 'Inativo'}
              </button>
              <button onClick={() => openEdit(b)} className="text-[#888] hover:text-white transition-colors"><Pencil size={15} /></button>
              <button onClick={() => setDeleteId(b.id)} className="text-[#888] hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
            </div>
          ))
        }
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1c1c1c] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
              <h3 className="font-bold uppercase tracking-wider text-sm">{modal === 'novo' ? 'Novo banner' : 'Editar banner'}</h3>
              <button onClick={() => setModal(null)} className="text-[#888] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Título *</label>
                <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Subtítulo</label>
                <input value={form.subtitulo} onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
              </div>
              <ImageUploader label="Imagem do banner" pasta="banners" value={form.imagem} onChange={url => setForm(f => ({ ...f, imagem: url }))} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Texto do botão</label>
                  <input value={form.botao_texto} onChange={e => setForm(f => ({ ...f, botao_texto: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Link do botão</label>
                  <input value={form.botao_link} onChange={e => setForm(f => ({ ...f, botao_link: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" placeholder="https://" />
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Ordem</label>
                  <input type="number" value={form.ordem} onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))} className="w-24 bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-5">
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

      <ConfirmDialog open={!!deleteId} title="Excluir banner?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
