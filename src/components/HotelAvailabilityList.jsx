import React, { useMemo, useEffect, useState } from 'react'
import { getUser, isAuthenticated as checkIsAuthenticated } from '../stores/authStore'
import HotelAvailabilityCard from './HotelAvailabilityCard.jsx'
import EmptyState from './common/EmptyState.jsx'
import MembershipCard from './MembershipCard.jsx'

const HotelAvailabilityList = ({
  hotels = [],
  rooms = 1,
  isAuthenticated = false,
}) => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'price-low', 'price-high'

  // Validar que rooms sea un número
  const validRooms = typeof rooms === 'number' ? rooms : 1

  // Verificar estado de autenticación y rol
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = getUser();
      const currentAuthStatus = checkIsAuthenticated();
      setUser(currentUser);
      setAuthStatus(currentAuthStatus);
    };

    // Verificar estado inicial
    checkAuthStatus();

    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('auth:login', handleAuthChange);
    window.addEventListener('auth:logout', handleAuthChange);
    window.addEventListener('auth:tokenUpdated', handleAuthChange);

    return () => {
      window.removeEventListener('auth:login', handleAuthChange);
      window.removeEventListener('auth:logout', handleAuthChange);
      window.removeEventListener('auth:tokenUpdated', handleAuthChange);
    };
  }, []);

  // Verificar si el usuario está autenticado y tiene rol "basic" para mostrar MembershipCard
  const shouldShowMembershipCard = authStatus && user?.role === 'basic';

  // Función para ordenar hoteles por precio
  const sortHotelsByPrice = (hotels, order) => {
    if (order === 'default') return hotels;
    
    return [...hotels].sort((a, b) => {
      const priceA = a.lowest_rate?.total_to_book_in_requested_currency || Infinity;
      const priceB = b.lowest_rate?.total_to_book_in_requested_currency || Infinity;
      
      // Hoteles sin precio van al final
      if (priceA === Infinity && priceB === Infinity) return 0;
      if (priceA === Infinity) return 1;
      if (priceB === Infinity) return -1;
      
      return order === 'price-low' ? priceA - priceB : priceB - priceA;
    });
  };
  
  // Memoizar la separación y ordenación de hoteles para optimizar rendimiento
  const { availableHotels, unavailableHotels } = useMemo(() => {
    const available = hotels.filter(hotel => hotel.is_available);
    const unavailable = hotels.filter(hotel => !hotel.is_available);
    
    const result = {
      availableHotels: sortHotelsByPrice(available, sortOrder),
      unavailableHotels: sortHotelsByPrice(unavailable, sortOrder)
    }
    
    return result
  }, [hotels, sortOrder])


  // Sin resultados
  if (hotels.length === 0) {
    return (
      <EmptyState
        title="No results found"
        message="Try adjusting your filters or dates."
      />
    )
  }

  // Función para manejar el cambio de ordenación
  const handleSortChange = () => {
    if (sortOrder === 'default') {
      setSortOrder('price-low');
    } else if (sortOrder === 'price-low') {
      setSortOrder('price-high');
    } else {
      setSortOrder('default');
    }
  };

  // Función para obtener el texto del botón
  const getSortButtonText = () => {
    switch (sortOrder) {
      case 'price-low':
        return 'Sort by: Price (Low to High)';
      case 'price-high':
        return 'Sort by: Price (High to Low)';
      default:
        return 'Sort by: Default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Botón de ordenación */}
      {hotels.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {hotels.length} {hotels.length === 1 ? 'hotel found' : 'hotels found'}
          </div>
          <button
            onClick={handleSortChange}
            className="flex items-center gap-2 px-4 py-2 bg-primary-lightest border border-primary rounded-xs text-sm font-medium text-primary hover:bg-primary-dark hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {getSortButtonText()}
          </button>
        </div>
      )}
      
      {/* Hoteles disponibles primero */}
      {availableHotels.map((hotel, index) => (
        <React.Fragment key={hotel.hotel_id}>
          <HotelAvailabilityCard
            hotelData={hotel}
            rooms={validRooms}
          />
          {/* Mostrar MembershipCard en la segunda posición si tiene rol "basic" */}
          {shouldShowMembershipCard && index === 0 && (
            <div className="my-8">
              <MembershipCard />
            </div>
          )}
          <div className='w-[80%] h-[1px] bg-neutral-300 mx-auto'></div>
        </React.Fragment>
      ))}
      
      {/* Separador si hay hoteles no disponibles */}
      {availableHotels.length > 0 && unavailableHotels.length > 0 && (
        <div className="py-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 bg-gray-50">
              Hotels not available for the selected dates
            </div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
        </div>
      )}
      
      {/* Hoteles no disponibles al final */}
      {unavailableHotels.map((hotel) => (
        <HotelAvailabilityCard
          key={hotel.hotel_id}
          hotelData={hotel}
          rooms={validRooms}
        />
      ))}
      
      {/* Resumen de resultados */}
      {hotels.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500 border-t">
          {availableHotels.length > 0 && (
            <p>
              {availableHotels.length} {availableHotels.length === 1 ? 'hotel available' : 'hotels available'}
              {unavailableHotels.length > 0 && (
                <span> • {unavailableHotels.length} no {unavailableHotels.length === 1 ? 'available' : 'available'}</span>
              )}
            </p>
          )}
          {availableHotels.length === 0 && unavailableHotels.length > 0 && (
            <p>
              {unavailableHotels.length} {unavailableHotels.length === 1 ? 'hotel found' : 'hotels found'}, 
              but none available for the selected dates
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(HotelAvailabilityList)
