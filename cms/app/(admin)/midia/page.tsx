'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { Upload, Trash2, Copy, Loader2 } from 'lucide-react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { fileSize, formatDate } from '@/lib/utils'
import Image from 'next/image'
import type { Midia } from '@/types'

const PASTAS = ['geral', 'produtos', 'portfolio', 'banners', 'clientes']

export default function MidiaPage() {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [midias, setMidias] = useState<Midia[]>([])
  const [pasta, setPasta] = useState('geral')
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('midia').select('*').eq('pasta', pasta).order('criado_em', { ascending: false })
    setMidias((data ?? []) as Midia[])
    setLoading(false)
  }
  useEffect(() => { setLoading(true); load() }, [pasta])

  async function handleUpload(files: FileList) {
    setUploading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const ext = file.name.split('.').pop()
      const filename = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('media').upload(filename, file)
      if (error) { toast.error('Erro: ' + error.message); continue }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
      await supabase.from('midia').insert({
        nome: file.name,
        url: publicUrl,
        tipo: file.type,
        tamanho: file.size,
        pasta,
      })
    }
    toast.success('Upload concluído!')
    setUploading(false)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const item = midias.find(m => m.id === deleteId)
    if (item) {
      const path = item.url.split('/media/')[1]
      if (path) await supabase.storage.from('media').remove([path])
    }
    await supabase.from('midia').delete().eq('id', deleteId)
    toast.success('Arquivo excluído.')
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success('URL copiada!')
  }

  return (
    <div>
      {/* Pasta tabs + upload */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 flex-wrap">
          {PASTAS.map(p => (
            <button
              key={p}
              onClick={() => setPasta(p)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pasta === p ? 'bg-[#e8ff00] text-black' : 'bg-[#111] border border-[#1c1c1c] text-[#888] hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="ml-auto flex items-center gap-2 bg-[#e8ff00] text-black px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Enviando…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) handleUpload(e.target.files) }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-[#e8ff00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : midias.length === 0 ? (
        <div
          className="border-2 border-dashed border-[#1c1c1c] flex flex-col items-center justify-center h-48 gap-3 cursor-pointer hover:border-[#e8ff00]/30 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={32} className="text-[#555]" />
          <p className="text-[#888] text-sm">Nenhum arquivo nesta pasta. Clique para enviar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {midias.map(m => (
            <div key={m.id} className="group relative bg-[#111] border border-[#1c1c1c] aspect-square overflow-hidden">
              <Image src={m.url} alt={m.nome} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <p className="text-xs text-center px-2 line-clamp-2 text-white">{m.nome}</p>
                <p className="text-xs text-[#888]">{fileSize(m.tamanho)}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyUrl(m.url)} className="p-1.5 bg-white/10 hover:bg-white/20 text-white transition-colors" title="Copiar URL">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => setDeleteId(m.id)} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors" title="Excluir">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Excluir arquivo?" description="O arquivo será removido permanentemente do storage." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
