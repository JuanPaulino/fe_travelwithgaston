import React from 'react'
import ImageCarousel from './common/ImageCarousel.jsx'

function HotelAvailabilityCard({ hotelData, rooms, calculatePrice }) {
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
    benefits_footnotes: hotelData.hotel_info?.benefits_footnotes || [],
    coords: hotelData.hotel_info?.coords || []
  }

  console.log('🏨 HotelAvailabilityCard - Datos extraídos:', hotel)

  const isAvailable = hotelData.is_available
  const roomTypes = hotelData.room_types || []

  // Función para navegar al hotel
  const handleViewHotel = () => {
    // navigate(`/hotel/${hotel.id}`)
  }

  // Función para manejar clic en imagen
  const handleImageClick = (imageIndex) => {
    console.log('🖼️ Imagen clickeada:', imageIndex, hotel.images[imageIndex])
    // Aquí podrías abrir un modal con la imagen en tamaño completo
  }

  console.log('🏨 HotelAvailabilityCard - Renderizando hotel:', hotel.name, 'Disponible:', isAvailable)

  return (
    <div className="overflow-hidden min-w-80 relative">
      {/* Badge de disponibilidad */}
        {!isAvailable && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-neutral-lighter text-neutral-darkest text-xs font-medium px-2.5 py-0.5 rounded-full">
              No disponible
            </span>
          </div>
        )}
        {/*row with 3 columns*/}
        <div className='flex flex-row flex-grow gap-4'>
          {/* carrusel 4 of 12 */}
          <div className='w-4/12'>
            <ImageCarousel
              images={hotel.images}
              autoPlay={false}
              autoPlayInterval={0}
              showThumbnails={false}
              onImageClick={handleImageClick}
              className={`${!isAvailable ? 'opacity-60' : ''}`}
            />
          </div>
          {/* information 8 of 12 */}
          <div className='w-5/12'>
            <div className='flex flex-col'>
              <p className='text-gray-600 mb-2'>{hotel.location}</p>
              <h5 className='font-heading text-xl mb-2'>
                {hotel.name}
              </h5>
            </div>
            <div className='flex flex-col'>
              <p className='text-gray-700 text-sm mb-4 line-clamp-3'>
                {hotel.description}
              </p>
            </div>
            <div className='flex flex-col'>
              {/* Beneficios/Benefits */}
              {hotel.benefits && hotel.benefits.length > 0 && (
                <div className="space-y-1 mb-4">
                  {hotel.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-neutral-darker">
                      <span className="text-neutral-dark">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hotel.benefits_footnotes && hotel.benefits_footnotes.length > 0 && (
                <div className="text-sm">
                  {hotel.benefits_footnotes.map(benefit => (
                    <span className='text-neutral-DEFAULT font-thin'>{benefit}</span>
                  ))}
                </div>
              )}
          </div>
          {/* price 4 of 12 */}
          <div className='w-3/12'>
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
            {/* Precio y botón */}
            <div className="ml-6">
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
                    className="bg-black text-white px-6 py-2 font-medium transition-colors"
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
  )
}

export default HotelAvailabilityCard 