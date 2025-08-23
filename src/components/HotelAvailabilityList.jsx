import React, { useMemo } from 'react'

import HotelAvailabilityCard from './HotelAvailabilityCard.jsx'
import LoadingSpinner from './common/LoadingSpinner.jsx'
import EmptyState from './common/EmptyState.jsx'

const HotelAvailabilityList = ({ 
  hotels = [], 
  loading = false, 
  rooms = 1, 
}) => {
  
  // Validar que rooms sea un número
  const validRooms = typeof rooms === 'number' ? rooms : 1
  
  // Memoizar la separación de hoteles para optimizar rendimiento
  const { availableHotels, unavailableHotels } = useMemo(() => {
    const result = {
      availableHotels: hotels.filter(hotel => hotel.is_available),
      unavailableHotels: hotels.filter(hotel => !hotel.is_available)
    }
    
    return result
  }, [hotels])

  // Estado de carga
  if (loading) {
    return (
      <LoadingSpinner 
        text="Buscando hoteles..." 
        size="md"
      />
    )
  }

  // Sin resultados
  if (hotels.length === 0) {
    return (
      <EmptyState 
        icon="🏨"
        title="No se encontraron resultados"
        message="Intenta ajustar tus filtros o fechas de búsqueda."
      />
    )
  }

  console.log('✅ HotelAvailabilityList - Renderizando lista de hoteles')
  return (
    <div className="space-y-6">
      {/* Hoteles disponibles primero */}
      {availableHotels.map((hotel) => (
        <HotelAvailabilityCard
          key={hotel.hotel_id}
          hotelData={hotel}
          rooms={validRooms}
        />
      ))}
      
      {/* Separador si hay hoteles no disponibles */}
      {availableHotels.length > 0 && unavailableHotels.length > 0 && (
        <div className="py-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 bg-gray-50">
              Hoteles no disponibles para las fechas seleccionadas
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
        </div>
      )}
      
      {/* Hoteles no disponibles al final */}
      {unavailableHotels.map((hotel) => (
        <HotelAvailabilityCard
          key={hotel.hotel_id}
          hotelData={hotel}
          rooms={validRooms}
        />
      ))}
      
      {/* Resumen de resultados */}
      {hotels.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500 border-t">
          {availableHotels.length > 0 && (
            <p>
              {availableHotels.length} {availableHotels.length === 1 ? 'hotel disponible' : 'hoteles disponibles'}
              {unavailableHotels.length > 0 && (
                <span> • {unavailableHotels.length} no {unavailableHotels.length === 1 ? 'disponible' : 'disponibles'}</span>
              )}
            </p>
          )}
          {availableHotels.length === 0 && unavailableHotels.length > 0 && (
            <p>
              {unavailableHotels.length} {unavailableHotels.length === 1 ? 'hotel encontrado' : 'hoteles encontrados'}, 
              pero ninguno disponible para las fechas seleccionadas
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(HotelAvailabilityList) 