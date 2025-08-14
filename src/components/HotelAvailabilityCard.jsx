// import { useNavigate } from 'react-router-dom'

function HotelAvailabilityCard({ hotelData, rooms, calculatePrice }) {
  // const navigate = useNavigate()

  // Logs de depuración
  console.log('🏨 HotelAvailabilityCard - Props recibidas:', {
    hotelData,
    rooms,
    hasCalculatePrice: !!calculatePrice
  })

  // Extraer datos del objeto de disponibilidad
  const hotel = {
    id: hotelData.hotel_id,
    name: hotelData.hotel_name,
    images: hotelData.hotel_info?.images || [],
    description: hotelData.hotel_info?.description || '',
    location: hotelData.hotel_info?.location || '',
    benefits: hotelData.hotel_info?.benefits || [],
    coords: hotelData.hotel_info?.coords || []
  }

  console.log('🏨 HotelAvailabilityCard - Datos extraídos:', hotel)

  const isAvailable = hotelData.is_available
  const roomTypes = hotelData.room_types || []

  // Función para navegar al hotel
  const handleViewHotel = () => {
    // navigate(`/hotel/${hotel.id}`)
  }

  console.log('🏨 HotelAvailabilityCard - Renderizando hotel:', hotel.name, 'Disponible:', isAvailable)

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Badge de disponibilidad */}
      <div className="relative">
        {!isAvailable && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              No disponible
            </span>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row">
          {/* Imagen del hotel */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={hotel.images?.[0]?.thumbnail_url || hotel.images?.[0]?.url}
              alt={hotel.name}
              className={`w-full h-48 md:h-full object-cover ${!isAvailable ? 'opacity-60' : ''}`}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              }}
            />
          </div>
          
          {/* Información del hotel */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hotel.name}
                </h3>
                
                {/* Ubicación */}
                <p className="text-gray-600 mb-2">{hotel.location}</p>
                
                {/* Descripción */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {hotel.description}
                </p>
                
                {/* Beneficios/Benefits */}
                {hotel.benefits && hotel.benefits.length > 0 && (
                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      Beneficios
                    </p>
                    {hotel.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </div>
                    ))}
                    {hotel.benefits.length > 2 && (
                      <div className="text-sm text-gray-500">
                        +{hotel.benefits.length - 2} más beneficios
                      </div>
                    )}
                  </div>
                )}

                {/* Información de habitaciones disponibles */}
                {isAvailable && roomTypes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Tipos de habitación disponibles:
                    </p>
                    <div className="space-y-1">
                      {roomTypes.slice(0, 3).map((roomType, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {roomType.name || roomType.room_type_name}
                        </div>
                      ))}
                      {roomTypes.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{roomTypes.length - 3} tipos más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Estado del hotel */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {hotelData.is_under_refurbishment && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      En renovación
                    </span>
                  )}
                  {hotelData.is_temporarily_closed && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      Temporalmente cerrado
                    </span>
                  )}
                  {hotelData.opened_at && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Abierto desde {new Date(hotelData.opened_at).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Precio y botón */}
              <div className="ml-6 text-right flex-shrink-0">
                {isAvailable ? (
                  <>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        €{calculatePrice(hotel.id)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total para {rooms} {rooms === 1 ? 'habitación' : 'habitaciones'} con impuestos incluidos
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Promedio por noche €{calculatePrice(hotel.id)}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleViewHotel}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ver hotel
                    </button>
                  </>
                ) : (
                  <div className="mb-4">
                    <div className="text-lg font-medium text-gray-500 mb-2">
                      No disponible
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Para las fechas seleccionadas
                    </div>
                    <button 
                      onClick={handleViewHotel}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelAvailabilityCard 