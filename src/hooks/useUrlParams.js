import { useEffect, useState } from 'react';

// Función para parsear parámetros de búsqueda desde la URL
const parseSearchParams = (searchParams) => {
  const params = new URLSearchParams(searchParams);
  
  return {
    destination: params.get('destination') || '',
    destinationId: params.get('destinationId') || '',
    destinationType: params.get('destinationType') || '',
    destinationLocation: params.get('destinationLocation') || '',
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    adults: parseInt(params.get('adults')) || 2,
    children: parseInt(params.get('children')) || 0,
    rooms: parseInt(params.get('rooms')) || 1,
    childrenAges: params.get('childrenAges') ? 
      params.get('childrenAges').split(',').map(age => parseInt(age)) : []
  };
};

// Hook para obtener y manejar parámetros de búsqueda desde la URL
export const useUrlParams = () => {
  const [urlParams, setUrlParams] = useState({});

  useEffect(() => {
    // Función para actualizar parámetros cuando cambie la URL
    const updateParams = () => {
      const params = parseSearchParams(window.location.search);
      setUrlParams(params);
    };

    // Actualizar parámetros al montar el componente
    updateParams();

    // Escuchar cambios en la navegación (para SPA)
    const handlePopState = () => {
      updateParams();
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Función para construir URL con parámetros de búsqueda
  const buildSearchUrl = (searchData) => {
    const params = new URLSearchParams();
    
    if (searchData.selectedDestinationText) {
      params.set('destination', searchData.selectedDestinationText);
    }
    
    if (searchData.selectedDestinationId) {
      params.set('destinationId', searchData.selectedDestinationId);
    }
    
    if (searchData.selectedDestinationType) {
      params.set('destinationType', searchData.selectedDestinationType);
    }
    
    if (searchData.selectedDestinationLocation) {
      params.set('destinationLocation', searchData.selectedDestinationLocation);
    }
    
    if (searchData.checkInDate) {
      params.set('checkIn', searchData.checkInDate);
    }
    
    if (searchData.checkOutDate) {
      params.set('checkOut', searchData.checkOutDate);
    }
    
    if (searchData.adults !== 2) {
      params.set('adults', searchData.adults.toString());
    }
    
    if (searchData.children !== 0) {
      params.set('children', searchData.children.toString());
    }
    
    if (searchData.rooms !== 1) {
      params.set('rooms', searchData.rooms.toString());
    }
    
    if (searchData.childrenAges.length > 0) {
      params.set('childrenAges', searchData.childrenAges.join(','));
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  // Función para actualizar la URL sin recargar la página
  const updateUrl = (searchData) => {
    const newUrl = window.location.pathname + buildSearchUrl(searchData);
    window.history.pushState({}, '', newUrl);
  };

  return {
    urlParams,
    buildSearchUrl,
    updateUrl
  };
};
