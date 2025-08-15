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
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center p-8">
          <div className="text-4xl mb-2">🏨</div>
          <p>No hay imágenes disponibles</p>
        </div>
      </div>
    )
  }

  // Si solo hay una imagen, mostrarla sin controles
  if (limitedImages.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={limitedImages[0].thumbnail_url || limitedImages[0].url || limitedImages[0]}
          alt={limitedImages[0].alt || 'Imagen del hotel'}
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
      {/* Imagen principal */}
      <div className="relative max-w-[400px] w-full">
        <img
          src={limitedImages[currentIndex].thumbnail_url || limitedImages[currentIndex].url || limitedImages[currentIndex]}
          alt={limitedImages[currentIndex].alt || `Imagen ${currentIndex + 1} del hotel`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }}
          onClick={() => onImageClick?.(currentIndex)}
        />

        {/* Botones de navegación */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Imagen anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Siguiente imagen"
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
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Miniaturas */}
      {/*
      showThumbnails && limitedImages.length > 1 && (
        <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
          {limitedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex 
                  ? 'border-amber-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.thumbnail_url || image.url || image}
                alt={image.alt || `Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                }}
              />
            </button>
          ))}
        </div>
      )
      */}

      {/* Controles de auto-play */}
      {/*limitedImages.length > 1 && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            aria-label={isAutoPlaying ? 'Pausar auto-play' : 'Reanudar auto-play'}
          >
            {isAutoPlaying ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      )*/}
    </div>
  )
}

export default ImageCarousel
