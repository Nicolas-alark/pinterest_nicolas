import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import BottomNav from './components/BottomNav'
import Navbar from './components/Navbar' // Menú móvil, siempre visible en móviles

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pinterest Clone',
  description: 'A Pinterest clone built with Next.js and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />        {/* Solo visible en desktop por sus clases Tailwind */}
          {children}       
          <BottomNav />    {/* Siempre visible, pero solo en mobile por 'md:hidden' */}
        </AuthProvider>
      </body>
    </html>
  )
}
