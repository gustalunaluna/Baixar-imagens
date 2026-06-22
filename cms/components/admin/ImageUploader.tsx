'use client'
import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

interface Props {
  value: string | null
  onChange: (url: string | null) => void
  pasta?: string
  label?: string
}

export default function ImageUploader({ value, onChange, pasta = 'geral', label = 'Imagem' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens são aceitas.'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('Arquivo muito grande. Máximo 10MB.'); return }

    setUploading(true)
    setProgress(20)

    const ext = file.name.split('.').pop()
    const filename = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    setProgress(50)
    const { data, error } = await supabase.storage.from('media').upload(filename, file, { upsert: false })
    setProgress(90)

    if (error) {
      toast.error('Erro ao enviar imagem: ' + error.message)
      setUploading(false)
      setProgress(0)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
    onChange(publicUrl)
    toast.success('Imagem enviada!')
    setUploading(false)
    setProgress(100)
    setTimeout(() => setProgress(0), 1000)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    onChange(null)
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2">{label}</p>
      {value ? (
        <div className="relative group w-full aspect-video bg-[#111] border border-[#1c1c1c] overflow-hidden">
          <Image src={value} alt="Preview" fill className="object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/80 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video bg-[#111] border-2 border-dashed border-[#1c1c1c] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#e8ff00]/40 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-[#e8ff00]" />
              <p className="text-xs text-[#888]">Enviando… {progress}%</p>
              <div className="w-32 h-1 bg-[#1c1c1c] mt-1">
                <div className="h-full bg-[#e8ff00] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <Upload size={24} className="text-[#888]" />
              <p className="text-xs text-[#888]">Arraste ou clique para enviar</p>
              <p className="text-xs text-[#555]">PNG, JPG, WEBP — máx. 10MB</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
