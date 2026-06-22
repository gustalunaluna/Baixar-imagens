import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'LS Confecções — Admin',
  description: 'Painel administrativo LS Confecções',
  robots: 'noindex,nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111', border: '1px solid #1c1c1c', color: '#fff' },
          }}
        />
      </body>
    </html>
  )
}
