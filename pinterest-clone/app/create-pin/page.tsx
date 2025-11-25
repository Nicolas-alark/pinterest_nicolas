'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ImageUploader from '../components/ImageUploader'
export default function CreatePinPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleUploaded = (url: string) => {
    setImageUrl(url)
    setPreview(url)
    setUrlInput('')
  }

  const handleUrlPreview = () => {
    setPreview(urlInput)
    setImageUrl(urlInput)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!title || !imageUrl) {
      setErrorMsg('Por favor, completa el título y sube una imagen o pega una URL.')
      return
    }
    setLoading(true)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        setErrorMsg('Debes iniciar sesión para crear un pin')
        return
      }
      const pinData = {
        title,
        description,
        image_url: imageUrl,
        user_id: user.id,
      }
      const { error } = await supabase.from('pins').insert([pinData])
      if (error) throw error
      setTitle('')
      setDescription('')
      setImageUrl('')
      setUrlInput('')
      setPreview(null)
      router.push('/') // Vuelve al home después de crear el pin
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al crear el pin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crear nuevo Pin</h1>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-900"
          disabled={loading}
          aria-label="Cerrar formulario"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex-grow max-w-4xl mx-auto w-full bg-white rounded-lg shadow-md p-6 overflow-auto">
        {errorMsg && <div className="text-red-600 text-sm mb-4">{errorMsg}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
              placeholder="Título del pin"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
              placeholder="Detalles del pin"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen <span className="text-red-500">*</span>
            </label>
            <ImageUploader onUploaded={handleUploaded} />
            <div className="flex items-center gap-3 mt-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="URL de imagen pública (http...)"
                className="flex-grow border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-400"
                disabled={loading}
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm text-gray-700"
                onClick={handleUrlPreview}
                disabled={loading || !urlInput}
              >
                Usar URL
              </button>
            </div>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="max-h-60 w-auto rounded-lg mt-4 shadow mx-auto"
                style={{ border: '1px solid #eee', background: '#fafafa' }}
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Sube una imagen desde tu dispositivo <b>o</b> pega una URL pública directa.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 flex items-center justify-center space-x-3 opacity-90"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                <span>Crear</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  )
}
