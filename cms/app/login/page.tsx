'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(
          authError.message === 'Invalid login credentials'
            ? 'E-mail ou senha incorretos.'
            : authError.message
        )
        setLoading(false)
        return
      }
      toast.success('Login realizado!')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Erro ao conectar. Verifique sua conexão.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-2xl font-black uppercase tracking-widest">
            LS <span className="text-[#e8ff00]">Confecções</span>
          </span>
          <p className="text-[#888] text-sm mt-2">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">
              E-mail
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-3 text-sm focus:border-[#e8ff00] transition-colors outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-3 text-sm focus:border-[#e8ff00] transition-colors outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-sm py-3 flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-[#888] text-xs mt-8">
          lsconfex.com.br — Acesso restrito
        </p>
      </div>
    </div>
  )
}
