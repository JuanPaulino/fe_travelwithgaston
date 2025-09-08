import { atom } from 'nanostores';
import { useState, useEffect } from 'react';
import { hotelsApi } from '../lib/http.js';
import { config } from '../config/config.js';
import { filtersStore } from './useFiltersStore.js';
import { persistentMap } from '@nanostores/persistent'

// Estado inicial de la búsqueda
const initialSearchData = {
  searchText: '',
  selectedDestinationId: null,
  selectedDestinationText: '',
  selectedDestinationType: null,
  selectedDestinationLocation: '',
  checkInDate: new Date().toISOString().split('T')[0],
  checkOutDate: (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  })(),
  rooms: 1,
  adults: 2,
  children: 0,
  childrenAges: [],
  totalGuests: 2
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
      // Agregar niños: agregar edades por defecto (8 años)
      const newAges = Array(children).fill(8);
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

  // Obtener datos de búsqueda actuales
  getSearchData: () => {
    return searchStore.get();
  },

  // Verificar si la búsqueda es válida
  isSearchValid: () => {
    const data = searchStore.get();
    console.log('🔍 isSearchValid - Verificando datos:', {
      hasSearchText: !!data.searchText,
      hasSelectedDestinationId: !!data.selectedDestinationId,
      hasCheckInDate: !!data.checkInDate,
      hasCheckOutDate: !!data.checkOutDate,
      selectedDestinationId: data.selectedDestinationId
    });
    
    // Solo necesitamos destino seleccionado y fechas válidas
    // El searchText puede variar pero no es crítico para la búsqueda
    return data.selectedDestinationId && data.checkInDate && data.checkOutDate;
  },

  // Ejecutar búsqueda (aquí puedes agregar la lógica de API)
  executeSearch: async () => {
    const searchData = searchStore.get();
    
    console.log('🔍 executeSearch - Iniciando búsqueda con datos:', searchData)
    
    if (!searchActions.isSearchValid()) {
      console.warn('❌ executeSearch - Búsqueda no válida:', searchData);
      return null;
    }

    console.log('✅ executeSearch - Búsqueda válida, procediendo...')

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
        throw new Error('No se pudo obtener el ID de ubicación del destino seleccionado');
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
        currency: config.search.defaultCurrency,
        language: config.search.defaultLanguage
      };

      // Si hay niños, agregar sus edades
      if (searchData.children > 0) {
        searchParams.rooms[0].children_ages = searchData.childrenAges;
      }

      // Agregar filtros activos con sufijo _ids
      Object.entries(activeFilters).forEach(([filterKey, filterValues]) => {
        if (filterValues && filterValues.length > 0) {
          const paramKey = `${filterKey}_ids`;
          searchParams[paramKey] = filterValues;
        }
      });

      console.log('🏨 executeSearch - Parámetros de búsqueda:', searchParams)
      // Llamar a la API de disponibilidad
      const results = await hotelsApi.getAvailability(searchParams);
      console.log('🏨 executeSearch - Resultados recibidos:', results?.length || 0, 'hoteles')
      
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
        search_type: selectedDestination.type,
      });

      return {results, search_type: selectedDestination.type};
    } catch (error) {
      
      // Actualizar estado de error
      resultsStore.set({
        ...resultsStore.get(),
        loading: false,
        error: error.message || 'Error al buscar hoteles. Intenta nuevamente.'
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
