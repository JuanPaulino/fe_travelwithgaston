import { useState, useEffect, useRef } from 'react'
import SearchAutocomplete from './SearchAutocomplete.jsx'
import GuestSelector from './common/GuestSelector.jsx'
import DateRangePicker from './common/DateRangePicker.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useUrlParams } from '../hooks/useUrlParams.js'
import { useDebounce } from '../hooks/useDebounce.js'

function SearchForm({ initialData = {}, disabled = false, className = "", isMain = false }) {
  const { 
    searchData, 
    setSearchText, 
    setSearchData,
    setSelectedDestination, 
    setCheckInDate, 
    setCheckOutDate, 
    setRooms, 
    setAdults, 
    setChildren,
    setChildrenAges,
    executeSearch 
  } = useSearchStore()
  // Hook para parámetros de URL
  const { urlParams, updateUrl, buildSearchUrl } = useUrlParams()

  // Estados locales para control de UI
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [showCollapsibleSection, setShowCollapsibleSection] = useState(false)
  const [minCheckOutDate, setMinCheckOutDate] = useState('')
  const [isFormActive, setIsFormActive] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const dropdownRef = useRef(null)

  // Mostrar campos adicionales solo si hay parámetros de URL
  useEffect(() => {
    if (Object.keys(urlParams).length > 0 && urlParams.destinationId) {
      setShowAdditionalFields(true)
      setShowCollapsibleSection(true)
    }
  }, [urlParams])

  // Función para obtener fechas por defecto
  const getDefaultDates = () => {
    // Check-in: hoy
    const checkInDate = new Date()
    
    // Check-out: mañana (hoy + 1 día)
    const checkOutDate = new Date()
    checkOutDate.setDate(checkOutDate.getDate() + 1)
    
    return {
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0]
    }
  }

  // Función para autocompletar el formulario con datos externos
  const autocompleteForm = (sourceData) => {
    // Obtener fechas por defecto usando la lógica de 13:00 PM
    const defaultDates = getDefaultDates();
    
    setSearchData({
      searchText: sourceData.destination || '',
      selectedDestinationId: sourceData.destinationId || '',
      selectedDestinationText: sourceData.destination || '',
      selectedDestinationType: sourceData.destinationType || 'hotel',
      selectedDestinationLocation: sourceData.destinationLocation || '',
      checkInDate: sourceData.checkIn || defaultDates.checkIn,
      checkOutDate: sourceData.checkOut || defaultDates.checkOut,
      rooms: parseInt(sourceData.rooms) || 1,
      adults: parseInt(sourceData.adults) || 2,
      children: parseInt(sourceData.children) || 0,
      childrenAges: sourceData.childrenAges ? 
        (typeof sourceData.childrenAges === 'string' ? 
          sourceData.childrenAges.split(',').map(age => parseInt(age)) : 
          sourceData.childrenAges) : []
    });
  };

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
      await executeSearch();
    },
    500,
    {
      condition: () => isOnSearchPage()
    }
  );

  // Solo autocompletar formulario con parámetros de URL (no con initialData)
  useEffect(() => {
    // Solo proceder si hay parámetros de URL válidos
    if (Object.keys(urlParams).length > 0 && urlParams.destinationId) {
      autocompleteForm(urlParams);
      
      // En móvil, mostrar campos adicionales después de autocompletar
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setShowAdditionalFields(true);
      }

      if (canExecuteAutoSearch(urlParams)) {
        debouncedAutoSearch();
      }
    }
  }, [urlParams]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo cerrar si el dropdown está abierto
      if (!showGuestsDropdown) return
      
      // Verificar si el click fue dentro del dropdown usando múltiples métodos
      const clickedElement = event.target
      
      // Método 1: contains() directo
      if (dropdownRef.current && dropdownRef.current.contains(clickedElement)) {
        return // Click dentro del dropdown, no cerrar
      }
      
      // Método 2: closest() para elementos dinámicos
      if (clickedElement.closest && clickedElement.closest('[data-dropdown="guests"]')) {
        return // Click dentro del dropdown, no cerrar
      }
      
      // Método 3: Verificación manual del árbol DOM
      let parent = clickedElement.parentElement
      while (parent && parent !== document.body) {
        if (parent === dropdownRef.current) {
          return // Click dentro del dropdown, no cerrar
        }
        parent = parent.parentElement
      }
      
      // Si llegamos aquí, el click fue fuera del dropdown
      setShowGuestsDropdown(false)
    }
    
    // Solo agregar el listener si el dropdown está abierto
    if (showGuestsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showGuestsDropdown])

  // Actualizar fecha mínima de check-out cuando cambia check-in
  useEffect(() => {
    if (searchData.checkInDate) {
      const checkInDate = new Date(searchData.checkInDate);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const minDate = nextDay.toISOString().split('T')[0];
      
      setMinCheckOutDate(minDate);
      
      // Si check-out actual es anterior o igual al check-in, actualizarlo
      const checkOutDate = new Date(searchData.checkOutDate);
      if (checkOutDate <= checkInDate) {
        setCheckOutDate(minDate);
      }
    } else {
      // Si no hay check-in, usar mañana como mínimo
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setMinCheckOutDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [searchData.checkInDate, searchData.checkOutDate, setCheckOutDate])

  // Manejar selección de destino desde el autocompletado
  const handleDestinationSelection = (suggestion) => {
    setSelectedDestination(suggestion)
    // En móvil, mostrar campos adicionales después de seleccionar destino
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowAdditionalFields(true)
      setShowCollapsibleSection(true)
    }
  }

  // Manejar cambio de texto en el input de búsqueda
  const handleSearchTextChange = (text) => {
    setSearchText(text)
    // Marcar que el usuario está interactuando
    setIsUserInteracting(true)
    // Mostrar campos adicionales cuando el usuario empiece a escribir
    if (text && !showAdditionalFields) {
      setShowAdditionalFields(true)
      setShowCollapsibleSection(true)
    }
    if (searchData.selectedDestinationId && text !== searchData.selectedDestinationText) {
      setSelectedDestination(null)
      // En móvil, ocultar campos adicionales si se borra la selección
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && !text) {
        setShowAdditionalFields(false)
        setShowCollapsibleSection(false)
      }
    }
  }

  // Manejar cambio en el número de habitaciones
  const handleRoomsChange = (newRooms) => {
    setRooms(newRooms)
  }

  // Manejar cambio en número de adultos
  const handleAdultsChange = (newAdults) => {
    setAdults(newAdults)
  }

  // Manejar cambio en número de niños
  const handleChildrenChange = (newChildren) => {
    setChildren(newChildren)
  }

  // Manejar cambio en edades de niños
  const handleChildrenAgesChange = (newAges) => {
    setChildrenAges(newAges)
  }

  // Calcular total de huéspedes
  const getTotalGuests = () => {
    return searchData.adults + searchData.children
  }

  // Obtener texto del selector de huéspedes para móvil
  const getGuestsTextMobile = () => {
    let text = `${searchData.adults} adult${searchData.adults > 1 ? 's' : ''}`
    if (searchData.children > 0) {
      text += ` ${searchData.children} child${searchData.children > 1 ? 'ren' : ''}`
    } else {
      text += ' 0 child'
    }
    
    return text
  }

  // Determinar si debe forzarse una sola habitación
  const shouldForceSingleRoom = () => {
    return searchData.children > 0
  }

  // Formatear fecha para mostrar
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  // Función para verificar si estamos en la página home
  const isOnHomePage = () => {
    if (isMain) return true;
    return false;
  }

  // Función para determinar si debe mostrar valores del store o campos vacíos
  const shouldShowStoreValues = () => {
    // Mostrar valores del store si hay parámetros de URL o si el usuario ha interactuado
    return (Object.keys(urlParams).length > 0 && urlParams.destinationId) || showAdditionalFields;
  }

  // Función específica para el campo de destino
  const shouldShowDestinationValue = () => {
    return (Object.keys(urlParams).length > 0 && urlParams.destinationId) || 
           isUserInteracting;
  }

  // Función específica para campos de fechas y huéspedes
  const shouldShowDateAndGuestValues = () => {
    // Solo mostrar valores del store cuando vienen de URL params
    // Nunca autocompletar desde el store (localStorage)
    return (Object.keys(urlParams).length > 0 && urlParams.destinationId);
  }

  // Manejar cuando el formulario se vuelve activo
  const handleFormFocus = () => {
    if (isOnHomePage()) {
      setIsFormActive(true)
    }
    // Mostrar sección colapsable cuando se activa el SearchAutocomplete en móvil
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowCollapsibleSection(true)
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

  // Función para obtener el valor a mostrar en los campos
  const getFieldValue = (storeValue, emptyValue = '') => {
    return shouldShowStoreValues() ? storeValue : emptyValue;
  }

  // Función específica para obtener valor del campo de destino
  const getDestinationValue = (storeValue, emptyValue = '') => {
    return shouldShowDestinationValue() ? storeValue : emptyValue;
  }

  // Función específica para obtener valor de campos de fechas y huéspedes
  const getDateAndGuestValue = (storeValue, emptyValue = '', fieldType = '') => {
    // Si hay URL params, usar los valores del store (que fueron poblados desde la URL)
    if (shouldShowDateAndGuestValues()) {
      return storeValue;
    }
    
    // Si no hay URL params, NO autocompletar nada - dejar campos vacíos
    return emptyValue;
  }

  // Función para hacer scroll a los resultados en móvil
  const scrollToResults = () => {
    // Solo hacer scroll en móvil
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          const elementTop = resultsElement.getBoundingClientRect().top + window.pageYOffset;
          const scrollPosition = elementTop - 50; // Pequeño offset
          
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // Delay para que inicie la búsqueda
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
    if (searchData.children > 0 && searchData.rooms > 1) {
      alert('If you include children, only one room can be booked at a time.')
      return
    }

    // 2. Ocultar sección colapsable en móvil después del envío
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setShowCollapsibleSection(false)
    }

    // 3. Preparar parámetros URL
    updateUrl(searchData);
    
    // Hacer scroll a resultados en móvil antes de ejecutar búsqueda
    // scrollToResults();
    
    // 4. Redirecciones
    // Si la búsqueda es a hotel y estamos en la página search.astro o home
    if (searchData.selectedDestinationType === 'hotel' && (isOnSearchPage() || isOnHomePage())) {
      window.location.href = `/hotels/${searchData.selectedDestinationId}${buildSearchUrl(searchData)}`;
      return;
    }
    // si la busqueda es a hotel y estamos en la página de hotel actualizar con los parametros de la url
    if (searchData.selectedDestinationType === 'hotel' && isOnHotelPage()) {
      const searchUrl = `/hotels/${searchData.selectedDestinationId}${buildSearchUrl(searchData)}`;
      window.location.href = searchUrl;
      return;
    }
    // Si la búsqueda es a location o inspiration y estamos en la página de hotel
    if ((searchData.selectedDestinationType === 'location' || searchData.selectedDestinationType === 'inspiration') && (isOnHotelPage() || isOnHomePage())) {
      const searchUrl = `/search${buildSearchUrl(searchData)}`;
      window.location.href = searchUrl;
      return;
    }

    // 5. Si ninguna coincide, continuamos y se realiza la búsqueda
    const response = await executeSearch();
    
    if (response.results) {
      console.log('Búsqueda ejecutada exitosamente:', response.results)
    }
  }

  const opacityClasses = (() => {
    if (!isOnHomePage()) {
      return 'opacity-100';
    }
    const text = getDestinationValue(searchData.searchText);
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
                    value={getDestinationValue(searchData.searchText)}
                    onChange={handleSearchTextChange}
                    onSelectionChange={handleDestinationSelection}
                    onClear={() => {
                      setSearchText('')
                      setSelectedDestination(null)
                      setIsUserInteracting(false)
                    }}
                    disabled={disabled}
                    className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400 flex-1"
                  />
                </div>
              </div>

            {/* Sección colapsable de fechas y huéspedes */}
            <div className={`w-full space-y-4 transition-all duration-300 ease-in-out ${
              showCollapsibleSection 
                ? 'max-h-[1000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              {/* Fechas - Date Range Picker */}
              <DateRangePicker
                startDate={getDateAndGuestValue(searchData.checkInDate, '', 'checkIn')}
                endDate={getDateAndGuestValue(searchData.checkOutDate, '', 'checkOut')}
                onStartDateChange={setCheckInDate}
                onEndDateChange={setCheckOutDate}
                disabled={disabled}
              />

              {/* Selector de huéspedes - 100% */}
              <div className="w-full relative" ref={dropdownRef} data-dropdown="guests">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
                <div
                  onClick={() => !disabled && setShowGuestsDropdown(!showGuestsDropdown)}
                  className="w-full flex items-center justify-between gap-2 text-base font-medium text-gray-900 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>
                    {shouldShowDateAndGuestValues() 
                      ? `${searchData.adults} Adults, ${searchData.children} child, ${searchData.rooms} rooms`
                      : 'Select guests'
                    }
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown de huéspedes para móvil */}
                {showGuestsDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-[99999] p-4" data-dropdown="guests">
                    <h3 className="font-medium text-gray-900 mb-4">Configure guests</h3>
                    
                    <GuestSelector
                      adults={searchData.adults}
                      children={searchData.children}
                      rooms={searchData.rooms}
                      childrenAges={searchData.childrenAges}
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
                      onClick={() => setShowGuestsDropdown(false)}
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
                  disabled={disabled || !searchData.checkInDate || !searchData.checkOutDate}
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
                  value={getDestinationValue(searchData.searchText)}
                  onChange={handleSearchTextChange}
                  onSelectionChange={handleDestinationSelection}
                  onClear={() => {
                    setSearchText('')
                    setSelectedDestination(null)
                    setIsUserInteracting(false)
                  }}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex-1/4">
              {/* Selector de fechas - Date Range Picker */}
              <DateRangePicker
                startDate={getDateAndGuestValue(searchData.checkInDate, '', 'checkIn')}
                endDate={getDateAndGuestValue(searchData.checkOutDate, '', 'checkOut')}
                onStartDateChange={setCheckInDate}
                onEndDateChange={setCheckOutDate}
                disabled={disabled}
              />
            </div>

            {/* Selector de huéspedes */}
            <div 
              className="relative p-6 flex-1/4 cursor-pointer transition-colors hover:bg-gray-50" 
              ref={dropdownRef} 
              data-dropdown="guests"
              onClick={() => !disabled && setShowGuestsDropdown(!showGuestsDropdown)}
            >
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
              <div className="flex items-center gap-2 text-base font-medium text-gray-900">
                <span>
                  {shouldShowDateAndGuestValues() 
                    ? `${searchData.adults} Adults, ${searchData.children} child, ${searchData.rooms} rooms`
                    : 'Select guests'
                  }
                </span>
              </div>

              {/* Dropdown de huéspedes */}
              {showGuestsDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 md:w-auto md:min-w-[600px] bg-white rounded-lg shadow-xl border z-[99999] p-4 pointer-events-auto" data-dropdown="guests">
                  <h3 className="font-medium text-gray-900 mb-4">Configure guests</h3>
                  
                  <GuestSelector
                    adults={searchData.adults}
                    children={searchData.children}
                    rooms={searchData.rooms}
                    childrenAges={searchData.childrenAges}
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
                    onClick={() => setShowGuestsDropdown(false)}
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
                  disabled={disabled || !searchData.checkInDate || !searchData.checkOutDate}
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