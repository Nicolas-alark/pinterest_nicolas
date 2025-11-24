'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/lib/authService'

export default function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [showAuthForm, setShowAuthForm] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  // Debounce búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(searchQuery)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery, onSearch])

  const handleGoHome = () => {
    onSearch?.('')
    setSearchQuery('')
    router.push('/')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    try {
      if (isSignUp) {
        await authService.signUp(email, password)
        alert('¡Cuenta creada! Revisa tu correo.')
      } else {
        await authService.signIn(email, password)
      }

      setShowAuthForm(false)
      setEmail('')
      setPassword('')
    } catch (err: any) {
      alert(err.message || 'Error de autenticación')
      console.error(err)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO + INICIO + EXPLORAR */}
        <div className="flex items-center space-x-4">

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleGoHome}
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-red-600 font-bold text-xl">interest</span>
          </div>

          {/* Botón Inicio */}
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-black"
          >
            Inicio
          </button>

          {/* Botón Explorar */}
          <button className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100">
            Explorar
          </button>
        </div>

        {/* BARRA DE BUSQUEDA */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar ideas"
              className="w-full bg-gray-100 rounded-full px-4 py-3 pl-12
                focus:ring-2 focus:ring-gray-300 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* NAV DERECHA */}
        <div className="flex items-center space-x-3">
          {!loading && (
            <>
              {user ? (
                <>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </button>

                  <div className="relative group">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>

                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user.email}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {showAuthForm ? (
                    <form
                      onSubmit={handleAuth}
                      className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-lg border"
                    >
                      <div className="flex flex-col space-y-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm w-48"
                          placeholder="Email"
                        />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm w-48"
                          placeholder="Contraseña"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          {isSignUp ? 'Crear cuenta' : 'Entrar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsSignUp(!isSignUp)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          {isSignUp ? '¿Ya tienes cuenta?' : '¿Crear cuenta?'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAuthForm(false)}
                          className="text-gray-600 text-sm hover:underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAuthForm(true)}
                      className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700"
                    >
                      Iniciar sesión
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
