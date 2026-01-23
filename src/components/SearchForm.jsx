import { useState, useEffect, useRef } from 'react'
import SearchAutocomplete from './SearchAutocomplete.jsx'
import GuestSelector from './common/GuestSelector.jsx'
import DateRangePicker from './common/DateRangePicker.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useUrlParams } from '../hooks/useUrlParams.js'
import { useDebounce } from '../hooks/useDebounce.js'

function SearchForm({ initialData = {}, disabled = false, className = "", isMain = false }) {
  // Solo usar store para guardar búsquedas confirmadas y ejecutarlas
  const { 
    setSearchData,  // Solo para guardar al hacer submit
    executeSearch   // Solo para ejecutar búsqueda confirmada
  } = useSearchStore()
  
  // Hook para parámetros de URL
  const { urlParams, updateUrl, buildSearchUrl } = useUrlParams()

  // Función para obtener fecha de hoy en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Función para obtener fecha de mañana en formato YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Estado local para el formulario (draft)
  const [formData, setFormData] = useState({
    searchText: '',
    selectedDestinationId: null,
    selectedDestinationText: '',
    selectedDestinationType: null,
    selectedDestinationLocation: '',
    checkInDate: getTodayDate(),
    checkOutDate: getTomorrowDate(),
    rooms: 1,
    adults: 2,
    children: 0,
    childrenAges: [],
  })
  console.log(formData.searchText)
  console.log(formData.selectedDestinationId)
  console.log(formData.selectedDestinationText)
  // Estado unificado para control de UI
  const [uiState, setUIState] = useState({
    showAdditionalFields: false,
    showGuestsDropdown: false,
    showCollapsibleSection: false,
    isFormActive: false,
    isUserInteracting: false
  })
  const [minCheckOutDate, setMinCheckOutDate] = useState('')
  const guestsDropdownRef = useRef(null)

  // Función para verificar si estamos en la página de búsqueda
  const isOnSearchPage = () => {
    return typeof window !== 'undefined' && window.location.pathname === '/search';
  };

  // Función para verificar si se pueden ejecutar búsquedas automáticas
  const canExecuteAutoSearch = (sourceData) => {
    return sourceData.destinationId && sourceData.checkIn && sourceData.checkOut && sourceData.adults;
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
        checkInDate: urlParams.checkIn || getTodayDate(),
        checkOutDate: urlParams.checkOut || getTomorrowDate(),
        rooms: urlParams.rooms || 1,
        adults: urlParams.adults || 2,
        children: urlParams.children || 0,
        childrenAges: urlParams.childrenAges || [],
      })
      
      // Mostrar campos adicionales
      setUIState(prev => ({
        ...prev,
        showAdditionalFields: true,
        showCollapsibleSection: true
      }))

      if (canExecuteAutoSearch(urlParams)) {
        debouncedAutoSearch();
      }
    }
  }, [urlParams])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!uiState.showGuestsDropdown) return
      
      // Verificar si el click fue dentro del dropdown
      if (guestsDropdownRef.current && guestsDropdownRef.current.contains(event.target)) {
        return // Click dentro del dropdown, no cerrar
      }
      
      // Verificar también usando closest para elementos dinámicos
      if (event.target.closest && event.target.closest('[data-dropdown="guests"]')) {
        return // Click dentro del dropdown, no cerrar
      }
      
      // Si llegamos aquí, el click fue fuera del dropdown
      setUIState(prev => ({ ...prev, showGuestsDropdown: false }))
    }
    
    if (uiState.showGuestsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [uiState.showGuestsDropdown])

  // Actualizar fecha mínima de check-out cuando cambia check-in
  useEffect(() => {
    if (formData.checkInDate) {
      const checkInDate = new Date(formData.checkInDate);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const minDate = nextDay.toISOString().split('T')[0];
      
      setMinCheckOutDate(minDate);
      
      // Si check-out actual es anterior o igual al check-in, actualizarlo
      if (formData.checkOutDate) {
        const checkOutDate = new Date(formData.checkOutDate);
        if (checkOutDate <= checkInDate) {
          setFormData(prev => ({ ...prev, checkOutDate: minDate }))
        }
      }
    } else {
      // Si no hay check-in, usar mañana como mínimo
      setMinCheckOutDate(getTomorrowDate());
    }
  }, [formData.checkInDate, formData.checkOutDate])

  // Manejar selección de destino desde el autocompletado
  const handleDestinationSelection = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      selectedDestinationId: suggestion.id,
      selectedDestinationText: suggestion.text,
      selectedDestinationType: suggestion.type,
      selectedDestinationLocation: suggestion.location,
      searchText: suggestion.text
    }))
    // En móvil, mostrar campos adicionales después de seleccionar destino
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setUIState(prev => ({
        ...prev,
        showAdditionalFields: true,
        showCollapsibleSection: true
      }))
    }
  }

  // Manejar cambio de texto en el input de búsqueda
  const handleSearchTextChange = (text) => {
    setFormData(prev => ({ ...prev, searchText: text }))
    setUIState(prev => ({ ...prev, isUserInteracting: true }))
    // Mostrar campos adicionales cuando el usuario empiece a escribir
    if (text && !uiState.showAdditionalFields) {
      setUIState(prev => ({
        ...prev,
        showAdditionalFields: true,
        showCollapsibleSection: true
      }))
    }
    if (formData.selectedDestinationId && text !== formData.selectedDestinationText) {
      setFormData(prev => ({
        ...prev,
        selectedDestinationId: null,
        selectedDestinationText: '',
        selectedDestinationType: null,
        selectedDestinationLocation: ''
      }))
      // En móvil, ocultar campos adicionales si se borra la selección
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && !text) {
        setUIState(prev => ({
          ...prev,
          showAdditionalFields: false,
          showCollapsibleSection: false
        }))
      }
    }
  }

  // Manejar cambio en el número de habitaciones
  const handleRoomsChange = (newRooms) => {
    setFormData(prev => ({ ...prev, rooms: newRooms }))
  }

  // Manejar cambio en número de adultos
  const handleAdultsChange = (newAdults) => {
    setFormData(prev => ({ ...prev, adults: newAdults }))
  }

  // Manejar cambio en número de niños
  const handleChildrenChange = (newChildren) => {
    setFormData(prev => {
      let newRooms = prev.rooms;
      let newChildrenAges = prev.childrenAges;
      
      // Si se agregan niños y hay más de 1 habitación, forzar a 1 habitación
      if (newChildren > 0 && newRooms > 1) {
        newRooms = 1;
      }
      
      // Ajustar el array de edades según el número de niños
      if (newChildren > prev.children) {
        // Agregar niños: mantener edades existentes y agregar 0 para nuevos niños
        const existingAges = prev.childrenAges || [];
        const newAges = Array(newChildren).fill(0).map((_, index) => {
          return existingAges[index] !== undefined ? existingAges[index] : 0;
        });
        newChildrenAges = newAges;
      } else if (newChildren < prev.children) {
        // Remover niños: mantener solo las edades necesarias
        newChildrenAges = prev.childrenAges.slice(0, newChildren);
      }
      
      return {
        ...prev,
        children: newChildren,
        rooms: newRooms,
        childrenAges: newChildrenAges
      }
    })
  }

  // Manejar cambio en edades de niños
  const handleChildrenAgesChange = (newAges) => {
    setFormData(prev => ({ ...prev, childrenAges: newAges }))
  }

  // Manejar cambios en fechas
  const handleCheckInDateChange = (date) => {
    setFormData(prev => ({ ...prev, checkInDate: date }))
  }

  const handleCheckOutDateChange = (date) => {
    setFormData(prev => ({ ...prev, checkOutDate: date }))
  }

  // Determinar si debe forzarse una sola habitación
  const shouldForceSingleRoom = () => {
    return formData.children > 0
  }

  // Función para verificar si estamos en la página home
  const isOnHomePage = () => {
    if (isMain) return true;
    return false;
  }

  // Manejar cuando el formulario se vuelve activo
  const handleFormFocus = () => {
    if (isOnHomePage()) {
      setUIState(prev => ({ ...prev, isFormActive: true }))
    }
    // Mostrar sección colapsable cuando se activa el SearchAutocomplete en móvil
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setUIState(prev => ({ ...prev, showCollapsibleSection: true }))
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
          setUIState(prev => ({ ...prev, isFormActive: false }))
        }
      }, 100)
    }
  }

  // Función para verificar si estamos en la página de hotel
  const isOnHotelPage = () => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/hotels/');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 1. Validación: si hay niños, solo permitir 1 habitación
    if (formData.children > 0 && formData.rooms > 1) {
      alert('If you include children, only one room can be booked at a time.')
      return
    }

    // 2. Ocultar sección colapsable en móvil después del envío
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setUIState(prev => ({ ...prev, showCollapsibleSection: false }))
    }

    // 3. AQUÍ es donde guardamos en el store
    setSearchData(formData)
    
    // 4. Actualizar URL
    updateUrl(formData);
    
    // 5. Redirecciones
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

    // 6. Si ninguna coincide, continuamos y se realiza la búsqueda
    const response = await executeSearch();
    
    if (response && response.results) {
      console.log('Búsqueda ejecutada exitosamente:', response.results)
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
        <div className={`block ${isOnHomePage() ? 'bg-white/85 hover:bg-white' : 'bg-white'} rounded-lg shadow-lg`}>
          {/* Layout Mobile - Vertical (Mobile First) */}
          <div className="flex flex-col lg:hidden p-4 space-y-4">
            {/* Campo de destino - 100% */}
              <div className="w-full">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">WHERE ARE YOU GOING?</div>
                <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
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
                      setUIState(prev => ({ ...prev, isUserInteracting: false }))
                    }}
                    disabled={disabled}
                    className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400 flex-1"
                  />
                </div>
              </div>

            {/* Sección colapsable de fechas y huéspedes */}
            <div className={`w-full space-y-4 transition-all duration-300 ease-in-out ${
              uiState.showCollapsibleSection 
                ? 'max-h-[1000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              {/* Fechas - Date Range Picker */}
              <DateRangePicker
                startDate={formData.checkInDate}
                endDate={formData.checkOutDate}
                onStartDateChange={handleCheckInDateChange}
                onEndDateChange={handleCheckOutDateChange}
                disabled={disabled}
              />

              {/* Selector de huéspedes - 100% */}
              <div className="w-full relative" data-dropdown="guests">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
                <div
                  onClick={() => !disabled && setUIState(prev => ({ ...prev, showGuestsDropdown: !prev.showGuestsDropdown }))}
                  className="w-full flex items-center justify-between gap-2 text-base font-medium text-gray-900 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>
                    {formData.checkInDate && formData.checkOutDate
                      ? `${formData.adults} Adults, ${formData.children} child, ${formData.rooms} rooms`
                      : 'Select guests'
                    }
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown de huéspedes para móvil */}
                {uiState.showGuestsDropdown && (
                  <div 
                    ref={guestsDropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-[99999] p-4" 
                    data-dropdown="guests"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-medium text-gray-900 mb-4">Configure guests</h3>
                    
                    <GuestSelector
                      adults={formData.adults}
                      children={formData.children}
                      rooms={formData.rooms}
                      childrenAges={formData.childrenAges}
                      onAdultsChange={handleAdultsChange}
                      onChildrenChange={handleChildrenChange}
                      onRoomsChange={handleRoomsChange}
                      onChildrenAgesChange={handleChildrenAgesChange}
                      disabled={disabled}
                      forceSingleRoom={shouldForceSingleRoom()}
                    />
                    
                    {shouldForceSingleRoom() && (
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <span className="font-medium">Note:</span> When including children in the reservation, only one room can be booked at a time.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setUIState(prev => ({ ...prev, showGuestsDropdown: false }))}
                      className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Botón de búsqueda - 100% */}
              <div className="w-full">
                <button
                  type="submit"
                  disabled={disabled || !formData.checkInDate || !formData.checkOutDate}
                  className="w-full cursor-pointer bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3 px-4 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Layout Desktop - Horizontal */}
          <div className="hidden lg:flex items-stretch divide-x divide-gray-200">
            {/* Campo de destino */}
            <div className="flex-2/4 p-6">
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
                    setUIState(prev => ({ ...prev, isUserInteracting: false }))
                  }}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex-1/4">
              {/* Selector de fechas - Date Range Picker */}
              <DateRangePicker
                startDate={formData.checkInDate}
                endDate={formData.checkOutDate}
                onStartDateChange={handleCheckInDateChange}
                onEndDateChange={handleCheckOutDateChange}
                disabled={disabled}
              />
            </div>

            {/* Selector de huéspedes */}
            <div 
              className="relative p-6 flex-1/4 transition-colors hover:bg-gray-50" 
              data-dropdown="guests"
            >
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
              <div 
                className="flex items-center gap-2 text-base font-medium text-gray-900 cursor-pointer"
                onClick={() => !disabled && setUIState(prev => ({ ...prev, showGuestsDropdown: !prev.showGuestsDropdown }))}
              >
                <span>
                  {formData.checkInDate && formData.checkOutDate
                    ? `${formData.adults} Adults, ${formData.children} child, ${formData.rooms} rooms`
                    : 'Select guests'
                  }
                </span>
              </div>

              {/* Dropdown de huéspedes */}
              {uiState.showGuestsDropdown && (
                <div 
                  ref={guestsDropdownRef}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 md:w-auto md:min-w-[600px] bg-white rounded-lg shadow-xl border z-[99999] p-4 pointer-events-auto" 
                  data-dropdown="guests"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-medium text-gray-900 mb-4">Configure guests</h3>
                  
                  <GuestSelector
                    adults={formData.adults}
                    children={formData.children}
                    rooms={formData.rooms}
                    childrenAges={formData.childrenAges}
                    onAdultsChange={handleAdultsChange}
                    onChildrenChange={handleChildrenChange}
                    onRoomsChange={handleRoomsChange}
                    onChildrenAgesChange={handleChildrenAgesChange}
                    disabled={disabled}
                    forceSingleRoom={shouldForceSingleRoom()}
                  />
                  
                  {shouldForceSingleRoom() && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <span className="font-medium">Note:</span> When including children in the reservation, only one room can be booked at a time.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setUIState(prev => ({ ...prev, showGuestsDropdown: false }))}
                    className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Botón de búsqueda */}
            <div className="flex">
                <button
                  type="submit"
                  disabled={disabled || !formData.checkInDate || !formData.checkOutDate}
                  className="cursor-pointer bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full h-full px-6 py-4"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchForm
