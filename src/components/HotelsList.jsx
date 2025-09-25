import React, { useMemo } from 'react'
import HotelCard from './HotelCard.jsx'
import EmptyState from './common/EmptyState.jsx'

const HotelsList = ({ 
  hotels = [], 
}) => {
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
