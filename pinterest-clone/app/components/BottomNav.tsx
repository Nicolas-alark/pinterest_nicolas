'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export default function BottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { href: '/', icon: 'fas fa-home', label: 'Inicio' },
    { href: '/search', icon: 'fas fa-search', label: 'Buscar' },
    {
      href: '/create-pin', // Cambiado de acción modal a ruta
      icon: 'fas fa-plus',
      label: 'Crear',
    },
    { href: '/profile', icon: 'fas fa-user', label: 'Perfil' },
  ]

  return (
    <>
      {/* Navigation Bar: Visible en todas las pantallas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = item.href ? pathname === item.href : false
            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ) : null
          })}
        </div>
      </nav>
      <div className="pb-16"></div>
    </>
  )
}
