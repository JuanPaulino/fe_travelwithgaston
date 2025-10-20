import React, { useState, useEffect } from 'react';
import ImageCarousel from './common/ImageCarousel.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useBookingStore } from '../stores/useBookingStore.js'
import { useAuth } from '../lib/useAuth.js'
import MembershipCard from './MembershipCard.jsx'
import currencies from '../data/currencies.json'

const AvailableHotelRooms = ({ parentHotelData }) => {
  const { searchData, executeSearch } = useSearchStore();
  const { processBooking } = useBookingStore();
  const { user, isAuthenticated } = useAuth();
  const [hotelData, setHotelData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Ejecutar búsqueda cuando el componente se monta o cambian los datos de búsqueda
  useEffect(() => {
    const fetchHotelAvailability = async () => {
      // Solo ejecutar si tenemos un destino seleccionado
      if (searchData?.selectedDestinationId) {
        setLoading(true);
        setError(null);
        
        try {
          const response = await executeSearch();
          if (response && response.search_type === 'hotel') {
            setHotelData(response.results[0]);
          }
        } catch (err) {
          setError(err.message || 'Error getting hotel availability');
        } finally {
          setLoading(false);
        }
      }
    };
    if (isAuthenticated) {
      fetchHotelAvailability();
    }
  }, [searchData?.selectedDestinationId, executeSearch]);

  const hotel = hotelData;
  const session_id = hotel?.session_id;
  const roomTypes = hotel?.room_types || [];
  console.log(roomTypes);

  // Función para manejar el clic en "Book now"
  const handleBookNow = (room, rate) => {
    // Obtener datos del usuario (esto debería venir de un store de auth o similar)
    const userData = {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
    };
    hotelData.hotel_address = parentHotelData.address;
    // Procesar la reserva con todos los datos
    processBooking(hotelData, room, rate, searchData, userData);
    window.location.href = '/booking';
  };

  // Función para manejar el clic en "Subscribe now"
  const handleSubscribeNow = () => {
    window.location.href = '/checkout';
  };

  // Función para determinar qué botón mostrar
  const getButtonConfig = () => {
    if (!isAuthenticated || !user) {
      return null; // No mostrar botón si no está autenticado
    }
    
    if (user.role === 'basic') {
      return {
        text: 'Subscribe now',
        onClick: handleSubscribeNow,
        className: 'w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 transition-colors cursor-pointer'
      };
    }
    
    // Para otros roles (premium, admin, etc.)
    return {
      text: 'Book now',
      onClick: (room, rate) => handleBookNow(room, rate),
      className: 'w-full bg-black hover:bg-primary-dark text-white font-medium py-3 px-6 transition-colors cursor-pointer'
    };
  };

  // Función para formatear el precio
  // Función para obtener el símbolo de la moneda
  const getCurrencySymbol = (currency) => {
    const currencyObj = currencies.find(c => c.iso_code === currency);
    return currencyObj ? currencyObj.symbol : '';
  };

  // Función para formatear el precio
  const formatPrice = (price) => {
    if (!price) return null;
    return Number(price).toLocaleString('en-US');
  };

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

  const openRatesModal = () => {
    setShowRatesModal(true);
  };

  const closeRatesModal = () => {
    setShowRatesModal(false);
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="mb-8 w-full">
        <h2 className="text-h2 font-heading text-neutral-darkest mb-6">
          Select your room
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-neutral-darkest">Loading availability...</span>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurrió alguno
  if (error) {
    return (
      <div className="mb-8 w-full">
        <h2 className="text-h2 font-heading text-neutral-darkest mb-6">
          Select your room
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      {(!isAuthenticated || ( isAuthenticated && user?.role === 'basic' )) && (
        <div className="mt-8 mb-8">
          <MembershipCard />
        </div>
      )}
      
      {roomTypes.length > 0 && (
        <>
            <h2 className="text-h2 font-heading text-neutral-darkest mb-6">
              Select your room
            </h2>
          
          {/* Vista móvil compacta */}
          {isMobile ? (
            <div className="space-y-4">
              {/* Carrusel de habitaciones con scroll horizontal */}
              <div className="w-full">
                <div 
                  className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                  style={{ 
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {roomTypes.map((room, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 w-80 rounded-lg border border-neutral-lighter bg-white"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      {/* Imagen de la habitación */}
                      <div className="relative h-64">
                        <ImageCarousel images={room?.images || []} />
                        {/* Indicador de scroll para múltiples habitaciones */}
                        {roomTypes.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full p-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Información de la habitación */}
                      <div className="p-4">
                        <h3 className="text-lg font-heading text-neutral-darkest mb-2">
                          {room?.name}
                          {room?.has_accessibility && " - Accessible"}
                        </h3>
                        
                        {/* Detalles compactos */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <img src="/images/activity_zone.png" alt="size" className="w-4 h-4" />
                            <span className="text-sm text-neutral-darkest">{room?.room_size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/images/bed.png" alt="bed" className="w-4 h-4" />
                            <span className="text-sm text-neutral-darkest">{room?.bed_size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/images/group.png" alt="occupancy" className="w-4 h-4" />
                            <span className="text-sm text-neutral-darkest">
                              {room?.occupancies?.[0]?.adults || 2} adults
                            </span>
                          </div>
                          {room?.view_from_room && (
                            <div className="flex items-center gap-2">
                              <img src="/images/view_from_room.png" alt="view" className="w-4 h-4" />
                              <span className="text-sm text-neutral-darkest">{room?.view_from_room}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Botón para ver rates */}
                        <button
                          onClick={openRatesModal}
                          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                          View Rates
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Modal de rates - Pantalla completa */}
              {showRatesModal && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                  {/* Header fijo */}
                  <div className="flex items-center justify-between p-4 border-b border-neutral-lighter bg-white">
                    <h3 className="text-lg font-heading text-neutral-darkest">
                      {roomTypes[selectedRoomIndex]?.name} - Rates
                    </h3>
                    <button
                      onClick={closeRatesModal}
                      className="p-2 hover:bg-neutral-lighter rounded-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                
                  {/* Contenido scrolleable */}
                  <div className="flex-1 overflow-y-auto">
                    {roomTypes[selectedRoomIndex]?.rates.map((rate, rateIndex) => (
                      <div key={rateIndex} className="p-4 border-b border-neutral-lighter last:border-b-0">
                        {/* Header de la tarifa */}
                        <div className="mb-4">
                          <h4 className="font-heading text-xl text-neutral-darkest mb-2">{rate.title}</h4>
                          {rate.description && (
                            <p className="text-neutral-darkest font-body text-sm mb-3">
                              {rate.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Beneficios */}
                        {rate.benefits && rate.benefits.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-neutral-darkest mb-2">Included benefits</h4>
                            <div className="space-y-2">
                              {rate.benefits.map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-start gap-3">
                                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                  <span className="text-sm text-neutral-darkest">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Beneficios adicionales */}
                        {rate.additional_benefits && rate.additional_benefits.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-neutral-darkest mb-2">Additional benefits</h4>
                            <div className="space-y-2">
                              {rate.additional_benefits.map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-start gap-3">
                                  <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs">+</span>
                                  </div>
                                  <span className="text-sm text-neutral-darkest">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        
                        {/* Precios destacados - Formato desktop */}
                        <div className="text-center mb-6">
                          {rate.total_to_book_in_requested_currency && (
                            <div className="p-3">
                              <p className="text-3xl font-semibold text-neutral-darkest mb-2">
                                <span className="text-lg">{getCurrencySymbol(rate.requested_currency_code)}</span> {formatPrice(rate.total_to_book_in_requested_currency)}
                              </p>
                              <p className="text-xs text-neutral-dark mb-1">Total for {nights} {nights === 1 ? 'night' : 'nights'} inc tax</p>
                              <div className="w-full h-0.5 bg-neutral-300 mb-1"></div>
                              <p className="text-xs text-neutral-dark">Average per night {getCurrencySymbol(rate.requested_currency_code)} {formatPrice(rate.rate_in_requested_currency)} inc tax</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Información de pago y cancelación */}
                        <div className="mb-4">
                          {rate.cancellation_policy && (
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-neutral-darkest mb-1">Cancellation policy</p>
                              <p className="text-sm text-neutral-darkest">{rate.cancellation_policy}</p>
                              {rate.cancellation_deadline && (
                                <p className="text-xs text-neutral-light mt-1">
                                  Cancellation deadline: {new Date(rate.cancellation_deadline).toLocaleDateString('es-ES')}
                                </p>
                              )}
                            </div>
                          )}
                          <a href="/terms-and-conditions" className="text-sm text-neutral-light mt-1">Terms and conditions</a>
                        </div>
                        
                        {/* Botón de reserva */}
                        <button
                          onClick={() => {
                            const userData = {
                              name: user.firstName + ' ' + user.lastName,
                              email: user.email,
                            };
                            hotelData.hotel_address = parentHotelData.address;
                            processBooking(hotelData, roomTypes[selectedRoomIndex], rate, searchData, userData);
                            closeRatesModal();
                            window.location.href = '/booking';
                          }}
                          className="w-full bg-black hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors text-base"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Vista desktop original */
            roomTypes.map((room, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-6 border-x border-t ${index === roomTypes.length - 1 ? 'border-b' : ''} border-neutral-lighter p-4`}>
              {/* Panel izquierdo - Imagen y descripción */}
                <div className="w-full md:w-2/5">
                  {/* Título de la habitación */}
                  <h3 className="text-h5 sm:text-h5-desktop font-heading text-neutral-darkest mb-4">
                    {room.name}
                    {room.has_accessibility && " - Accessible"}
                  </h3>
                  {/* Imagen principal con carrusel */}
                  <ImageCarousel images={room.images} />
                  {/* Descripción de la habitación */}
                  <div className="">
                    <p className="text-neutral-darkest font-body leading-relaxed mb-4">
                      {room.description || `Experience luxury and comfort in our ${room.name}. This beautifully appointed room features ${room.room_size ? room.room_size : 'spacious accommodations'} with ${room.bed_size ? room.bed_size : 'premium bedding'} and modern amenities.`}
                    </p>

                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                      <div className="flex flex-row gap-2 items-center">
                        <img src="/images/activity_zone.png" alt="activity_zone" className="w-6 h-6" />
                        <span className="text-sm">{room.room_size}</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <img src="/images/bed.png" alt="bed" className="w-6 h-6" />
                        <span className="text-sm">{room.bed_size}</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        {room.occupancies && room.occupancies.length > 0 && (<>
                          <img src="/images/group.png" alt="group" className="w-6 h-6" />
                          <span className="text-sm">{room.occupancies[0]?.adults || 2} adults</span>
                        </>)}
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        {room.view_from_room && (<>
                          <img src="/images/view_from_room.png" alt="view_from_room" className="w-6 h-6" />
                          <span className="text-sm">{room.view_from_room}</span>
                        </>)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Panel derecho - Detalles y tarifas */}
                <div className="w-full md:w-3/5 border-t md:border-l border-neutral-lighter">
                  {/* Sección de tarifas */}
                  {room.rates.map((rate, rateIndex) => <>
                    <div key={rateIndex} className="flex flex-col sm:flex-row mb-8 p-6 border-neutral-lighter">
                      <div className='w-full sm:w-3/5 md:w-4/6'>
                          {/* Header de la tarifa */}
                          <div className="mb-4">
                            <h3 className="font-heading text-xl text-neutral-darkest mb-2">{rate.title}</h3>
                            {rate.description && (
                              <p className="text-neutral-darkest font-body text-sm mb-3">
                                {rate.description}
                              </p>
                            )}
                          </div>
                          {/* Información de pago y cancelación */}
                          <div className="mb-4">
                            {rate.cancellation_policy && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-neutral-darkest mb-1">Cancellation policy</p>
                                <p className="text-sm text-neutral-darkest">{rate.cancellation_policy}</p>
                                {rate.cancellation_deadline && (
                                  <p className="text-xs text-neutral-light mt-1">
                                    Cancellation deadline: {new Date(rate.cancellation_deadline).toLocaleDateString('es-ES')}
                                  </p>
                                )}
                              </div>
                            )}
                            {rate.payment_description && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-neutral-darkest mb-1">Payment description</p>
                                <p className="text-sm text-neutral-darkest">{rate.payment_description}</p>
                              </div>
                            )}
                          </div>
                          {/* Beneficios */}
                          {rate.benefits && rate.benefits.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-neutral-darkest mb-2">Included benefits</h4>
                              <div className="space-y-2">
                                {rate.benefits.map((benefit, benefitIndex) => (
                                  <div key={benefitIndex} className="flex items-start gap-3">
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                    <span className="text-sm text-neutral-darkest">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                              {rate.benefits_footnotes && rate.benefits_footnotes.length > 0 && (
                                <div className="mt-2">
                                  {rate.benefits_footnotes.map((footnote, footnoteIndex) => (
                                    <p key={footnoteIndex} className="text-xs text-neutral-light italic">
                                      {footnote}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Beneficios adicionales */}
                          {rate.additional_benefits && rate.additional_benefits.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-neutral-darkest mb-2">Additional benefits</h4>
                              <div className="space-y-2">
                                {rate.additional_benefits.map((benefit, benefitIndex) => (
                                  <div key={benefitIndex} className="flex items-start gap-3">
                                    <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs">+</span>
                                    </div>
                                    <span className="text-sm text-neutral-darkest">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Requisitos de estancia */}
                          {rate.stay_requirements && rate.stay_requirements.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-neutral-darkest mb-2">Stay requirements</h4>
                              <div className="space-y-2">
                                {rate.stay_requirements.map((requirement, reqIndex) => (
                                  <div key={reqIndex} className="flex items-start gap-3">
                                    <div className="w-4 h-4 bg-neutral-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-neutral-darkest text-xs">ℹ</span>
                                    </div>
                                    <span className="text-sm text-neutral-darkest">{requirement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Información adicional */}
                          <div className="text-xs text-neutral-light space-y-1">
                            {rate.is_tax_included && (
                              <p>• Taxes included</p>
                            )}
                            {rate.can_cancel && (
                              <p>• Cancellation available</p>
                            )}
                            {rate.requires_cvc && (
                              <p>• CVC code required</p>
                            )}
                            {/*<p>• Rate code: {rate.rate_index}</p>*/}
                          </div>
                      </div>
                      <div className='w-full sm:w-2/5 md:w-2/6 flex flex-col justify-end text-center sm:text-right mt-4 sm:mt-0'>
                        {/* Precios destacados */}
                        {rate.total_to_book_in_requested_currency && (
                          <div className="p-3">
                            <p className="text-3xl font-semibold text-neutral-darkest mb-2">
                              <span className="text-lg">{getCurrencySymbol(rate.requested_currency_code)}</span> {formatPrice(rate.total_to_book_in_requested_currency)}
                            </p>
                            <p className="text-xs text-neutral-dark mb-1">Total for {nights} {nights === 1 ? 'night' : 'nights'} inc tax</p>
                            <div className="w-full h-0.5 bg-neutral-300 mb-1"></div>
                            <p className="text-xs text-neutral-dark">Average per night {getCurrencySymbol(rate.requested_currency_code)} {formatPrice(rate.rate_in_requested_currency)} inc tax</p>
                          </div>
                        )}
                        {/* Botón de reserva/suscripción */}
                        <div className="mt-6">
                          {(() => {
                            const buttonConfig = getButtonConfig();
                            if (!buttonConfig) {
                              return null; // No mostrar botón si no está autenticado
                            }
                            
                            return (
                              <button 
                                onClick={() => buttonConfig.onClick(room, rate)}
                                className={buttonConfig.className}
                              >
                                {buttonConfig.text}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    {rateIndex !== room.rates.length - 1 && (
                      <div className="w-full h-px bg-neutral-lighter"></div>
                    )}
                    </>)}
                </div>
              </div>
            ))
          )}
          </>
      )}
    </div>
  );
};

export default AvailableHotelRooms;
