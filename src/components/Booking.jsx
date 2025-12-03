import { useEffect, useState, useRef } from 'react';
import { authStore } from '../stores/authStore';
import { useBookingStore, bookingStore } from '../stores/useBookingStore';
import { bookingAPI, handleAPIError } from '../lib/http';
import { showSuccess, showError } from '../stores/bannerStore';
import CreditCardForm from './CreditCardForm';
import { calculateNights } from '../lib/dateUtils';

// Función para obtener idempotency key del backend
const getBookingIdempotencyKey = async (hotelId, checkIn, checkOut) => {
  try {
    const response = await bookingAPI.getIdempotencyKey(hotelId, checkIn, checkOut);
    if (response.success) {
      return response.data.idempotencyKey;
    }
    throw new Error(response.message || 'Error getting idempotency key');
  } catch (error) {
    console.error('Error getting idempotency key:', error);
    throw error;
  }
};

const Booking = ({ className = '' }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creditCardValid, setCreditCardValid] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [allowGuestEdit, setAllowGuestEdit] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const { bookingData, updateCreditCard } = useBookingStore();
  // Ref para prevenir múltiples requests concurrentes
  const isProcessingRef = useRef(false);
  
  // Ref para el idempotency key - se obtiene del backend
  const idempotencyKeyRef = useRef(null);
  const [idempotencyKeyLoading, setIdempotencyKeyLoading] = useState(false);

  // Calcular número de noches
  const nights = calculateNights(bookingData?.start_date, bookingData?.end_date);

  useEffect(() => {
    const checkAccess = () => {
      // Verificar autenticación
      const authState = authStore.get();
      const isAuthenticated = authState.isAuthenticated && authState.token && authState.user;
      
      // Verificar session_id en booking
      const hasSessionId = bookingData.session_id && bookingData.session_id.trim() !== '';
      
      const canAccess = isAuthenticated && hasSessionId;
      
      if (!canAccess) {
        // Redirigir a la página anterior si no cumple los requisitos
        window.history.back();
        return;
      }
      
      setIsValid(canAccess);
      setLoading(false);
    };

    // Verificar inmediatamente
    checkAccess();

    // Suscribirse a cambios en el store de auth
    const unsubscribeAuth = authStore.subscribe(() => {
      checkAccess();
    });

    return () => {
      unsubscribeAuth();
    };
  }, [bookingData.session_id]);

  // Inicializar valores de guest cuando cambie bookingData
  useEffect(() => {
    if (bookingData.guest_name) {
      setGuestName(bookingData.guest_name);
    }
    if (bookingData.guest_email) {
      setGuestEmail(bookingData.guest_email);
    }
  }, [bookingData.guest_name, bookingData.guest_email]);

  // Generar idempotency key cuando cambien los parámetros críticos
  useEffect(() => {
    const generateIdempotencyKey = async () => {
      if (bookingData.hotel_id && bookingData.start_date && bookingData.end_date) {
        try {
          setIdempotencyKeyLoading(true);
          const key = await getBookingIdempotencyKey(
            bookingData.hotel_id,
            bookingData.start_date,
            bookingData.end_date
          );
          idempotencyKeyRef.current = key;
          // console.log('Idempotency key generated:', key);
        } catch (error) {
          console.error('Error generating idempotency key:', error);
          showError('Error generating booking key. Please try again.');
        } finally {
          setIdempotencyKeyLoading(false);
        }
      }
    };

    generateIdempotencyKey();
  }, [bookingData.hotelId, bookingData.checkIn, bookingData.checkOut]);

  // Función para manejar cambios en la tarjeta de crédito
  const handleCreditCardChange = (creditCardData, isValid) => {
    setCreditCardValid(isValid);
    if (isValid) {
      updateCreditCard(creditCardData);
    }
  };

  // Función para manejar cambios en los campos de guest
  const handleGuestNameChange = (e) => {
    const value = e.target.value;
    setGuestName(value);
    // Actualizar el store de booking
    const currentData = bookingStore.get();
    const updatedData = {
      ...currentData,
      guest_name: value
    };
    bookingStore.set(updatedData);
  };

  const handleGuestEmailChange = (e) => {
    const value = e.target.value;
    setGuestEmail(value);
    // Actualizar el store de booking
    const currentData = bookingStore.get();
    const updatedData = {
      ...currentData,
      guest_email: value
    };
    bookingStore.set(updatedData);
  };

  // Función para preparar el modelo de datos según el formato requerido por el backend
  const prepareBookingData = () => {
    if (!bookingData || !bookingData.credit_card) {
      throw new Error('Incomplete booking data or credit card information');
    }

    // Extraer datos de la habitación seleccionada
    const selectedRoom = bookingData.selected_room;
    const selectedRate = bookingData.selected_rate;
    
    if (!selectedRoom) {
      throw new Error('No room has been selected');
    }

    if (!selectedRate) {
      throw new Error('No valid rate found for the room');
    }

    // Preparar el array de habitaciones según el formato requerido
    const rooms = [{
      adults: bookingData.adults || 2,
      children: bookingData.children > 0 ? Array(bookingData.children).fill({ age: 5 }) : []
    }];

    // Validar que todos los campos obligatorios estén presentes
    const requiredFields = {
      hotelId: bookingData.hotel_id?.toString(),
      hotelName: bookingData.hotel_name,
      checkIn: bookingData.start_date,
      checkOut: bookingData.end_date,
      totalPrice: selectedRate.total_to_book,
      rateIndex: selectedRate.rate_index,
      sessionId: bookingData.session_id,
      guestName: bookingData.guest_name,
      guestEmail: bookingData.guest_email,
      creditCard: bookingData.credit_card
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Preparar el modelo de datos según el formato del backend
    const bookingPayload = {
      hotelId: requiredFields.hotelId,
      hotelName: requiredFields.hotelName,
      checkIn: requiredFields.checkIn,
      checkOut: requiredFields.checkOut,
      totalPrice: parseFloat(requiredFields.totalPrice),
      sessionId: bookingData.session_id || '',
      rateIndex: selectedRate.rate_index || '',
      guestName: bookingData.guest_name || '',
      guestEmail: bookingData.guest_email || '',
      creditCard: {
        number: bookingData.credit_card.number || '',
        name: bookingData.credit_card.name || '',
        cvc: bookingData.credit_card.cvc || '',
        brandName: bookingData.credit_card.brand_name || '',
        expMonth: bookingData.credit_card.exp_month || null,
        expYear: bookingData.credit_card.exp_year || null
      },
      rooms: rooms,
      // Agregar idempotency key para prevenir duplicados
      idempotencyKey: idempotencyKeyRef.current
    };

    return bookingPayload;
  };

  // Función para procesar la reserva
  const handleProcessBooking = async () => {
    // Verificación 1: Si ya está procesando (estado), retornar inmediatamente
    if (processingBooking) {
      console.warn('Ya hay una solicitud de reserva en proceso');
      return;
    }

    // Verificación 2: Si el ref indica que está procesando, retornar inmediatamente
    if (isProcessingRef.current) {
      console.warn('Ya hay una solicitud de reserva en proceso (ref)');
      return;
    }

    // Verificación 3: Verificar que la idempotency key esté disponible
    if (!idempotencyKeyRef.current) {
      setBookingError('Booking key is not ready. Please wait a moment and try again.');
      return;
    }

    // Verificación 4: Validar tarjeta de crédito
    if (!creditCardValid) {
      setBookingError('Please complete all credit card information');
      return;
    }

    // Marcar como procesando en ambos lugares (estado y ref)
    isProcessingRef.current = true;
    setProcessingBooking(true);
    setBookingError(null);

    try {
      // Preparar los datos de la reserva
      const bookingPayload = prepareBookingData();

      // Enviar la reserva al backend
      const response = await bookingAPI.createBooking(bookingPayload);
      if (response.success) {
        // Éxito - mostrar banner de éxito y redirigir
        showSuccess('Booking created successfully!', { autoHide: true, position: 'top-center', duration: 5000 });
        
        // Redirigir a la página de cuenta después de un breve delay
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } else {
        // Solo resetear si hubo un error (para permitir reintentos)
        isProcessingRef.current = false;
        setBookingError(response.message || 'Error processing the booking');
      }
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      if (error.response.data.code === 'booking_conflict') {
        showError('The selected dates are not available for this hotel', { autoHide: true, position: 'top-center', duration: 5000 });
        return;
      }
      const errorInfo = handleAPIError(error);
      // Solo resetear si hubo un error (para permitir reintentos)
      isProcessingRef.current = false;
      
      setBookingError(errorInfo.message || 'Error processing the booking');
    } finally {
      isProcessingRef.current = false;
      setProcessingBooking(false);
    }
  };

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si cumple los requisitos, mostrar el contenido normal
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Columna izquierda - 40% en desktop, 100% en móvil */}
        <div className="w-full lg:w-2/5 order-1 lg:order-1">
          <div className="p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-6">Booking Details</h2>
            
            {/* 1. Información del hotel */}
            <div className="mb-6">
              {/* Nombre del hotel */}
              <h3 className="font-semibold text-gray-800 mb-2">Hotel: {bookingData.hotel_name}</h3>
              {/* total_to_book_in_requested_currency */}
              <p className="text-gray-600 font-bold text-sm mb-2">
                {bookingData.selected_rate.requested_currency_code} {bookingData.selected_rate.total_to_book_in_requested_currency}
              </p>
              <p className="text-gray-600 text-sm mb-2">Total for {nights} {nights === 1 ? 'night' : 'nights'} inc tax</p>
              <div className='w-full h-0.5 bg-neutral-200 mb-2'></div>
              <p className="text-gray-600 text-sm mb-2">Average per night inc tax {bookingData.selected_rate.requested_currency_code} {bookingData.selected_rate.rate_in_requested_currency}</p>
              

              {/* Dirección del hotel */}
              {bookingData.selected_room?.hotel_address && (
                <p className="text-gray-600 text-sm mb-2">
                  {bookingData.selected_room.hotel_address}
                </p>
              )}
            </div>

            {/* 2. Información de la habitación */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              {/* Nombre de la habitación */}
              <h3 className="font-medium text-gray-800 mb-2">
                Room: {bookingData.selected_room.name}
              </h3>
              <h4 className="font-medium text-gray-800 mb-2">
                {bookingData.selected_rate.title}
              </h4>
              {/* Foto de la habitación */}
              {bookingData.selected_room?.images && bookingData.selected_room.images.length > 0 && (
                <div className="mb-3">
                  <img 
                    src={bookingData.selected_room.images[0].url} 
                    alt={bookingData.selected_room.name}
                    className="w-full object-cover max-h-40"
                  />
                </div>
              )}
              
              {/* Fechas de Check-in y Check-out */}
              <div className="mb-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-neutral-600">Check-in:</span>
                  <span className="text-sm text-neutral-500">
                    {bookingData.start_date ? new Date(bookingData.start_date).toLocaleDateString('en-US') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-neutral-600">Check-out:</span>
                  <span className="text-sm text-neutral-500">
                    {bookingData.end_date ? new Date(bookingData.end_date).toLocaleDateString('en-US') : 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* Resumen de ocupación */}
              {bookingData.selected_room?.occupancies && bookingData.selected_room.occupancies.length > 0 && (
                <div className="rounded-lg p-3">
                  <h5 className="font-medium text-gray-800 mb-2 text-sm">Occupancy Summary</h5>
                  <div className="space-y-1 text-sm text-neutral-500">
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adults:</span>
                      <span className="font-medium">
                        {bookingData.adults || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Children:</span>
                      <span className="font-medium">
                        {bookingData.children || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* benefits */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-base">Benefits</h3>
              <ul>
              {
                bookingData.selected_rate.benefits.map((benefit, index) => (
                  <li key={index} className="text-neutral-500 text-sm">
                    <span className="text-neutral-800 font-medium mr-0.5">✓</span>
                    {benefit}
                  </li>
                ))
              }
              {
                bookingData.selected_rate.benefits_footnotes.map((footnote, index) => (
                  <li key={index} className="text-neutral-500 text-sm">
                    {footnote}
                  </li>
                ))
              }
              </ul>
            </div>

            {/* Información del huésped */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 text-base">Guest:</h3>
              <p className="text-neutral-500 text-sm">Name: {bookingData.guest_name || 'N/A'}</p>
              <p className="text-neutral-500 text-sm">Email: {bookingData.guest_email || 'N/A'}</p>
            </div>


            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Terms & conditions</h3>
              <p className="text-neutral-500 text-sm mb-2">
                {bookingData.selected_rate.cancellation_policy}
              </p>
              {
                bookingData.selected_rate.cancellation_deadline && (
                  <p className="text-neutral-500 text-sm mb-2">
                    Cancellation deadline: {new Date(bookingData.selected_rate.cancellation_deadline).toLocaleString('en-US')}
                  </p>
                )
              }
              <p className="text-neutral-500 text-sm">
                {bookingData.selected_rate.payment_description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Columna derecha - 60% en desktop, 100% en móvil */}
        <div className="w-full lg:w-3/5 order-2 lg:order-2">
          
          <div className="p-4 border border-gray-200">
            {/* Switch to enable guest data editing */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Edit guest information
                  </h3>
                  <p className="text-xs text-gray-500">
                    Allows modifying guest name and email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={allowGuestEdit}
                    onChange={(e) => setAllowGuestEdit(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Guest editing fields - only shown when switch is off (default state) */}
            {allowGuestEdit && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      id="guestName"
                      value={guestName}
                      onChange={handleGuestNameChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div>
                    <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Email
                    </label>
                    <input
                      type="email"
                      id="guestEmail"
                      value={guestEmail}
                      onChange={handleGuestEmailChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter guest email"
                    />
                  </div>
                </div>
              </div>
            )}

            <CreditCardForm 
              onCreditCardChange={handleCreditCardChange}
            />
            
            {/* Botón de confirmación de reserva */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                disabled={!creditCardValid || processingBooking || idempotencyKeyLoading || !idempotencyKeyRef.current}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  creditCardValid && !processingBooking && !idempotencyKeyLoading && idempotencyKeyRef.current
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleProcessBooking}
              >
                {processingBooking ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : idempotencyKeyLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                    Preparing booking...
                  </div>
                ) : !idempotencyKeyRef.current ? (
                  'Preparing booking...'
                ) : (
                  creditCardValid ? 'Confirm Booking' : 'Complete card information'
                )}
              </button>
              
              {!creditCardValid && !processingBooking && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Complete all card fields to continue
                </p>
              )}

              {bookingError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{bookingError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
