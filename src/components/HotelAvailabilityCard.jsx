import React, { useRef, useEffect, useState } from 'react'
import ImageCarousel from './common/ImageCarousel.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useAuth } from '../lib/useAuth.js'
import { useUrlParams } from '../hooks/useUrlParams.js'
import currencies from '../data/currencies.json'

function HotelAvailabilityCard({ hotelData, rooms }) {
  const { setSelectedDestination, searchData } = useSearchStore()
  const { isAuthenticated } = useAuth()
  const { buildSearchUrl } = useUrlParams()
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  // Función para obtener el símbolo de la moneda
  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.iso_code === currencyCode)
    return currency ? currency.symbol : currencyCode
  }

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


  // Si el usuario no está autenticado, mostrar todos los hoteles como disponibles
  const isAvailable = isAuthenticated ? hotelData.is_available : true

  // Función para calcular el número de noches
  const calculateNights = () => {
    // Usar checkInDate y checkOutDate del searchData, no checkin/checkout
    if (!searchData?.checkInDate || !searchData?.checkOutDate) return 1
    const checkinDate = new Date(searchData.checkInDate)
    const checkoutDate = new Date(searchData.checkOutDate)
    const diffTime = Math.abs(checkoutDate - checkinDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays || 1
  }

  const nights = calculateNights()

  // Función para navegar al hotel
  const handleViewHotel = () => {
    // Actualizar el destino seleccionado en el store
    setSelectedDestination({
      type: 'hotel',
      id: hotel.id,
      text: hotel.name,
      location: hotel.location,
    })
    const newSearchData = {
      ...searchData,
      selectedDestinationType: 'hotel',
      selectedDestinationId: hotel.id,
      selectedDestinationText: hotel.name,
      selectedDestinationLocation: hotel.location,
    }
    // Construir URL con parámetros de búsqueda y redirigir
    window.location.href = `/hotels/${hotel.id}${buildSearchUrl(newSearchData)}`
  }

  // Función para manejar clic en imagen
  const handleImageClick = (imageIndex) => {
    console.log('🖼️ Imagen clickeada:', imageIndex, hotel.images[imageIndex])
    // Aquí podrías abrir un modal con la imagen en tamaño completo
  }
  
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
        <div className='flex flex-col md:flex-row flex-grow gap-4'>
          {/* carrusel 4 of 12 */}
          <div className='w-full md:w-4/12'>
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
                  <p>Loading...</p>
                </div>
              </div>
            )}
          </div>
          {/* information 8 of 12 */}
          <div className='w-full md:w-5/12'>
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
          <div className='w-full md:w-3/12 flex justify-end items-end text-right'>
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
            </div>
            {/* Precio y botón */}
            <div className="">
              {isAvailable ? (
                <>
                  <div className="mb-4 py-4">
                    {hotel.lowest_rate ? (
                      <>
                        <div className="text-2xl font-bold text-neutral-darkest">
                          <span className="text-xl">{getCurrencySymbol(hotel.lowest_rate.requested_currency_code)}</span> {Number(hotel.lowest_rate.total_to_book_in_requested_currency).toLocaleString('en-US')}
                        </div>
                        <div className="text-xs text-neutral-dark mb-1">
                          Total for {nights} {nights === 1 ? 'night' : 'nights'} inc tax
                        </div>
                        <div className="w-full h-0.5 bg-neutral-300 mb-1"></div>
                        <div className="text-xs text-neutral-dark">
                          Average per night inc tax {getCurrencySymbol(hotel.lowest_rate.requested_currency_code)} {Number(hotel.lowest_rate.rate_in_requested_currency).toLocaleString('en-US')}
                        </div>
                        
                      </>
                    ) : null}
                  </div>
                  
                  <button 
                    onClick={handleViewHotel}
                    className="bg-primary text-white px-6 py-2 font-medium transition-colors cursor-pointer"
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
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
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