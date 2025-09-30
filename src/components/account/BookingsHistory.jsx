import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../lib/http.js';
import BookingDetail from './BookingDetail.jsx';

const BookingsHistory = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookingAPI.getBookings();
        setBookings(response);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
  };

  // Si hay una reserva seleccionada, mostrar el detalle
  if (selectedBooking) {
    return <BookingDetail booking={selectedBooking} onBack={handleBackToList} />;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bookings</h3>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bookings</h3>
        <div className="mt-8 p-6 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Bookings</h3>

      {/* Mostrar cards de reservas si existen */}
      {bookings?.data?.bookings && bookings.data.bookings.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.data.bookings.map((booking) => (
              booking.providerData && (
              <div key={booking.id} className="w-full md:w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                {/* Imagen del hotel */}
                <div className="h-64 relative">
                  <div className="absolute inset-0 object-cover flex items-center justify-center">
                    <img src={booking.providerData.image.url} alt={booking.hotelName} />
                  </div>
                </div>
                
                {/* Contenido de la card */}
                <div className="p-6">
                  {/* Nombre del hotel */}
                  <h5 className="text-lg font-bold text-gray-900 mb-4">{booking.hotelName}</h5>
                  
                  {/* Fechas */}
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">CHECK IN</p>
                      <p className="text-base font-semibold text-neutral-darker">
                        {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">CHECK OUT</p>
                      <p className="text-base font-semibold text-neutral-darker">
                        {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Información de la reserva */}
                  <div className="mb-4">
                    <p className="text-base font-semibold text-neutral-darker">{booking.guestName}</p>
                    <p className="text-base font-thin text-neutral-darker">{booking.guestEmail}</p>
                  </div>
                  
                  {/* Precio total */}
                  <div className="flex justify-end items-center mb-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${booking.totalPrice.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Total inc tax</p>
                    </div>
                  </div>
                  
                  {/* Botón View */}
                  <button 
                    onClick={() => handleViewBooking(booking)}
                    className="w-full bg-black border border-black text-white px-6 py-2 rounded-md hover:bg-gray-50 hover:text-black transition-colors duration-200"
                  >
                    View details
                  </button>
                  
                  {/* Estado de la reserva */}
                  <div className="mt-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'upcoming' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            )))}
          </div>
          
          {/* Información de paginación */}
          {bookings.data.pagination && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Page {bookings.data.pagination.page} of {bookings.data.pagination.totalPages} 
              ({bookings.data.pagination.total} bookings in total)
            </div>
          )}
        </div>
      )}

      {/* Mensaje si no hay reservas */}
      {bookings?.data?.bookings && bookings.data.bookings.length === 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bookings registered.</p>
        </div>
      )}
    </div>
  );
};

export default BookingsHistory;
