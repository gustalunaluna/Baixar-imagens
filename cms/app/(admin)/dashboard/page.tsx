'use client'
import { useEffect, useState } from 'react'
import { Package, Users, Star, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import StatsCard from '@/components/admin/StatsCard'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { Lead, Produto, DashboardStats } from '@/types'

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState<DashboardStats>({ total_produtos: 0, total_leads: 0, leads_novos: 0, produtos_destaque: 0 })
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [recentProducts, setRecentProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: totalProd },
        { count: totalLeads },
        { count: leadsNovos },
        { count: destaque },
        { data: leads },
        { data: products },
      ] = await Promise.all([
        supabase.from('produtos').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'novo'),
        supabase.from('produtos').select('*', { count: 'exact', head: true }).eq('destaque', true),
        supabase.from('leads').select('*').order('criado_em', { ascending: false }).limit(10),
        supabase.from('produtos').select('*, categoria:categorias(nome)').order('criado_em', { ascending: false }).limit(5),
      ])
      setStats({
        total_produtos: totalProd ?? 0,
        total_leads: totalLeads ?? 0,
        leads_novos: leadsNovos ?? 0,
        produtos_destaque: destaque ?? 0,
      })
      setRecentLeads((leads ?? []) as Lead[])
      setRecentProducts((products ?? []) as Produto[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Produtos" value={stats.total_produtos} icon={Package} />
        <StatsCard title="Leads" value={stats.total_leads} icon={Users} />
        <StatsCard title="Leads Novos" value={stats.leads_novos} icon={MessageSquare} accent />
        <StatsCard title="Em Destaque" value={stats.produtos_destaque} icon={Star} />
      </div>

      {/* Recent leads */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4">Últimos leads recebidos</h2>
        <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1c1c1c]">
                {['Nome', 'Empresa', 'WhatsApp', 'Interesse', 'Status', 'Data'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum lead ainda</td></tr>
              ) : recentLeads.map(lead => (
                <tr key={lead.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium">{lead.nome}</td>
                  <td className="px-4 py-3 text-[#888]">{lead.empresa ?? '—'}</td>
                  <td className="px-4 py-3 text-[#888]">{lead.whatsapp}</td>
                  <td className="px-4 py-3 text-[#888]">{lead.interesse ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-[#888] text-xs">{formatDate(lead.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent products */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4">Produtos recentes</h2>
        <div className="bg-[#111] border border-[#1c1c1c] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1c1c1c]">
                {['Nome', 'Categoria', 'Destaque', 'Ativo', 'Data'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#888] text-xs">Nenhum produto ainda</td></tr>
              ) : recentProducts.map(p => (
                <tr key={p.id} className="border-b border-[#1c1c1c] hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.nome}</td>
                  <td className="px-4 py-3 text-[#888]">{(p.categoria as { nome: string } | null)?.nome ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${p.destaque ? 'text-[#e8ff00]' : 'text-[#888]'}`}>
                      {p.destaque ? '★ Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${p.ativo ? 'text-green-400' : 'text-[#888]'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888] text-xs">{formatDate(p.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
