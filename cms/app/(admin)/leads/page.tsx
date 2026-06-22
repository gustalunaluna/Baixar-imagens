'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate, waLink } from '@/lib/utils'
import { MessageCircle, X } from 'lucide-react'
import type { Lead, LeadStatus } from '@/types'

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'novo',      label: 'Novo' },
  { value: 'atendido',  label: 'Atendido' },
  { value: 'arquivado', label: 'Arquivado' },
]

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'todos'>('todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [saving, setSaving] = useState(false)
  const [obs, setObs] = useState('')
  const [newStatus, setNewStatus] = useState<LeadStatus>('novo')
  const [loading, setLoading] = useState(true)

  async function load() {
    let q = supabase.from('leads').select('*').order('criado_em', { ascending: false })
    if (filter !== 'todos') q = q.eq('status', filter)
    const { data } = await q
    setLeads((data ?? []) as Lead[])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  function openLead(lead: Lead) {
    setSelected(lead)
    setObs(lead.observacoes ?? '')
    setNewStatus(lead.status)
  }

  async function saveLead() {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase.from('leads').update({
      status: newStatus,
      observacoes: obs || null,
    }).eq('id', selected.id)
    if (error) { toast.error('Erro ao salvar.'); setSaving(false); return }
    toast.success('Lead atualizado.')
    setSelected(null)
    setSaving(false)
    load()
  }

  const filtered = leads.filter(l =>
    l.nome.toLowerCase().includes(search.toLowerCase()) ||
    (l.empresa ?? '').toLowerCase().includes(search.toLowerCase()) ||
    l.telefone.includes(search)
  )

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, empresa ou telefone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#111] border border-[#1c1c1c] text-white px-4 py-2 text-sm focus:border-[#e8ff00] transition-colors w-72"
        />
        <div className="flex gap-1">
          {(['todos', 'novo', 'atendido', 'arquivado'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === s
                  ? 'bg-[#e8ff00] text-black'
                  : 'bg-[#111] border border-[#1c1c1c] text-[#888] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1c1c1c]">
              {['Nome', 'Empresa', 'Telefone', 'Origem', 'Status', 'Data', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#888]">Carregando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum lead encontrado</td></tr>
            ) : filtered.map(lead => (
              <tr
                key={lead.id}
                onClick={() => openLead(lead)}
                className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{lead.nome}</td>
                <td className="px-4 py-3 text-[#888]">{lead.empresa ?? '—'}</td>
                <td className="px-4 py-3 text-[#888]">{lead.telefone}</td>
                <td className="px-4 py-3 text-[#888] text-xs">{lead.origem}</td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3 text-[#888] text-xs whitespace-nowrap">{formatDate(lead.criado_em)}</td>
                <td className="px-4 py-3">
                  <a
                    href={waLink(lead.telefone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <MessageCircle size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#1c1c1c] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
              <h3 className="font-bold uppercase tracking-wider text-sm">Detalhes do lead</h3>
              <button onClick={() => setSelected(null)} className="text-[#888] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Nome', selected.nome],
                  ['Empresa', selected.empresa ?? '—'],
                  ['Telefone', selected.telefone],
                  ['E-mail', selected.email ?? '—'],
                  ['Origem', selected.origem],
                  ['Data', formatDate(selected.criado_em)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-0.5">{k}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>

              {selected.mensagem && (
                <div>
                  <p className="text-xs text-[#888] uppercase tracking-wider mb-1">Mensagem</p>
                  <p className="text-sm text-[#ccc] bg-[#0d0d0d] p-3 border border-[#1c1c1c]">{selected.mensagem}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">Status</p>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setNewStatus(value)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        newStatus === value ? 'bg-[#e8ff00] text-black' : 'bg-[#0d0d0d] border border-[#1c1c1c] text-[#888] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">Observações</p>
                <textarea
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  rows={3}
                  placeholder="Adicione observações sobre este lead…"
                  className="w-full bg-[#0d0d0d] border border-[#1c1c1c] text-white px-3 py-2 text-sm focus:border-[#e8ff00] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={waLink(selected.telefone, selected.mensagem ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle size={16} />
                  Abrir WhatsApp
                </a>
                <button
                  onClick={saveLead}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#e8ff00] text-black text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando…' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
