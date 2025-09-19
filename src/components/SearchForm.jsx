import { useState, useEffect, useRef } from 'react'
import SearchAutocomplete from './SearchAutocomplete.jsx'
import GuestSelector from './common/GuestSelector.jsx'
import { useSearchStore } from '../stores/useSearchStore.js'
import { useUrlParams } from '../hooks/useUrlParams.js'
import { useDebounce } from '../hooks/useDebounce.js'

function SearchForm({ initialData = {}, disabled = false, className = "" }) {
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
  console.log('🔍 searchData', searchData)
  // Hook para parámetros de URL
  const { urlParams, updateUrl, buildSearchUrl } = useUrlParams()

  // Estados locales para control de UI
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [minCheckOutDate, setMinCheckOutDate] = useState('')
  const dropdownRef = useRef(null)

  // Mostrar campos adicionales solo si hay parámetros de URL
  useEffect(() => {
    if (Object.keys(urlParams).length > 0 && urlParams.destinationId) {
      setShowAdditionalFields(true)
    }
  }, [urlParams])

  // Función para autocompletar el formulario con datos externos
  const autocompleteForm = (sourceData) => {
    console.log('🔗 Autocompletando formulario con datos:', sourceData);
    
    setSearchData({
      searchText: sourceData.destination || '',
      selectedDestinationId: sourceData.destinationId || '',
      selectedDestinationText: sourceData.destination || '',
      selectedDestinationType: sourceData.destinationType || 'hotel',
      selectedDestinationLocation: sourceData.destinationLocation || '',
      checkInDate: sourceData.checkIn || (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      })(),
      checkOutDate: sourceData.checkOut || (() => {
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        return dayAfterTomorrow.toISOString().split('T')[0];
      })(),
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
      console.log('🚀 Ejecutando búsqueda automática con parámetros de URL');
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
    }
  }

  // Manejar cambio de texto en el input de búsqueda
  const handleSearchTextChange = (text) => {
    setSearchText(text)
    // Mostrar campos adicionales cuando el usuario empiece a escribir
    if (text && !showAdditionalFields) {
      setShowAdditionalFields(true)
    }
    if (searchData.selectedDestinationId && text !== searchData.selectedDestinationText) {
      setSelectedDestination(null)
      // En móvil, ocultar campos adicionales si se borra la selección
      if (typeof window !== 'undefined' && window.innerWidth < 1024 && !text) {
        setShowAdditionalFields(false)
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
    return typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '/index.html');
  }

  // Función para determinar si debe mostrar valores del store o campos vacíos
  const shouldShowStoreValues = () => {
    // Mostrar valores del store si hay parámetros de URL o si el usuario ha interactuado
    return (Object.keys(urlParams).length > 0 && urlParams.destinationId) || showAdditionalFields;
  }

  // Función para obtener el valor a mostrar en los campos
  const getFieldValue = (storeValue, emptyValue = '') => {
    return shouldShowStoreValues() ? storeValue : emptyValue;
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validación: si hay niños, solo permitir 1 habitación
    if (searchData.children > 0 && searchData.rooms > 1) {
      alert('If you include children, only one room can be booked at a time.')
      return
    }

    updateUrl(searchData);
    
    // Ejecutar búsqueda usando el store
    const response = await executeSearch()

    if (response.search_type === 'hotel') {
      // Redireccionar a la página del hotel específico
      window.location.href = `/hotels/${searchData.selectedDestinationId}${buildSearchUrl(searchData)}`
      return
    }

    // Si estamos en la página home, redireccionar a /search con los parámetros
    if (isOnHomePage()) {
      const searchUrl = `/search${buildSearchUrl(searchData)}`;
      window.location.href = searchUrl;
      return;
    }
    if (response.results) {
      console.log('Búsqueda ejecutada exitosamente:', response.results)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        {/* Diseño Responsive - Mobile First */}
        <div className={`block ${isOnHomePage() ? 'bg-white/85 hover:bg-white' : 'bg-white'} rounded-lg shadow-lg`}>
          {/* Layout Mobile - Vertical (Mobile First) */}
          <div className="flex flex-col lg:hidden p-4 space-y-4">
            {/* Campo de destino - 100% */}
            <div className="w-full">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">WHERE ARE YOU GOING?</div>
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                <SearchAutocomplete
                  value={getFieldValue(searchData.searchText)}
                  onChange={handleSearchTextChange}
                  onSelectionChange={handleDestinationSelection}
                  onClear={() => {
                    setSearchText('')
                    setSelectedDestination(null)
                  }}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400 flex-1"
                />
              </div>
            </div>

            {/* Fechas - Check In y Check Out en filas separadas para móvil */}
            <div className="space-y-4">
              {/* Check In */}
              <div className="w-full">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK IN</div>
                <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={getFieldValue(searchData.checkInDate)}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    disabled={disabled}
                    className="border-0 p-0 focus:ring-0 text-sm font-medium text-gray-900 bg-transparent cursor-pointer flex-1"
                    min={(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return tomorrow.toISOString().split('T')[0];
                    })()}
                  />
                </div>
              </div>

              {/* Check Out */}
              <div className="w-full">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK OUT</div>
                <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={getFieldValue(searchData.checkOutDate)}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    disabled={disabled}
                    className="border-0 p-0 focus:ring-0 text-sm font-medium text-gray-900 bg-transparent cursor-pointer flex-1"
                    min={minCheckOutDate}
                  />
                </div>
              </div>
            </div>

            {/* Selector de huéspedes - 100% */}
            <div className="w-full relative" ref={dropdownRef} data-dropdown="guests">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
              <button
                type="button"
                onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                disabled={disabled}
                className="w-full flex items-center justify-between gap-2 text-base font-medium text-gray-900 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <span>
                  {shouldShowStoreValues() 
                    ? `${searchData.adults} Adults, ${searchData.children} child, ${searchData.rooms} rooms`
                    : 'Select guests'
                  }
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de huéspedes para móvil */}
              {showGuestsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 p-4" data-dropdown="guests">
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

          {/* Layout Desktop - Horizontal */}
          <div className="hidden lg:flex items-stretch divide-x divide-gray-200">
            {/* Campo de destino */}
            <div className="flex-1 p-6">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">WHERE ARE YOU GOING?</div>
              <div className="flex items-center gap-2">
                <SearchAutocomplete
                  value={getFieldValue(searchData.searchText)}
                  onChange={handleSearchTextChange}
                  onSelectionChange={handleDestinationSelection}
                  onClear={() => {
                    setSearchText('')
                    setSelectedDestination(null)
                  }}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Selector de fechas - Check In */}
            <div className="p-6 flex-0">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK IN</div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={getFieldValue(searchData.checkInDate)}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 bg-transparent cursor-pointer"
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                />
              </div>
            </div>

            {/* Selector de fechas - Check Out */}
            <div className="p-6 flex-0">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK OUT</div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={getFieldValue(searchData.checkOutDate)}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  disabled={disabled}
                  className="border-0 p-0 focus:ring-0 text-base font-medium text-gray-900 bg-transparent cursor-pointer"
                  min={minCheckOutDate}
                />
              </div>
            </div>

            {/* Selector de huéspedes */}
            <div className="relative p-6" ref={dropdownRef} data-dropdown="guests">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">GUESTS</div>
              <button
                type="button"
                onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                disabled={disabled}
                className=" flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                <span>
                  {shouldShowStoreValues() 
                    ? `${searchData.adults} Adults, ${searchData.children} child, ${searchData.rooms} rooms`
                    : 'Select guests'
                  }
                </span>
              </button>

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