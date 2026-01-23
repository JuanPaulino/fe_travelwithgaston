import React from 'react';

const BookingCard = ({ booking, onViewDetails }) => {
  return (
    <div className="w-full md:w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Imagen del hotel */}
      <div className="h-64 relative">
        <div className="absolute object-cover flex items-center justify-center">
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
          onClick={() => onViewDetails(booking)}
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
  );
};

export default BookingCard;
