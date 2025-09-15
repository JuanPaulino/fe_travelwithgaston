import React, { useState, useCallback, useEffect, useRef } from 'react'

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
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [isVisible, setIsVisible] = useState(false)
  const carouselRef = useRef(null)

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

  // Intersection Observer para detectar cuando el carrusel es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (carouselRef.current) {
      observer.observe(carouselRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-play con useEffect
  useEffect(() => {
    if (!isAutoPlaying || limitedImages.length <= 1 || !isVisible) return

    const interval = setInterval(nextImage, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isAutoPlaying, autoPlayInterval, nextImage, limitedImages.length, isVisible])

  // Función para cargar imagen
  const loadImage = useCallback((index) => {
    if (loadedImages.has(index) || !limitedImages[index]) return
    
    const img = new Image()
    const imageUrl = limitedImages[index].thumbnail_url || limitedImages[index].url || limitedImages[index]
    
    img.onload = () => {
      setLoadedImages(prev => new Set([...prev, index]))
    }
    img.onerror = () => {
      console.warn(`Error cargando imagen ${index}:`, imageUrl)
    }
    img.src = imageUrl
  }, [limitedImages, loadedImages])

  // Precargar las primeras 2 imágenes cuando el carrusel se vuelve visible por primera vez
  useEffect(() => {
    if (isVisible && limitedImages.length > 0) {
      // Precargar las primeras 2 imágenes
      loadImage(0)
      if (limitedImages.length > 1) {
        loadImage(1)
      }
    }
  }, [isVisible, loadImage, limitedImages.length])

  // Cargar imagen actual y precargar las siguientes 2 cuando cambia el índice
  useEffect(() => {
    if (isVisible && limitedImages.length > 0) {
      // Cargar imagen actual
      loadImage(currentIndex)
      
      // Precargar las siguientes 2 imágenes
      const nextIndex1 = (currentIndex + 1) % limitedImages.length
      const nextIndex2 = (currentIndex + 2) % limitedImages.length
      
      loadImage(nextIndex1)
      loadImage(nextIndex2)
    }
  }, [currentIndex, loadImage, limitedImages.length, isVisible])

  // Pausar auto-play al hacer hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay)

  // Si no hay imágenes, mostrar placeholder
  if (!limitedImages || limitedImages.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-center p-8">
          <p>Images coming soon</p>
        </div>
      </div>
    )
  }

  // Si solo hay una imagen, mostrarla sin controles
  if (limitedImages.length === 1) {
    return (
      <div ref={carouselRef} className={`relative overflow-hidden ${className}`}>
        {isVisible && loadedImages.has(0) ? (
          <img
            src={limitedImages[0].thumbnail_url || limitedImages[0].url || limitedImages[0]}
            alt={limitedImages[0].alt || 'Hotel image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://d13bre0qp8legl.cloudfront.net/hotels/11644/6emR1CkEqarvtZ8jH79PEavjtTMNxyy4iS1rUDNO.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-500 text-center p-8">
              <p>Loading image...</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      ref={carouselRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Imagen principal */}
      <div className="relative flex items-center justify-center">
        {isVisible && loadedImages.has(currentIndex) ? (
          <img
            src={limitedImages[currentIndex].thumbnail_url || limitedImages[currentIndex].url || limitedImages[currentIndex]}
            alt={limitedImages[currentIndex].alt || `Image ${currentIndex + 1} of the hotel`}
            className="w-full h-full transition-opacity duration-300 object-cover aspect-[3/2]"
            onClick={() => onImageClick?.(currentIndex)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-[3/2]">
            <div className="text-gray-500 text-center p-8">
              <p>Loading image...</p>
            </div>
          </div>
        )}
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
