import { atom } from 'nanostores';
import { useState, useEffect } from 'react';

// Estado inicial de la búsqueda
const initialSearchData = {
  searchText: '',
  selectedDestination: null,
  checkInDate: new Date().toISOString().split('T')[0],
  checkOutDate: (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  })(),
  rooms: 1,
  adults: 2,
  children: 0,
  totalGuests: 2
};

// Store principal de búsqueda
export const searchStore = atom(initialSearchData);

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
      selectedDestination: destination
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
    
    // Si se agregan niños y hay más de 1 habitación, forzar a 1 habitación
    if (children > 0 && newRooms > 1) {
      newRooms = 1;
    }
    
    searchStore.set({
      ...currentData,
      children,
      rooms: newRooms,
      totalGuests: currentData.adults + children
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
    return data.searchText && data.selectedDestination && data.checkInDate && data.checkOutDate;
  },

  // Ejecutar búsqueda (aquí puedes agregar la lógica de API)
  executeSearch: async () => {
    const searchData = searchStore.get();
    
    if (!searchActions.isSearchValid()) {
      console.warn('Búsqueda no válida:', searchData);
      return null;
    }

    console.log('Ejecutando búsqueda con:', searchData);
    
    // Aquí puedes agregar la llamada a la API
    // const results = await searchAPI.search(searchData);
    
    return searchData;
  }
};

// Hook personalizado para usar el store en componentes React
export const useSearchStore = () => {
  const [searchData, setSearchData] = useState(searchStore.get());

  useEffect(() => {
    const unsubscribe = searchStore.subscribe(setSearchData);
    return unsubscribe;
  }, []);

  return {
    searchData,
    ...searchActions
  };
};

// Exportar el store y las acciones para uso directo
export default searchStore;
