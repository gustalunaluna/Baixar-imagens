'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { loginSchema, type LoginForm } from '@/lib/validations'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : error.message)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-2xl font-black uppercase tracking-widest">
            LS <span className="text-[#e8ff00]">Confecções</span>
          </span>
          <p className="text-[#888] text-sm mt-2">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#888] mb-2">
              E-mail
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-3 text-sm focus:border-[#e8ff00] transition-colors"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
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
                className="w-full bg-[#111] border border-[#1c1c1c] text-white px-4 py-3 text-sm focus:border-[#e8ff00] transition-colors pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#e8ff00] text-black font-bold uppercase tracking-widest text-sm py-3 flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-[#888] text-xs mt-8">
          lsconfex.com.br — Acesso restrito
        </p>
      </div>
    </div>
  )
}
