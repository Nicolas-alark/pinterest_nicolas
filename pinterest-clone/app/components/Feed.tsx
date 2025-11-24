'use client'

import { useState, useEffect, useMemo } from 'react'
import PinCard from './PinCard'
import { pinService } from '@/lib/pinService'
import { Pin } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

export default function Feed({ searchQuery }: { searchQuery: string }) {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadPins()
  }, [user])

  const loadPins = async () => {
    try {
      setLoading(true)
      setError(null)

      const pinsData = await pinService.getAllPins(user?.id)
      setPins(pinsData)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pins')
    } finally {
      setLoading(false)
    }
  }

  // ⭐ FILTRADO EN TIEMPO REAL
  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) return pins
    return pins.filter((pin) =>
      pin.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [pins, searchQuery])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <div className="text-gray-500 text-sm mb-4">
          Revisa la consola del navegador para más detalles
        </div>
        <button 
          onClick={loadPins}
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 max-w-7xl mx-auto">
      {/* GRID DE PINS */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4">
        {filteredPins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>

      {/* MENSAJE SI NO HAY RESULTADOS */}
      {filteredPins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No encontramos resultados para: <strong>{searchQuery}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
