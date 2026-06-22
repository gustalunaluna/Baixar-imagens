'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import type { Configuracao } from '@/types'

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [configs, setConfigs] = useState<Configuracao[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('configuracoes').select('*').order('grupo').then(({ data }) => {
      const c = (data ?? []) as Configuracao[]
      setConfigs(c)
      setValues(Object.fromEntries(c.map(x => [x.chave, x.valor ?? ''])))
      setLoading(false)
    })
  }, [])

  async function save() {
    setSaving(true)
    const updates = Object.entries(values).map(([chave, valor]) =>
      supabase.from('configuracoes').update({ valor }).eq('chave', chave)
    )
    await Promise.all(updates)
    toast.success('Configurações salvas!')
    setSaving(false)
  }

  const grupos = [...new Set(configs.map(c => c.grupo))]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl">
      {grupos.map(grupo => (
        <div key={grupo} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4 capitalize">{grupo}</h2>
          <div className="bg-[#111] border border-[#1c1c1c] divide-y divide-[#1c1c1c]">
            {configs.filter(c => c.grupo === grupo).map(c => (
              <div key={c.chave} className="flex items-center gap-4 px-5 py-3">
                <label className="w-40 text-xs font-bold uppercase tracking-wider text-[#888] flex-shrink-0">
                  {c.label ?? c.chave}
                </label>
                <input
                  value={values[c.chave] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [c.chave]: e.target.value }))}
                  className="flex-1 bg-[#0d0d0d] border border-[#1c1c1c] text-white px-3 py-2 text-sm focus:border-[#e8ff00] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 bg-[#e8ff00] text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
      >
        <Save size={15} />
        {saving ? 'Salvando…' : 'Salvar configurações'}
      </button>
    </div>
  )
}
