'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import type { Profile } from '@/types'

const ROLES = ['admin', 'editor', 'viewer']

export default function UsuariosPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<Profile[]>([])
  const [modal, setModal] = useState<'novo' | Profile | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', role: 'editor', password: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user?.id ?? null)
    const { data } = await supabase.from('profiles').select('*').order('nome')
    setUsers((data ?? []) as Profile[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setForm({ nome: '', email: '', role: 'editor', password: '' }); setModal('novo') }
  function openEdit(u: Profile) {
    setForm({ nome: u.nome ?? '', email: u.email ?? '', role: u.role, password: '' })
    setModal(u)
  }

  async function handleSave() {
    if (!form.nome || !form.email) { toast.error('Nome e email são obrigatórios'); return }
    setSaving(true)
    if (modal === 'novo') {
      if (!form.password) { toast.error('Senha obrigatória para novo usuário'); setSaving(false); return }
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, role: form.role, password: form.password }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Erro ao criar usuário'); setSaving(false); return }
    } else {
      const p = modal as Profile
      const { error } = await supabase.from('profiles').update({ nome: form.nome, role: form.role }).eq('id', p.id)
      if (error) { toast.error(error.message); setSaving(false); return }
    }
    toast.success('Usuário salvo!')
    setModal(null)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const res = await fetch(`/api/admin/users/${deleteId}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      toast.error(json.error ?? 'Erro ao excluir')
    } else {
      toast.success('Usuário excluído.')
    }
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  const roleLabel: Record<string, string> = { admin: 'Admin', editor: 'Editor', viewer: 'Visualizador' }
  const roleColor: Record<string, string> = { admin: 'text-[#e8ff00]', editor: 'text-blue-400', viewer: 'text-[#888]' }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={openNew} className="flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors">
          <Plus size={16} /> Novo usuário
        </button>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['Nome', 'Email', 'Perfil', 'Ações'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum usuário</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium">{u.nome ?? '—'}</td>
                <td className="px-4 py-3 text-[#888]">{u.email ?? '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold ${roleColor[u.role] ?? 'text-[#888]'}`}>{roleLabel[u.role] ?? u.role}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-[#888] hover:text-white transition-colors"><Pencil size={15} /></button>
                    {u.id !== currentUser && (
                      <button onClick={() => setDeleteId(u.id)} className="text-[#888] hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1c1c1c] w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
              <h3 className="font-bold uppercase tracking-wider text-sm">{modal === 'novo' ? 'Novo usuário' : 'Editar usuário'}</h3>
              <button onClick={() => setModal(null)} className="text-[#888] hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Nome *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Email *</label>
                <input type="email" value={form.email} disabled={modal !== 'novo'} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors disabled:opacity-50" />
              </div>
              {modal === 'novo' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Senha *</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">Perfil</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-4 py-2.5 text-sm focus:border-[#e8ff00] transition-colors">
                  {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
                </select>
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

      <ConfirmDialog open={!!deleteId} title="Excluir usuário?" description="Esta ação não pode ser desfeita." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
