<main className="min-h-screen bg-gray-50 p-6 flex flex-col">
  {/* Header */}
  <header className="flex justify-between items-center mb-4 flex-shrink-0">
    <h1 className="text-3xl font-bold text-gray-900">Crear nuevo Pin</h1> {/* Texto más grande */}
    {onClose && (
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-900"
        disabled={loading}
        aria-label="Cerrar formulario"
      >
        <i className="fas fa-times text-2xl"></i> {/* Icono un poco más grande */}
      </button>
    )}
  </header>

  {/* Form */}
  <form
    onSubmit={handleSubmit}
    className="flex flex-col flex-grow max-w-6xl mx-auto w-full bg-white rounded-lg shadow-md p-8 overflow-y-auto"
    style={{ maxHeight: 'calc(100vh - 120px)' }} // un poco más de altura para el formulario
  >
    {errorMsg && <div className="text-red-600 text-sm mb-6">{errorMsg}</div>}

    <div className="space-y-6 flex flex-col flex-grow">
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2"> {/* Etiquetas más grandes */}
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-red-500"
          placeholder="Título del pin"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Detalles del pin"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col flex-grow overflow-auto">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Imagen <span className="text-red-500">*</span>
        </label>
        <ImageUploader onUploaded={handleUploaded} />
        <div className="flex items-center gap-4 mt-4">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="URL de imagen pública (http...)"
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-red-400"
            disabled={loading}
          />
          <button
            type="button"
            className="px-5 py-3 bg-gray-100 rounded hover:bg-gray-200 text-base text-gray-700"
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
            className="max-h-52 w-auto rounded-lg mt-6 shadow mx-auto"
            style={{ border: '1px solid #eee', background: '#fafafa' }}
          />
        )}
        <p className="text-base text-gray-500 mt-3">
          Sube una imagen desde tu dispositivo <b>o</b> pega una URL pública directa.
        </p>
      </div>
    </div>

    <div className="flex justify-end space-x-6 pt-8 flex-shrink-0">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 bg-gray-100 rounded"
          disabled={loading}
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white px-10 py-4 rounded-full hover:bg-red-700 flex items-center justify-center space-x-4 opacity-90 text-lg"
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin text-xl"></i>
            <span>Creando...</span>
          </>
        ) : (
          <>
            <i className="fas fa-plus text-xl"></i>
            <span>Crear</span>
          </>
        )}
      </button>
    </div>
  </form>
</main>
