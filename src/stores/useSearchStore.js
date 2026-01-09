import { atom } from 'nanostores';
import { useState, useEffect } from 'react';
import { hotelsApi } from '../lib/http.js';
import { config } from '../config/config.js';
import { filtersStore } from './useFiltersStore.js';
import { persistentMap } from '@nanostores/persistent'
import { isAuthenticated } from './authStore.js';

// Función para obtener fechas por defecto de manera consistente
const getDefaultDates = () => {
  // Usar una fecha fija para evitar diferencias entre servidor y cliente
  const baseDate = new Date('2024-01-01T00:00:00Z');
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(baseDate);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return {
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfterTomorrow.toISOString().split('T')[0]
  };
};

// Estado inicial de la búsqueda
const initialSearchData = {
  searchText: '',
  selectedDestinationId: null,
  selectedDestinationText: '',
  selectedDestinationType: null,
  selectedDestinationLocation: '',
  checkInDate: '',
  checkOutDate: '',
  rooms: 1,
  adults: 2,
  children: 0,
  childrenAges: [],
  totalGuests: 2,
  selectedCurrency: 'USD' // Moneda por defecto
};

// Estado inicial de los resultados
const initialResultsData = {
  hotels: [],
  loading: false,
  error: null,
  lastSearch: null
};

// Store principal de búsqueda - usar atom regular para compatibilidad
export const searchStore = persistentMap('searchStore', initialSearchData)

// Store de resultados de búsqueda
export const resultsStore = atom(initialResultsData);

// Acciones para manipular la búsqueda
export const searchActions = {
  // Actualizar texto de búsqueda
  setSearchText: (searchText) => {
    searchStore.set({
      ...searchStore.get(),
      searchText
    });
  },

  // Actualizar destino seleccionado
  setSelectedDestination: (destination) => {
    searchStore.set({
      ...searchStore.get(),
      selectedDestinationId: destination?.id || null,
      selectedDestinationText: destination?.text || '',
      selectedDestinationType: destination?.type || null,
      selectedDestinationLocation: destination?.location || ''
    });
  },

  // Actualizar fecha de check-in
  setCheckInDate: (date) => {
    searchStore.set({
      ...searchStore.get(),
      checkInDate: date
    });
  },

  // Actualizar fecha de check-out
  setCheckOutDate: (date) => {
    searchStore.set({
      ...searchStore.get(),
      checkOutDate: date
    });
  },

  // Actualizar número de habitaciones
  setRooms: (rooms) => {
    searchStore.set({
      ...searchStore.get(),
      rooms
    });
  },

  // Actualizar número de adultos
  setAdults: (adults) => {
    searchStore.set({
      ...searchStore.get(),
      adults,
      totalGuests: adults + searchStore.get().children
    });
  },

  // Actualizar número de niños
  setChildren: (children) => {
    const currentData = searchStore.get();
    let newRooms = currentData.rooms;
    let newChildrenAges = currentData.childrenAges;
    
    // Si se agregan niños y hay más de 1 habitación, forzar a 1 habitación
    if (children > 0 && newRooms > 1) {
      newRooms = 1;
    }
    
    // Ajustar el array de edades según el número de niños
    if (children > currentData.children) {
      // Agregar niños: mantener edades existentes y agregar 0 para nuevos niños
      const existingAges = currentData.childrenAges || [];
      const newAges = Array(children).fill(0).map((_, index) => {
        return existingAges[index] !== undefined ? existingAges[index] : 0;
      });
      newChildrenAges = newAges;
    } else if (children < currentData.children) {
      // Remover niños: mantener solo las edades necesarias
      newChildrenAges = currentData.childrenAges.slice(0, children);
    }
    
    searchStore.set({
      ...currentData,
      children,
      rooms: newRooms,
      childrenAges: newChildrenAges,
      totalGuests: currentData.adults + children
    });
  },

  // Actualizar edades de los niños
  setChildrenAges: (ages) => {
    searchStore.set({
      ...searchStore.get(),
      childrenAges: ages
    });
  },

  // Actualizar moneda seleccionada
  setSelectedCurrency: (currency) => {
    searchStore.set({
      ...searchStore.get(),
      selectedCurrency: currency
    });
  },

  // Actualizar todos los datos de búsqueda
  setSearchData: (searchData) => {
    searchStore.set({
      ...searchStore.get(),
      ...searchData,
      totalGuests: (searchData.adults || searchStore.get().adults) + (searchData.children || searchStore.get().children)
    });
  },

  // Limpiar todos los datos de búsqueda
  clearSearch: () => {
    searchStore.set(initialSearchData);
  },

  // Inicializar fechas por defecto si no están configuradas
  initializeDefaultDates: () => {
    const currentData = searchStore.get();
    if (!currentData.checkInDate || !currentData.checkOutDate) {
      const defaultDates = getDefaultDates();
      searchStore.set({
        ...currentData,
        checkInDate: defaultDates.checkIn,
        checkOutDate: defaultDates.checkOut
      });
    }
  },

  // Obtener datos de búsqueda actuales
  getSearchData: () => {
    return searchStore.get();
  },

  // Verificar si la búsqueda es válida
  isSearchValid: () => {
    const data = searchStore.get();
    
    // Solo necesitamos destino seleccionado y fechas válidas
    // El searchText puede variar pero no es crítico para la búsqueda
    return data.selectedDestinationId && data.checkInDate && data.checkOutDate;
  },

  // Ejecutar búsqueda (aquí puedes agregar la lógica de API)
  executeSearch: async () => {
    const searchData = searchStore.get();
    
    if (!searchActions.isSearchValid()) {
      return null;
    }

    // Actualizar estado de carga
    resultsStore.set({
      ...resultsStore.get(),
      loading: true,
      error: null
    });

    try {
      // Usar directamente el destino ya seleccionado por el usuario
      const selectedDestination = {
        id: searchData.selectedDestinationId,
        text: searchData.selectedDestinationText,
        type: searchData.selectedDestinationType,
        location: searchData.selectedDestinationLocation
      };
      
      const destinationId = selectedDestination.id;
      let destinationKey;

      switch (selectedDestination.type) {
        case 'location':
          destinationKey = 'location_id';
          break;
        case 'inspiration':
          destinationKey = 'inspiration_id';
          break;
        case 'hotel':
          destinationKey = 'hotel_id';
          break;
        default:
          destinationKey = 'unknown';
      }

      if (!destinationId) {
        throw new Error('Could not get the location ID of the selected destination');
      }

      // Obtener filtros activos del store de filtros
      const activeFilters = filtersStore.get();
      
      // Transformar datos al formato que espera el endpoint
      const searchParams = {
        [destinationKey]: destinationId,
        start_date: searchData.checkInDate,
        end_date: searchData.checkOutDate,
        rooms: [
          {
            adults: searchData.adults,
            ...(searchData.children > 0 && {
              children: searchData.childrenAges.map(age => ({ age }))
            })
          }
        ],
        currency: searchData.selectedCurrency || config.search.defaultCurrency,
        language: config.search.defaultLanguage
      };

      // Agregar filtros activos con sufijo _ids
      Object.entries(activeFilters).forEach(([filterKey, filterValues]) => {
        if (filterValues && filterValues.length > 0) {
          const paramKey = `${filterKey}_ids`;
          searchParams[paramKey] = filterValues;
        }
      });

      // Check authentication status
      const userIsAuthenticated = isAuthenticated();
      
      let results;
      
      if (userIsAuthenticated) {
        // User is authenticated - call availability endpoint
        results = await hotelsApi.getAvailability(searchParams);
      } else {
        // User is not authenticated - call hotels endpoint
        // Transform searchParams to match hotels endpoint format
        const hotelsParams = {
          page: 1,
          per_page: 50, // Default limit for non-authenticated users
          ...(searchParams.location_id && { location_id: searchParams.location_id }),
          ...(searchParams.inspiration_id && { inspiration_id: searchParams.inspiration_id }),
          ...(searchParams.hotel_group_ids && { hotel_group_ids: searchParams.hotel_group_ids }),
          ...(searchParams.activities_ids && { activities_ids: searchParams.activities_ids }),
          ...(searchParams.family_facilities_ids && { family_facilities_ids: searchParams.family_facilities_ids }),
          ...(searchParams.hotel_facilities_ids && { hotel_facilities_ids: searchParams.hotel_facilities_ids }),
          ...(searchParams.property_types_ids && { property_types_ids: searchParams.property_types_ids }),
          ...(searchParams.location_types_ids && { location_types_ids: searchParams.location_types_ids }),
          ...(searchParams.trip_types_ids && { trip_types_ids: searchParams.trip_types_ids }),
          ...(searchParams.wellness_ids && { wellness_ids: searchParams.wellness_ids })
        };
        
        const hotelsResponse = await hotelsApi.getHotels(hotelsParams);
        // Transform hotels response to match availability format
        results = hotelsResponse.content || [];
      }
      
      // Actualizar resultados
      resultsStore.set({
        hotels: results,
        loading: false,
        error: null,
        lastSearch: {
          ...searchParams,
          rooms: searchData.rooms, // Usar el número de habitaciones del store, no el array de la API
          adults: searchData.adults,
          children: searchData.children,
          totalGuests: searchData.totalGuests
        },
        search_type: userIsAuthenticated ? selectedDestination.type : 'hotels_list',
      });

      return {results, search_type: userIsAuthenticated ? selectedDestination.type : 'hotels_list'};
    } catch (error) {
      
      // Actualizar estado de error
      resultsStore.set({
        ...resultsStore.get(),
        loading: false,
        error: error.message || 'Error searching for hotels. Try again.'
      });

      return null;
    }
  },

  executeSearchHotelAvailability: async () => {
    const searchData = searchStore.get();

    // Construir el objeto selectedDestination
    const selectedDestination = {
      id: searchData.selectedDestinationId,
      text: searchData.selectedDestinationText,
      type: searchData.selectedDestinationType,
      location: searchData.selectedDestinationLocation
    };

    // Validar que el tipo de destino sea 'hotel'
    if (selectedDestination.type !== 'hotel') {
      // Si no es hotel, actualizar estado y retornar null
      resultsStore.set({
        ...resultsStore.get(),
        loading: false,
        error: 'This function is only available for hotel searches'
      });
      return null;
    }

    // Actualizar estado de carga
    resultsStore.set({
      ...resultsStore.get(),
      loading: true,
      error: null
    });

    try {
      const destinationId = selectedDestination.id;

      if (!destinationId) {
        throw new Error('Could not get the hotel ID of the selected destination');
      }

      // Obtener filtros activos del store de filtros
      const activeFilters = filtersStore.get();
      
      // Transformar datos al formato que espera el endpoint
      const childrenAges = Array.isArray(searchData.childrenAges) 
        ? searchData.childrenAges.map(age => ({ age: parseInt(age) }))
        : searchData.childrenAges.split(',').map(age => ({ age: parseInt(age) }));
      const searchParams = {
        hotel_id: destinationId,
        start_date: searchData.checkInDate,
        end_date: searchData.checkOutDate,
        rooms: [
          {
            adults: Number(searchData.adults),
            ...(Number(searchData.children) > 0 && {
              children: childrenAges
            })
          }
        ],
        currency: searchData.selectedCurrency || config.search.defaultCurrency,
        language: config.search.defaultLanguage
      };

      // Agregar filtros activos con sufijo _ids
      Object.entries(activeFilters).forEach(([filterKey, filterValues]) => {
        if (filterValues && filterValues.length > 0) {
          const paramKey = `${filterKey}_ids`;
          searchParams[paramKey] = filterValues;
        }
      });

      const response = await hotelsApi.getAvailability(searchParams);

      resultsStore.set({
        ...resultsStore.get(),
        loading: false
      });

      return {results: response, search_type: 'hotel'};
    } catch (error) {
      resultsStore.set({
        ...resultsStore.get(),
        loading: false,
        error: error.message || 'Error getting hotel availability. Try again.'
      });

      return null;
    }
  }
};

// Hook personalizado para usar el store en componentes React
export const useSearchStore = () => {
  const [searchData, setSearchData] = useState(searchStore.get());
  const [resultsData, setResultsData] = useState(resultsStore.get());

  useEffect(() => {    
    // Inicializar fechas por defecto si es necesario
    searchActions.initializeDefaultDates();
    
    const unsubscribeSearch = searchStore.subscribe((newSearchData) => {
      setSearchData(newSearchData)
    });
    
    const unsubscribeResults = resultsStore.subscribe((newResultsData) => {
      setResultsData(newResultsData)
    });
    
    return () => {
      unsubscribeSearch();
      unsubscribeResults();
    };
  }, []);

  return {
    searchData,
    resultsData,
    ...searchActions
  };
};

// Exportar el store y las acciones para uso directo
export default searchStore;
