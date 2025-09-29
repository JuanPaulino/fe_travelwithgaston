import React, { useState, useEffect } from 'react';
import ImageCarousel from './common/ImageCarousel.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useBookingStore } from '../stores/useBookingStore.js'
import { useAuth } from '../lib/useAuth.js'
import MembershipCard from './MembershipCard.jsx'

const AvailableHotelRooms = ({ parentHotelData }) => {
  const { searchData, executeSearch } = useSearchStore();
  const { processBooking } = useBookingStore();
  const { user, isAuthenticated } = useAuth();
  const [hotelData, setHotelData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          setError(err.message || 'Error al obtener la disponibilidad del hotel');
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
  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: hotel.default_currency || 'EUR',
      minimumFractionDigits: 2
    }).format(price);
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
          <span className="ml-3 text-neutral-darkest">Cargando disponibilidad...</span>
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
            Reintentar
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
      {
      roomTypes.length > 0
        ? <>
            <h2 className="text-h2 font-heading text-neutral-darkest mb-6">
              Select your room
            </h2>
            {roomTypes.map((room, index) => (
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
                          <span className="text-sm">{room.occupancies[0]?.adults || 2} adultos</span>
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
                  {room.rates.map((rate, index) => <>
                    <div key={index} className="flex flex-row mb-8 p-6 border-neutral-lighter">
                      <div className='w-3/5 md:w-4/5'>
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
                      <div className='w-2/5 md:w-1/5 flex flex-col justify-end'>
                        {/* Precios destacados */}
                        <div className="p-3">
                          <p className="text-lg font-semibold text-neutral-darkest">
                            {formatPrice(rate.total_to_book)}
                          </p>
                        </div>
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
                    {index !== room.rates.length - 1 && (
                      <div className="w-full h-px bg-neutral-lighter"></div>
                    )}
                    </>)}
                </div>
              </div>
            ))}
          </>
        : null
      }
    </div>
  );
};

export default AvailableHotelRooms;
