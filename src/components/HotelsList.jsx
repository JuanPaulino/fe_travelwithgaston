import React, { useMemo, useEffect, useState } from 'react'
import { getUser, isAuthenticated as checkIsAuthenticated } from '../stores/authStore'
import HotelCard from './HotelCard.jsx'
import EmptyState from './common/EmptyState.jsx'
import MembershipCard from './MembershipCard.jsx'

const HotelsList = ({
  hotels = [], 
}) => {
  const [authStatus, setAuthStatus] = useState(false);

  // Verificar estado de autenticación y rol
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = getUser();
      const currentAuthStatus = checkIsAuthenticated();
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

  // Verificar si el usuario no está autenticado para mostrar MembershipCard
  const shouldShowMembershipCard = !authStatus

  // Memoize the hotels list for performance optimization
  const memoizedHotels = useMemo(() => {
    return hotels
  }, [hotels])

  // No results
  if (hotels.length === 0) {
    return (
      <EmptyState
        title="No hotels found"
        message="Try adjusting your search criteria or filters."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Render all hotels */}
      {memoizedHotels.map((hotel, index) => (
        <React.Fragment key={hotel.id}>
          <HotelCard
            hotelData={hotel}
          />
          
          {/* Show MembershipCard after the first hotel */}
          {shouldShowMembershipCard && index === 0 && (
            <div className="my-8">
              <MembershipCard />
            </div>
          )}
          
          {/* Add separator between hotels except for the last one */}
          {index < memoizedHotels.length - 1 && (
            <div className='w-[80%] h-[1px] bg-neutral-300 mx-auto'></div>
          )}
        </React.Fragment>
      ))}
      
      {/* Results summary */}
      {hotels.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500 border-t">
          <p>
            {hotels.length} {hotels.length === 1 ? 'hotel found' : 'hotels found'}
          </p>
        </div>
      )}
    </div>
  )
}

export default React.memo(HotelsList)
