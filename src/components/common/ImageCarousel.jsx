import React, { useState, useCallback, useEffect } from 'react'

const ImageCarousel = ({ 
  images = [], 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showThumbnails = true,
  className = '',
  onImageClick = null 
}) => {
  // Limitar a máximo 5 imágenes
  const limitedImages = images.slice(0, 5)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Función para ir a la siguiente imagen
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === limitedImages.length - 1 ? 0 : prevIndex + 1
    )
  }, [limitedImages.length])

  // Función para ir a la imagen anterior
  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? limitedImages.length - 1 : prevIndex - 1
    )
  }, [limitedImages.length])

  // Función para ir a una imagen específica
  const goToImage = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play con useEffect
  useEffect(() => {
    if (!isAutoPlaying || limitedImages.length <= 1) return

    const interval = setInterval(nextImage, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isAutoPlaying, autoPlayInterval, nextImage, limitedImages.length])

  // Pausar auto-play al hacer hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay)

  // Si no hay imágenes, mostrar placeholder
  if (!limitedImages || limitedImages.length === 0) {
    return (
      <div>
        <span className="invisible md:block">
          Images coming soon
        </span>
      </div>
    )
  }

  // Si solo hay una imagen, mostrarla sin controles
  if (limitedImages.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={limitedImages[0].thumbnail_url || limitedImages[0].url || limitedImages[0]}
          alt={limitedImages[0].alt || 'Hotel image'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://d13bre0qp8legl.cloudfront.net/hotels/11644/6emR1CkEqarvtZ8jH79PEavjtTMNxyy4iS1rUDNO.jpg'
          }}
        />
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Renderizar todas las imágenes pero mostrar solo la actual */}
      <div className="relative flex items-center justify-center">
        {limitedImages.map((image, index) => (
          <img
            key={`carousel-img-${index}`}
            src={image.thumbnail_url || image.url || image}
            alt={image.alt || `Image ${index + 1} of the hotel`}
            className={`w-full h-full object-cover aspect-auto transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            onClick={() => onImageClick?.(currentIndex)}
            onError={(e) => {
              e.target.src = 'https://d13bre0qp8legl.cloudfront.net/hotels/11644/6emR1CkEqarvtZ8jH79PEavjtTMNxyy4iS1rUDNO.jpg'
            }}
          />
        ))}
      </div>
        {/* Botones de navegación */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de puntos */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {limitedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
  )
}

export default ImageCarousel
