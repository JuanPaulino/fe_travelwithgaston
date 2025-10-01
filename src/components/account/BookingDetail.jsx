import React, { useState } from 'react';
import { bookingAPI, handleAPIError } from '../../lib/http';
import { showSuccess, showError } from '../../stores/bannerStore';
import ConfirmationModal from '../modals/ConfirmationModal';

const BookingDetail = ({ booking, onBack }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!booking || !booking.providerData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Booking data not found</p>
        <button 
          onClick={onBack}
          className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  const { providerData } = booking;
  const room = providerData.rooms?.[0]; // Tomamos la primera habitación

  // Función para mostrar el modal de confirmación
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  // Función para manejar la cancelación de la reserva
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    setShowCancelModal(false);

    try {
      const result = await bookingAPI.cancelBooking(booking.id);
      
      if (result.success) {
        // Mostrar mensaje de éxito con banner
        showSuccess('Booking cancelled successfully!', { autoHide: true });
        
        // Actualizar el estado de la reserva en el componente padre
        if (typeof onBack === 'function') {
          onBack();
        }
        // Recargar la página para mostrar el estado actualizado
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showError(result.message || 'Error cancelling the booking', { autoHide: true });
      }
    } catch (error) {
      const errorResult = handleAPIError(error);
      showError(errorResult.message, { autoHide: true });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header con botón de volver */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to bookings
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{booking.hotelName}</h1>
        <p className="text-gray-600 mt-1">{providerData.address}</p>
      </div>

      {/* Estado de la reserva */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          booking.status === 'upcoming' 
            ? 'bg-yellow-100 text-yellow-800' 
            : booking.status === 'confirmed'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {booking.status === 'upcoming' ? 'Upcoming' : 
           booking.status === 'confirmed' ? 'Confirmed' : 
           booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Imagen principal del hotel */}
      <div className="mb-8">
        <div className="h-80 rounded-lg overflow-hidden">
          <img 
            src={providerData.image.url} 
            alt={booking.hotelName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Grid principal de información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Información de la reserva */}
        <div className="space-y-6">
          
          {/* Fechas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CHECK IN</p>
                <p className="text-sm text-neutral-darker">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CHECK OUT</p>
                <p className="text-sm text-neutral-darker">
                  {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Duration: {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
              </p>
            </div>
          </div>

          {/* Información del huésped */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest information</h3>
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-900">{booking.guestName}</p>
              <p className="text-base text-gray-600">{booking.guestEmail}</p>
              <p className="text-sm text-gray-500">
                {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </div>

          {/* Detalles de confirmación */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Booking ID:</span>
                <span className="text-sm font-medium text-gray-900">#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Confirmation number:</span>
                <span className="text-sm font-medium text-gray-900">{providerData.confirmation_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Provider ID:</span>
                <span className="text-sm font-medium text-gray-900">{booking.providerBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Booking date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de la habitación y precios */}
        <div className="space-y-6">
          
          {/* Detalles de la habitación */}
          {room && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room details</h3>
              
              {/* Tipo de habitación */}
              <div className="mb-4">
                <h4 className="text-base font-medium text-gray-900 mb-2">{room.room_type}</h4>
                <p className="text-sm text-gray-600">
                  {room.adults} {room.adults === 1 ? 'adult' : 'adults'}
                  {room.children && room.children.length > 0 && `, ${room.children.length} ${room.children.length === 1 ? 'child' : 'children'}`}
                </p>
              </div>

              {/* Rate title */}
              {room.rate_title && room.rate_title.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Rate: {room.rate_title.join(', ')}</p>
                </div>
              )}

              {/* Beneficios */}
              {room.benefits && room.benefits.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Included benefits:</h5>
                  <ul className="space-y-1">
                    {room.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Imágenes de la habitación */}
              {room.images && room.images.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Room photos:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {room.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="h-20 rounded overflow-hidden">
                        <img 
                          src={image.thumbnail_url || image.url} 
                          alt={`Room ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información de precios */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price summary</h3>
            <div className="space-y-3">
              <div className="pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {booking.providerData.currency} {booking.providerData.total_cost.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Taxes included</p>
              </div>
            </div>
          </div>

          {/* Políticas */}
          {room && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
              
              {/* Política de cancelación */}
              {room.cancellation_policy && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Cancellation:</h5>
                  <p className="text-sm text-gray-600">{room.cancellation_policy}</p>
                  {providerData.is_cancellable && (
                    <p className="text-xs text-green-600 mt-1">✓ Free cancellation available</p>
                  )}
                </div>
              )}

              {/* Política de depósito */}
              {room.deposit_policy && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Deposit:</h5>
                  <p className="text-sm text-gray-600">{room.deposit_policy}</p>
                </div>
              )}

              {/* Notas adicionales */}
              {room.benefits_footnotes && room.benefits_footnotes.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Important notes:</h5>
                  <ul className="space-y-1">
                    {room.benefits_footnotes.map((note, index) => (
                      <li key={index} className="text-xs text-gray-500">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {providerData.is_cancellable && (
          <button 
            onClick={handleCancelClick}
            disabled={isCancelling}
            className="flex-1 bg-white border border-red-300 text-red-700 px-6 py-3 rounded-md hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel booking'}
          </button>
        )}
        {/*
          TODO: Add back the buttons
          <button className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
            Download confirmation
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
            Contact support
          </button>
        */}
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        type="danger"
      />
    </div>
  );
};

export default BookingDetail;
