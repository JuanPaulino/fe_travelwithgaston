import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../lib/http.js';
import BookingDetail from './BookingDetail.jsx';
import BookingCard from './BookingCard.jsx';
import Tabs from '../common/Tabs.jsx';

const BookingsHistory = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, cancelled

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

  // Filtrar bookings según el tab activo
  const getFilteredBookings = () => {
    if (!bookings?.data?.bookings) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.data.bookings.filter(booking => {
      const checkOutDate = new Date(booking.checkOut);
      checkOutDate.setHours(0, 0, 0, 0);
      
      if (activeTab === 'upcoming') {
        return booking.status === 'upcoming' || booking.status === 'confirmed';
      } else if (activeTab === 'past') {
        return checkOutDate < today && booking.status !== 'cancelled';
      } else if (activeTab === 'cancelled') {
        return booking.status === 'cancelled';
      }
      return false;
    });
  };

  const filteredBookings = getFilteredBookings();

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
  };

  // Configuración de tabs
  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

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
  // Renderizar el contenido de las reservas
  const renderBookingsContent = () => (
    <>
      {/* Mostrar cards de reservas filtradas */}
      {filteredBookings.length > 0 && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              booking.providerData && (
                <BookingCard 
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleViewBooking}
                />
              )
            ))}
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

      {/* Mensaje si no hay reservas en el tab actual */}
      {filteredBookings.length === 0 && bookings?.data?.bookings && (
        <div className="mt-8 p-6 bg-primary-lighter rounded-lg">
          <p className="text-primary-darker">
            {activeTab === 'upcoming' && 'No upcoming bookings.'}
            {activeTab === 'past' && 'No past bookings.'}
            {activeTab === 'cancelled' && 'No cancelled bookings.'}
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Bookings</h3>

      {/* Usar el componente Tabs reutilizable */}
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderBookingsContent()}
      </Tabs>
    </div>
  );
};

export default BookingsHistory;
