import { useState, useEffect } from 'react';
import http from '../lib/http.js';
import { useFiltersStore } from '../stores/useFiltersStore.js';
import { capitalize, replaceUnderscores } from '../lib/stringUtils.js';

const SearchFilters = () => {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Usar el store de filtros
  const { 
    filters: selectedFilters, 
    toggleFilter, 
    clearAllFilters, 
    getFilterCount 
  } = useFiltersStore();

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/hotels/filters');
      if (response.data.success) {
        setFilters(response.data.data);
        const initialExpanded = {};
        Object.keys(response.data.data).forEach(category => {
          initialExpanded[category] = false;
        });
        setExpandedCategories(initialExpanded);
      } else {
        throw new Error(response.data.message || 'Error al cargar filtros');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar filtros');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category, filterId, checked) => {
    // Usar la acción del store para toggle del filtro
    toggleFilter(category, filterId);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const resetFilters = () => {
    clearAllFilters();
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        Error: {error}
      </div>
    );
  }

  if (!filters) {
    return null;
  }

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filter by</h2>
        <button
          onClick={resetFilters}
          className="text-primary hover:text-primary-darker text-sm font-medium"
        >
          Reset
        </button>
      </div>

      {/* Categorías de filtros */}
      <div className="space-y-6">
        {Object.entries(filters).map(([category, categoryData]) => {
          const selectedCount = getFilterCount(category);
          const isExpanded = expandedCategories[category];
          
          return (
            <div key={category} className="mb-3">
              {/* Header de categoría */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-neutral-DEFAULT font-medium capitalize font-body">
                  {capitalize(replaceUnderscores(category))}
                </h3>
                {selectedCount > 0 && (
                  <div className="bg-primary text-white text-xs rounded-full text-center font-bold w-6 h-6 flex items-center justify-center">
                    {selectedCount}
                  </div>
                )}
              </div>

              {/* Opciones de filtro */}
              <div className="space-y-2">
                {categoryData.slice(0, isExpanded ? undefined : 5).map((filter) => (
                  <label key={filter.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category]?.includes(filter.id) || false}
                      onChange={(e) => handleFilterChange(category, filter.id, e.target.checked)}
                      className="w-4 h-4 text-amber-500 bg-white border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-900 text-sm">
                      {filter.name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Botón expandir/contraer */}
              {categoryData.length > 5 && (
                <button
                  onClick={() => toggleCategory(category)}
                  className="text-primary hover:text-primary-darker text-sm font-medium mt-2 flex items-center"
                >
                  {isExpanded ? 'Show less' : 'Show all'}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchFilters;
