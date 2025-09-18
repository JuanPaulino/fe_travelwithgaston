import { useState, useEffect } from 'react';
import SearchFilters from './SearchFilters.jsx';

const MobileFiltersModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Pequeño delay para permitir que el DOM se renderice antes de la animación
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      // Esperar a que termine la animación antes de ocultar completamente
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 250);
      // Restaurar scroll del body cuando el modal se cierra
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timeout);
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-250 ease-out ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
        <div className={`bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden transform transition-transform duration-250 ease-out will-change-transform ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {/* Header del modal */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
          
          {/* Contenido del modal */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
            <SearchFilters />
          </div>
          
          {/* Footer del modal */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <button
              onClick={handleClose}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-darker transition-colors"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFiltersModal;
