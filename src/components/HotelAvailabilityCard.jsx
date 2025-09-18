import React, { useRef, useEffect, useState } from 'react'
import ImageCarousel from './common/ImageCarousel.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'

function HotelAvailabilityCard({ hotelData, rooms }) {
  const { setSelectedDestination } = useSearchStore()
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  // Logs de depuración
  console.log('🏨 HotelAvailabilityCard - Props recibidas:', {
    hotelData,
    rooms,
  })

  // Intersection Observer para detectar cuando la tarjeta es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Extraer datos del objeto de disponibilidad
  const hotel = {
    id: hotelData.hotel_id,
    name: hotelData.hotel_name,
    images: hotelData.hotel_info?.images || [],
    description: hotelData.hotel_info?.description || '',
    location: hotelData.hotel_info?.location || '',
    benefits: hotelData.hotel_info?.benefits || [],
    benefits_footnotes: hotelData.hotel_info?.benefits_footnotes || [],
    coords: hotelData.hotel_info?.coords || [],
    lowest_rate: hotelData.lowest_rate || null
  }

  console.log('🏨 HotelAvailabilityCard - Datos extraídos:', hotel)

  const isAvailable = hotelData.is_available

  // Función para navegar al hotel
  const handleViewHotel = () => {
    // TODO: necesitamos modificar el valor en el store de selectedDestinationType por hotel selectedDestinationId por el id del hotel
    setSelectedDestination({
      type: 'hotel',
      id: hotel.id,
      text: hotel.name,
      location: hotel.location,
    })
    window.location.href = `/hotels/${hotel.id}`
  }

  // Función para manejar clic en imagen
  const handleImageClick = (imageIndex) => {
    console.log('🖼️ Imagen clickeada:', imageIndex, hotel.images[imageIndex])
    // Aquí podrías abrir un modal con la imagen en tamaño completo
  }

  console.log('🏨 HotelAvailabilityCard - Renderizando hotel:', hotel.name, 'Disponible:', isAvailable)

  return (
    <div ref={cardRef} className="overflow-hidden min-w-80 relative">
      {/* Badge de disponibilidad */}
        {!isAvailable && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-neutral-lighter text-neutral-darkest text-xs font-medium px-2.5 py-0.5 rounded-full">
              Not available
            </span>
          </div>
        )}
        {/*row with 3 columns*/}
        <div className='flex flex-row flex-grow gap-4'>
          {/* carrusel 4 of 12 */}
          <div className='w-4/12'>
            {isVisible ? (
              <ImageCarousel
                images={hotel.images}
                autoPlay={false}
                autoPlayInterval={0}
                showThumbnails={false}
                onImageClick={handleImageClick}
                className={`${!isAvailable ? 'opacity-60' : ''}`}
              />
            ) : (
              <div className={`w-full h-full bg-gray-200 flex items-center justify-center aspect-[3/2] ${!isAvailable ? 'opacity-60' : ''}`}>
                <div className="text-gray-500 text-center p-8">
                  <div className="text-4xl mb-2">🏨</div>
                  <p>Loading...</p>
                </div>
              </div>
            )}
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
                    <div key={index} className="flex items-center gap-2 text-xs text-neutral-darker">
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
                  Under renovation
                </span>
              )}
              {hotelData.is_temporarily_closed && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  Temporarily closed
                </span>
              )}
              {hotelData.opened_at && (
                <span className="bg-primary text-black px-2 py-1 rounded">
                  Opened from {new Date(hotelData.opened_at).getFullYear()}
                </span>
              )}
            </div>
            {/* Precio y botón */}
            <div className="ml-6">
              {isAvailable ? (
                <>
                  <div className="mb-4 p-4">
                    {hotel.lowest_rate ? (
                      <>
                        <div className="text-3xl font-bold text-gray-900">
                          €{hotel.lowest_rate.total_to_book_in_requested_currency}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total for {rooms} {rooms === 1 ? 'room' : 'rooms'} {hotel.lowest_rate.is_tax_included ? 'with taxes included' : 'without taxes'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Average per night €{hotel.lowest_rate.rate_in_requested_currency}
                        </div>
                        
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-gray-900 blur-sm select-none">
                          0000
                        </div>
                        <div className="text-sm text-gray-600 blur-xs select-none">
                          Total for {rooms} {rooms === 1 ? 'room' : 'rooms'} with taxes included
                        </div>
                        <div className="text-sm text-gray-600 mt-1 blur-xs select-none">
                          Average per night 0000
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleViewHotel}
                    className="bg-primary text-white px-6 py-2 font-medium transition-colors pointer"
                  >
                    View hotel
                  </button>
                </>
              ) : (
                <div className="mb-4">
                  <div className="text-lg font-medium text-gray-500 mb-2">
                    Not available
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    For the selected dates
                  </div>
                  <button 
                    onClick={handleViewHotel}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors pointer"
                  >
                    View details
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