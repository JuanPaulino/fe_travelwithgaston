import { useEffect, useState } from 'react';
import { authStore } from '../stores/authStore';
import { useBookingStore } from '../stores/useBookingStore';
import { bookingAPI, handleAPIError } from '../lib/http';
import { showSuccess } from '../stores/bannerStore';
import CreditCardForm from './CreditCardForm';

const Booking = ({ className = '' }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creditCardValid, setCreditCardValid] = useState(false);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const { bookingData, updateCreditCard } = useBookingStore();
  console.log('Booking Component',bookingData);
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

  // Función para manejar cambios en la tarjeta de crédito
  const handleCreditCardChange = (creditCardData, isValid) => {
    setCreditCardValid(isValid);
    if (isValid) {
      updateCreditCard(creditCardData);
    }
  };

  // Función para preparar el modelo de datos según el formato requerido por el backend
  const prepareBookingData = () => {
    if (!bookingData || !bookingData.credit_card) {
      throw new Error('Datos de reserva o tarjeta de crédito incompletos');
    }

    // Extraer datos de la habitación seleccionada
    const selectedRoom = bookingData.selected_room;
    
    if (!selectedRoom) {
      throw new Error('No se ha seleccionado una habitación');
    }

    // Extraer la primera tarifa de la habitación (asumiendo que es la seleccionada)
    const selectedRate = selectedRoom.rates && selectedRoom.rates.length > 0 ? selectedRoom.rates[0] : null;
    
    if (!selectedRate) {
      throw new Error('No se encontró una tarifa válida para la habitación');
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
      totalPrice: selectedRate.total_to_book
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
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
      rooms: rooms
    };

    return bookingPayload;
  };

  // Función para procesar la reserva
  const handleProcessBooking = async () => {
    if (!creditCardValid) {
      setBookingError('Por favor, complete todos los datos de la tarjeta de crédito');
      return;
    }

    setProcessingBooking(true);
    setBookingError(null);

    try {
      // Preparar los datos de la reserva
      const bookingPayload = prepareBookingData();

      // Enviar la reserva al backend
      const response = await bookingAPI.createBooking(bookingPayload);

      if (response.success) {
        // Éxito - mostrar banner de éxito y redirigir
        showSuccess('¡Reserva creada exitosamente!', { autoHide: true });
        
        // Redirigir a la página de cuenta después de un breve delay
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } else {
        setBookingError(response.message || 'Error al procesar la reserva');
      }
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      const errorInfo = handleAPIError(error);
      setBookingError(errorInfo.message || 'Error al procesar la reserva');
    } finally {
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
            <p className="text-gray-600">Verificando acceso...</p>
          </div>
        </div>
      </div>
    );
  }


  // Si cumple los requisitos, mostrar el contenido normal
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Columna izquierda - 40% en desktop, 100% en móvil */}
        <div className="w-full lg:w-2/5 order-1 lg:order-1">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-6">Detalles de la Reserva</h2>
            
            {/* 1. Información del hotel */}
            <div className="mb-6">
              {/* Nombre del hotel */}
              <h3 className="font-semibold text-gray-800 mb-2">Hotel: {bookingData.hotel_name}</h3>
              {/* Dirección del hotel */}
              {bookingData.selected_room?.hotel_address && (
                <p className="text-gray-600 text-sm mb-2">
                  {bookingData.selected_room.hotel_address}
                </p>
              )}
            </div>

            {/* 2. Información de la habitación */}
            <div className="mb-6">
              {/* Nombre de la habitación */}
              <h3 className="font-medium text-gray-800 mb-2">
                Habitación: {bookingData.selected_room?.name || 'Habitación no especificada'}
              </h3>
              
              {/* Foto de la habitación */}
              {bookingData.selected_room?.images && bookingData.selected_room.images.length > 0 && (
                <div className="mb-3">
                  <img 
                    src={bookingData.selected_room.images[0].url} 
                    alt={bookingData.selected_room.name}
                    className="w-full object-cover"
                  />
                </div>
              )}
              
              {/* Fechas de Check-in y Check-out */}
              <div className="mb-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Check-in:</span>
                  <span className="text-sm text-gray-600">
                    {bookingData.start_date ? new Date(bookingData.start_date).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">Check-out:</span>
                  <span className="text-sm text-gray-600">
                    {bookingData.end_date ? new Date(bookingData.end_date).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* Resumen de ocupación */}
              {bookingData.selected_room?.occupancies && bookingData.selected_room.occupancies.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-800 mb-2 text-sm">Resumen de ocupación</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Habitaciones:</span>
                      <span className="text-gray-800 font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adultos:</span>
                      <span className="text-gray-800 font-medium">
                        {bookingData.adults || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Niños:</span>
                      <span className="text-gray-800 font-medium">
                        {bookingData.children || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Información del huésped */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-2 text-base">Huésped:</h3>
              <p className="text-gray-600 text-sm">Nombre: {bookingData.guest_name || 'N/A'}</p>
              <p className="text-gray-600 text-sm">Email: {bookingData.guest_email || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Columna derecha - 60% en desktop, 100% en móvil */}
        <div className="w-full lg:w-3/5 order-2 lg:order-2">
          <div className="p-4 border border-gray-200 rounded-lg">
            <CreditCardForm 
              onCreditCardChange={handleCreditCardChange}
            />
            
            {/* Botón de confirmación de reserva */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                disabled={!creditCardValid || processingBooking}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                  creditCardValid && !processingBooking
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleProcessBooking}
              >
                {processingBooking ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  creditCardValid ? 'Confirmar Reserva' : 'Complete los datos de la tarjeta'
                )}
              </button>
              
              {!creditCardValid && !processingBooking && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Complete todos los campos de la tarjeta para continuar
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
