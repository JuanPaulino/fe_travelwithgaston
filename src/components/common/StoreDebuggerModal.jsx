import { useState, useEffect } from 'react';
import { useFiltersStore } from '../../stores/useFiltersStore.js';
import { useSearchStore } from '../../stores/useSearchStore.js';
import { useBookingStore } from '../../stores/useBookingStore.js';
import { authStore } from '../../stores/authStore.js';

const StoreDebuggerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedStore, setSelectedStore] = useState('search'); // 'search', 'filters', 'booking', o 'auth'
  
  // Usar todos los stores
  const { filters } = useFiltersStore();
  const { searchData } = useSearchStore();
  const { bookingData } = useBookingStore();
  const authData = authStore.get();

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  // Obtener el store seleccionado
  const getSelectedStoreData = () => {
    switch (selectedStore) {
      case 'search':
        return searchData;
      case 'filters':
        return filters;
      case 'booking':
        return bookingData;
      case 'auth':
        return authData;
      default:
        return searchData;
    }
  };

  // Obtener el nombre del store seleccionado
  const getSelectedStoreName = () => {
    switch (selectedStore) {
      case 'search':
        return 'Search Store';
      case 'filters':
        return 'Filters Store';
      case 'booking':
        return 'Booking Store';
      case 'auth':
        return 'Auth Store';
      default:
        return 'Search Store';
    }
  };
  return null;
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Abrir Debugger de Stores"
        >
          🐛
        </button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              🔍 Expandir
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4" 
      onClick={handleModalOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gray-100 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">🐛 Debugger de Stores</h3>
              
              {/* Selector de Store */}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="search">🔍 Search Store</option>
                <option value="filters">🎯 Filters Store</option>
                <option value="booking">🏨 Booking Store</option>
                <option value="auth">🔐 Auth Store</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Minimizar"
              >
                📱
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              {getSelectedStoreName()}
            </h4>
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleTimeString()}
            </p>
          </div>
          
          {/* JSON Display */}
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[60vh]">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
              {JSON.stringify(getSelectedStoreData(), null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Presiona ESC para cerrar</span>
            <button
              onClick={() => {
                console.log(`${getSelectedStoreName()}:`, getSelectedStoreData());
              }}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Log en consola
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDebuggerModal;
