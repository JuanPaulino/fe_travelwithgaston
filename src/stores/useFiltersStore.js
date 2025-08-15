import { atom } from 'nanostores';
import { useState, useEffect } from 'react';

// Estado inicial de los filtros
const initialFilters = {
  activities: [],
  family_facilities: [],
  hotel_facilities: [],
  property_types: [],
  location_types: [],
  trip_types: [],
  wellness: [],
  hotel_group: []
};

// Store principal de filtros
export const filtersStore = atom(initialFilters);

// Acciones para manipular los filtros
export const filtersActions = {
  // Agregar un filtro
  addFilter: (category, filterId) => {
    filtersStore.set({
      ...filtersStore.get(),
      [category]: [...(filtersStore.get()[category] || []), filterId]
    });
  },

  // Remover un filtro
  removeFilter: (category, filterId) => {
    const currentFilters = filtersStore.get();
    filtersStore.set({
      ...currentFilters,
      [category]: currentFilters[category]?.filter(id => id !== filterId) || []
    });
  },

  // Toggle de un filtro (agregar si no existe, remover si existe)
  toggleFilter: (category, filterId) => {
    const currentFilters = filtersStore.get();
    const currentCategory = currentFilters[category] || [];
    
    if (currentCategory.includes(filterId)) {
      filtersActions.removeFilter(category, filterId);
    } else {
      filtersActions.addFilter(category, filterId);
    }
  },

  // Limpiar todos los filtros
  clearAllFilters: () => {
    filtersStore.set(initialFilters);
  },

  // Limpiar filtros de una categoría específica
  clearCategoryFilters: (category) => {
    filtersStore.set({
      ...filtersStore.get(),
      [category]: []
    });
  },

  // Establecer filtros específicos
  setFilters: (newFilters) => {
    console.log('setFilters', newFilters);
    filtersStore.set({
      ...initialFilters,
      ...newFilters
    });
  },

  // Obtener filtros activos (solo categorías con filtros seleccionados)
  getActiveFilters: () => {
    const currentFilters = filtersStore.get();
    return Object.entries(currentFilters).reduce((acc, [category, filters]) => {
      if (filters && filters.length > 0) {
        acc[category] = filters;
      }
      return acc;
    }, {});
  },

  // Verificar si hay filtros activos
  hasActiveFilters: () => {
    const activeFilters = filtersActions.getActiveFilters();
    return Object.keys(activeFilters).length > 0;
  },

  // Obtener el conteo de filtros por categoría
  getFilterCount: (category) => {
    return filtersStore.get()[category]?.length || 0;
  },

  // Obtener el conteo total de filtros activos
  getTotalFilterCount: () => {
    const currentFilters = filtersStore.get();
    return Object.values(currentFilters).reduce((total, filters) => total + (filters?.length || 0), 0);
  }
};

// Hook personalizado para usar el store en componentes React
export const useFiltersStore = () => {
  const [filters, setFilters] = useState(filtersStore.get());

  useEffect(() => {
    const unsubscribe = filtersStore.subscribe(setFilters);
    return unsubscribe;
  }, []);

  return {
    filters,
    ...filtersActions
  };
};

// Exportar el store y las acciones para uso directo
export default filtersStore;
