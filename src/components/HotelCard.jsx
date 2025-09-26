import React, { useRef, useEffect, useState } from 'react'
import ImageCarousel from './common/ImageCarousel.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'

function HotelCard({ hotelData }) {
  const { setSelectedDestination } = useSearchStore()
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  // Intersection Observer to detect when the card is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Extract data from hotel object
  const hotel = {
    id: hotelData.id,
    name: hotelData.name,
    address: hotelData.address,
    location: hotelData.location,
    description: hotelData.description,
    images: hotelData.images || [],
    benefits: hotelData.benefits || [],
    benefits_footnotes: hotelData.benefits_footnotes || [],
    amenities: hotelData.amenities || [],
    hotel_groups: hotelData.hotel_groups || [],
    unique_experiences: hotelData.unique_experiences,
    sustainability_initiative: hotelData.sustainability_initiative,
    short_info: hotelData.short_info || {}
  }

  // Function to navigate to hotel
  const handleViewHotel = () => {
    setSelectedDestination({
      type: 'hotel',
      id: hotel.id,
      text: hotel.name,
      location: hotel.location,
    })
    window.location.href = `/hotels/${hotel.id}`
  }

  // Function to handle image click
  const handleImageClick = (imageIndex) => {
    console.log('🖼️ Image clicked:', imageIndex, hotel.images[imageIndex])
    // Here you could open a modal with the full-size image
  }

  return (
    <div ref={cardRef} className="overflow-hidden min-w-80 relative">
      {/* Row with 3 columns */}
      <div className='flex flex-col md:flex-row flex-grow gap-4'>
        {/* Image carousel - 4 of 12 */}
        <div className='w-full md:w-4/12'>
          {isVisible ? (
            <ImageCarousel
              images={hotel.images}
              autoPlay={false}
              autoPlayInterval={0}
              showThumbnails={false}
              onImageClick={handleImageClick}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-[3/2]">
              <div className="text-gray-500 text-center p-8">
                <p>Loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Hotel information - 8 of 12 */}
        <div className='w-full md:w-5/12'>
          <div className='flex flex-col'>
            <h5 className='font-heading text-xl mb-2'>
              {hotel.name}
            </h5>
            {hotel.address && (
              <p className='text-gray-500 text-sm mb-2'>
                {hotel.address}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <p className='text-gray-700 text-sm mb-2 line-clamp-3'>
              {hotel.description}
            </p>
          </div>

          {/* Benefits */}
          {hotel.benefits && hotel.benefits.length > 0 && (
            <div className="space-y-1 mb-2">
              <h6 className="text-sm font-medium text-gray-900 mb-2">Benefits</h6>
              {hotel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-neutral-darker">
                  <span className="text-neutral-dark">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          )}

          {/* Benefits footnotes */}
          {hotel.benefits_footnotes && hotel.benefits_footnotes.length > 0 && (
            <div className="text-xs">
              {hotel.benefits_footnotes.map((footnote, index) => (
                <span key={index} className='text-neutral-dark'>
                  {footnote}
                </span>
              ))}
            </div>
          )}
          {/* Amenities */}
          {/*
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          */}
        </div>

        {/* Action section - 3 of 12 */}
        <div className='w-full md:w-3/12 flex flex-col justify-end'>
          {/* Check-in/out times */}
          {/*(hotel.short_info.check_in_time || hotel.short_info.check_out_time) && (
            <div className="mb-2 text-sm text-gray-600">
              {hotel.short_info.check_in_time && (
                <p>Check-in: {hotel.short_info.check_in_time}</p>
              )}
              {hotel.short_info.check_out_time && (
                <p>Check-out: {hotel.short_info.check_out_time}</p>
              )}
            </div>
          )*/}

          {/* Hotel status badges */}
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            {/*hotel.short_info.guest_rooms_count && (
              <span className="text-primary-dark font-medium border border-primary-dark px-2 py-1">
                {hotel.short_info.guest_rooms_count} rooms
              </span>
            )*/}
            {hotel.short_info.opened && (
              <span className="text-primary-dark font-medium border border-primary-dark px-2 py-1">
                Opened {hotel.short_info.opened}
              </span>
            )}
          </div>

          {/* Action button */}
          <div className="mt-4 align-self-end">
            <button 
              onClick={handleViewHotel}
              className="bg-primary text-white px-6 py-2 font-medium transition-colors pointer w-full"
            >
              View hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelCard
