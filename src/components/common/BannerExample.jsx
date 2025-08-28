import React from 'react';
import { showSuccess, showError, showWarning, showInfo } from '../../stores/bannerStore';

const BannerExample = () => {
  const handleShowSuccess = () => {
    showSuccess('¡Operación completada exitosamente!', { autoHide: true });
  };

  const handleShowError = () => {
    showError('Ha ocurrido un error. Por favor, inténtalo de nuevo.', { autoHide: true });
  };

  const handleShowWarning = () => {
    showWarning('Advertencia: Este campo es opcional.', { autoHide: true });
  };

  const handleShowInfo = () => {
    showInfo('Información: Los cambios se guardarán automáticamente.', { autoHide: true });
  };

  const handleShowPersistent = () => {
    showInfo('Este mensaje no se ocultará automáticamente. Haz clic en X para cerrarlo.');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Ejemplos de Banners</h3>
      <div className="space-y-3">
        <button
          onClick={handleShowSuccess}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Mostrar Éxito
        </button>
        
        <button
          onClick={handleShowError}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Mostrar Error
        </button>
        
        <button
          onClick={handleShowWarning}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Mostrar Advertencia
        </button>
        
        <button
          onClick={handleShowInfo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Mostrar Info
        </button>
        
        <button
          onClick={handleShowPersistent}
          className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Mostrar Info Persistente
        </button>
      </div>
    </div>
  );
};

export default BannerExample;
