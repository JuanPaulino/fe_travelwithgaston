import { useState, useEffect, useRef } from 'react'
import SearchAutocomplete from './SearchAutocomplete.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useUrlParams } from '../hooks/useUrlParams.js'
import { useDebounce } from '../hooks/useDebounce.js'

function SimpleSearchForm({ 
  initialData = {}, 
  disabled = false, 
  className = "", 
  isMain = false,
  placeholder = "Where are you going?"
}) {
  // Solo usar store para guardar búsquedas confirmadas y ejecutarlas
  const { 
    setSearchData,  // Solo para guardar al hacer submit
    executeSearch   // Solo para ejecutar búsqueda confirmada
  } = useSearchStore()

  // Hook para parámetros de URL
  const { urlParams, updateUrl, buildSearchUrl } = useUrlParams()

  // Estado local para el formulario (draft)
  const [formData, setFormData] = useState({
    searchText: '',
    selectedDestinationId: null,
    selectedDestinationText: '',
    selectedDestinationType: null,
    selectedDestinationLocation: '',
  })

  // Estados locales para control de UI
  const [isFormActive, setIsFormActive] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // Función para verificar si estamos en la página de búsqueda
  const isOnSearchPage = () => {
    return typeof window !== 'undefined' && window.location.pathname === '/search';
  };

  // Función para verificar si se pueden ejecutar búsquedas automáticas
  const canExecuteAutoSearch = (sourceData) => {
    return sourceData.destinationId;
  };

  // Hook de debounce para auto search
  const { debouncedCallback: debouncedAutoSearch } = useDebounce(
    async () => {
      // Guardar en store antes de ejecutar búsqueda
      setSearchData(formData);
      await executeSearch();
    },
    500,
    {
      condition: () => isOnSearchPage()
    }
  );

  // Autocompletar solo desde URL params
  useEffect(() => {
    // Solo autocompletar si hay URL params válidos
    if (Object.keys(urlParams).length > 0 && urlParams.destinationId) {
      setFormData({
        searchText: urlParams.destination || '',
        selectedDestinationId: urlParams.destinationId || null,
        selectedDestinationText: urlParams.destination || '',
        selectedDestinationType: urlParams.destinationType || 'hotel',
        selectedDestinationLocation: urlParams.destinationLocation || '',
      })
      
      if (canExecuteAutoSearch(urlParams)) {
        debouncedAutoSearch();
      }
    }
  }, [urlParams])

  // Función para verificar si estamos en la página home
  const isOnHomePage = () => {
    if (isMain) return true;
    return false;
  }

  // Función para verificar si estamos en la página de hotel
  const isOnHotelPage = () => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/hotels/');
  };

  // Manejar selección de destino desde el autocompletado
  const handleDestinationSelection = async (suggestion) => {
    // Actualizar estado local
    setFormData(prev => ({
      ...prev,
      selectedDestinationId: suggestion.id,
      selectedDestinationText: suggestion.text,
      selectedDestinationType: suggestion.type,
      selectedDestinationLocation: suggestion.location,
      searchText: suggestion.text
    }))
    
    const searchData = {
      searchText: suggestion.text,
      selectedDestinationText: suggestion.text,
      selectedDestinationId: suggestion.id,
      selectedDestinationType: suggestion.type,
      selectedDestinationLocation: suggestion.location
    }
    
    // Auto-execute search when destination is selected
    if (suggestion && suggestion.id) {
      setIsSearching(true)
      
      try {
        // GUARDAR EN STORE antes de ejecutar búsqueda
        setSearchData(searchData)
        
        // Update URL parameters
        updateUrl(searchData);
        
        // Redirecciones
        // Si la búsqueda es a hotel y estamos en la página search.astro o home
        if (suggestion.type === 'hotel' && (isOnSearchPage() || isOnHomePage())) {
          window.location.href = `/hotels/${suggestion.id}${buildSearchUrl(searchData)}`;
          return;
        }
        // si la busqueda es a hotel y estamos en la página de hotel actualizar con los parametros de la url
        if (suggestion.type === 'hotel' && isOnHotelPage()) {
          const searchUrl = `/hotels/${suggestion.id}${buildSearchUrl(searchData)}`;
          window.location.href = searchUrl;
          return;
        }
        // Si la búsqueda es a location o inspiration y estamos en la página de hotel
        if ((suggestion.type === 'location' || suggestion.type === 'inspiration') && (isOnHotelPage() || isOnHomePage())) {
          const searchUrl = `/search${buildSearchUrl(searchData)}`;
          window.location.href = searchUrl;
          return;
        }

        // Execute search
        const response = await executeSearch();
        
        if (response && response.results) {
          console.log('Búsqueda ejecutada exitosamente:', response.results)
        }
      } catch (error) {
        console.error('Error executing search:', error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  // Manejar cambio de texto en el input de búsqueda
  const handleSearchTextChange = (text) => {
    setFormData(prev => ({ ...prev, searchText: text }))
    setIsUserInteracting(true)
    
    if (formData.selectedDestinationId && text !== formData.selectedDestinationText) {
      setFormData(prev => ({
        ...prev,
        selectedDestinationId: null,
        selectedDestinationText: '',
        selectedDestinationType: null,
        selectedDestinationLocation: ''
      }))
    }
  }

  // Manejar cuando el formulario se vuelve activo
  const handleFormFocus = () => {
    if (isOnHomePage()) {
      setIsFormActive(true)
    }
  }

  // Manejar cuando el formulario pierde el foco
  const handleFormBlur = (e) => {
    if (isOnHomePage()) {
      // Solo desactivar si el foco no se movió a otro elemento del formulario
      setTimeout(() => {
        const activeElement = document.activeElement
        const formElement = e.currentTarget
        if (formElement && !formElement.contains(activeElement)) {
          setIsFormActive(false)
        }
      }, 100)
    }
  }

  // Manejar envío manual del formulario (botón Search)
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Solo ejecutar si hay un destino seleccionado
    if (!formData.selectedDestinationId) {
      return
    }
    
    setIsSearching(true)
    
    try {
      // GUARDAR EN STORE
      setSearchData(formData)
      
      // Update URL parameters
      updateUrl(formData);
      
      // Redirecciones
      // Si la búsqueda es a hotel y estamos en la página search.astro o home
      if (formData.selectedDestinationType === 'hotel' && (isOnSearchPage() || isOnHomePage())) {
        window.location.href = `/hotels/${formData.selectedDestinationId}${buildSearchUrl(formData)}`;
        return;
      }
      // si la busqueda es a hotel y estamos en la página de hotel actualizar con los parametros de la url
      if (formData.selectedDestinationType === 'hotel' && isOnHotelPage()) {
        const searchUrl = `/hotels/${formData.selectedDestinationId}${buildSearchUrl(formData)}`;
        window.location.href = searchUrl;
        return;
      }
      // Si la búsqueda es a location o inspiration y estamos en la página de hotel
      if ((formData.selectedDestinationType === 'location' || formData.selectedDestinationType === 'inspiration') && (isOnHotelPage() || isOnHomePage())) {
        const searchUrl = `/search${buildSearchUrl(formData)}`;
        window.location.href = searchUrl;
        return;
      }
      
      // Execute search
      const response = await executeSearch();
      
      if (response && response.results) {
        console.log('Búsqueda ejecutada exitosamente:', response.results)
      }
    } catch (error) {
      console.error('Error executing search:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const opacityClasses = (() => {
    if (!isOnHomePage()) {
      return 'opacity-100';
    }
    const text = formData.searchText;
    if (text && text.trim().length > 0) {
      return 'opacity-100';
    }
    
    return 'opacity-90 hover:opacity-100';
  })();

  return (
    <div className={className}>
      <form 
        onSubmit={handleSubmit}
        onFocus={handleFormFocus}
        onBlur={handleFormBlur}
        className={`transition-all duration-300 ease-in-out ${opacityClasses}`}
      >
        {/* Diseño Responsive - Mobile First */}
        <div className={`block ${isOnHomePage() ? 'bg-white/85 hover:bg-white' : 'bg-white'} shadow-lg`}>
          {/* Layout Mobile - Vertical (Mobile First) */}
          <div className="flex flex-col lg:hidden p-4 space-y-4">
            {/* Campo de destino - 100% */}
            <div className="w-full">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">WHERE ARE YOU GOING?</div>
              <div className="flex items-center gap-2 p-3 border border-gray-200 bg-white">
                <SearchAutocomplete
                  value={formData.searchText}
                  onChange={handleSearchTextChange}
                  onSelectionChange={handleDestinationSelection}
                  onClear={() => {
                    setFormData(prev => ({
                      ...prev,
                      searchText: '',
                      selectedDestinationId: null,
                      selectedDestinationText: '',
                      selectedDestinationType: null,
                      selectedDestinationLocation: ''
                    }))
                    setIsUserInteracting(false)
                  }}
                  disabled={disabled}
                  placeholder={placeholder}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400 flex-1"
                />
              </div>
            </div>

            {/* Botón de búsqueda - 100% */}
            <div className="w-full">
              <button
                type="submit"
                disabled={disabled || !formData.selectedDestinationId || isSearching}
                className="w-full cursor-pointer bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 px-4"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Layout Desktop - Horizontal */}
          <div className="hidden lg:flex items-stretch divide-x divide-gray-200">
            {/* Campo de destino */}
            <div className="flex-1 p-6">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">WHERE ARE YOU GOING?</div>
              <div className="flex items-center gap-2">
                <SearchAutocomplete
                  value={formData.searchText}
                  onChange={handleSearchTextChange}
                  onSelectionChange={handleDestinationSelection}
                  onClear={() => {
                    setFormData(prev => ({
                      ...prev,
                      searchText: '',
                      selectedDestinationId: null,
                      selectedDestinationText: '',
                      selectedDestinationType: null,
                      selectedDestinationLocation: ''
                    }))
                    setIsUserInteracting(false)
                  }}
                  disabled={disabled}
                  placeholder={placeholder}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Botón de búsqueda */}
            <div className="flex">
              <button
                type="submit"
                disabled={disabled || !formData.selectedDestinationId || isSearching}
                className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full h-full px-6 py-4"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SimpleSearchForm
