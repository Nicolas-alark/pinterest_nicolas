// components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Agrega la interface para las props
interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowMobileMenu(false);
  };

  const handleMobileMenuToggle = () => {
    onMobileMenuToggle();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white z-40 shadow-sm">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">Mariposas</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <i className="fas fa-search text-gray-500"></i>
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
              <i className="fas fa-home text-xl text-gray-700"></i>
            </Link>
            
            <Link href="/create-pin" className="p-2 hover:bg-gray-100 rounded-full">
              <i className="fas fa-plus text-xl text-gray-700"></i>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full">
                  <i className="fas fa-user text-xl text-gray-700"></i>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <button 
            onClick={handleMobileMenuToggle} 
            className="p-2"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
          </Link>

          <Link href="/create-pin" className="p-2">
            <i className="fas fa-plus text-xl"></i>
          </Link>
        </div>
      </nav>
    </>
  );
}