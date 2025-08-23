import React from 'react'
import { useSearchStore } from '../stores/useSearchStore.js'
import HotelAvailabilityList from './HotelAvailabilityList.jsx'
import ErrorMessage from './common/ErrorMessage.jsx'

const SearchResults = ({ className = '' }) => {
  const { resultsData } = useSearchStore()
  const { hotels, loading, error, lastSearch } = resultsData

  // Logs de depuración
  console.log('🔍 SearchResults - Datos recibidos:', {
    hotels: hotels?.length || 0,
    loading,
    error,
    lastSearch: !!lastSearch,
    resultsData
  })

  // Componente de debug para mostrar el estado del store
  const DebugInfo = () => (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
      <h3 className="font-bold mb-2">🔍 Debug Info:</h3>
      <div className="space-y-1">
        <div>Hotels: {hotels?.length || 0}</div>
        <div>Loading: {loading ? 'Sí' : 'No'}</div>
        <div>Error: {error || 'Ninguno'}</div>
        <div>LastSearch: {lastSearch ? 'Sí' : 'No'}</div>
        {lastSearch && (
          <div className="mt-2 p-2 bg-white rounded text-xs">
            <pre>{JSON.stringify(lastSearch, null, 2)}</pre>
          </div>
        )}
        {hotels && hotels.length > 0 && (
          <div className="mt-2 p-2 bg-white rounded text-xs">
            <div>Primer hotel:</div>
            <pre>{JSON.stringify(hotels[0], null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )

  // Si no hay búsqueda previa, mostrar mensaje informativo
  if (!lastSearch) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="text-gray-500">
          <p className="text-lg mb-2">👋 ¡Bienvenido a la búsqueda de hoteles!</p>
          <p className="text-sm">Usa el formulario de arriba para buscar hoteles disponibles.</p>
        </div>
      </div>
    )
  }

  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          message={error}
          className="text-center py-8"
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <HotelAvailabilityList
        hotels={hotels}
        loading={loading}
        rooms={lastSearch.rooms}
      />
    </div>
  )
}

export default SearchResults
