import { useState, useEffect, useRef } from 'react'
import { hotelsApi } from '../lib/http'

function SearchAutocomplete({ 
  value, 
  onChange,
  onSelectionChange,
  placeholder,
  className = "",
  disabled = false 
}) {
  
  // Estados del componente
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedColumn, setSelectedColumn] = useState('destinations') // 'destinations' o 'hotels'
  const [isMobile, setIsMobile] = useState(false)
  
  // Referencias
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceRef = useRef(null)
  
  // Detectar si es dispositivo móvil/tablet
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  
  // Función para buscar sugerencias
  const searchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    setLoading(true)
    
    try {
      const results = await hotelsApi.search(query.trim())
      setSuggestions(results || [])
      setShowSuggestions(true)
      setSelectedIndex(-1)
      setSelectedColumn('destinations')
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }
  
  // Separar sugerencias por tipo
  const getGroupedSuggestions = () => {
    const destinations = suggestions.filter(s => s.type === 'location')
    const hotels = suggestions.filter(s => s.type === 'hotel')
    return { destinations, hotels }
  }
  
  // Manejar cambios en el input con debounce
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Limpiar timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // Establecer nuevo timeout para búsqueda
    debounceRef.current = setTimeout(() => {
      searchSuggestions(newValue)
    }, 300) // 300ms de debounce
  }
  
  // Manejar selección de sugerencia
  const handleSuggestionClick = (suggestion) => {
    // Actualizar el valor del input con el texto de la sugerencia
    const suggestionText = suggestion.text || suggestion.location || ''
    onChange(suggestionText)
    
    // Llamar al callback de selección con el objeto completo
    if (onSelectionChange) {
      onSelectionChange(suggestion)
    }
    
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }
  console.log(showSuggestions)
  // Manejar teclas del teclado para navegación entre columnas
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    
    const { destinations, hotels } = getGroupedSuggestions()
    const currentList = selectedColumn === 'destinations' ? destinations : hotels
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (selectedIndex < currentList.length - 1) {
          setSelectedIndex(selectedIndex + 1)
        } else {
          setSelectedIndex(0)
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (selectedIndex > 0) {
          setSelectedIndex(selectedIndex - 1)
        } else {
          setSelectedIndex(currentList.length - 1)
        }
        break
        
      case 'ArrowRight':
        e.preventDefault()
        if (selectedColumn === 'destinations' && hotels.length > 0) {
          setSelectedColumn('hotels')
          setSelectedIndex(0)
        }
        break
        
      case 'ArrowLeft':
        e.preventDefault()
        if (selectedColumn === 'hotels' && destinations.length > 0) {
          setSelectedColumn('destinations')
          setSelectedIndex(0)
        }
        break
        
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < currentList.length) {
          handleSuggestionClick(currentList[selectedIndex])
        }
        break
        
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }
  
  // Manejar clic fuera del componente (solo en desktop)
  useEffect(() => {
    if (isMobile) return // No aplicar en móvil ya que usamos modal
    
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile])
  
  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])
  
  // Función para resaltar el texto coincidente
  const highlightMatch = (text, query) => {
    if (!query || !text) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }
  
  // Cerrar modal en móvil
  const closeMobileModal = () => {
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const { destinations, hotels } = getGroupedSuggestions()

  return (
    <div className="relative">
      {/* Campo de entrada */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg focus:border-transparent focus:ring-0 focus:outline-none ${className}`}
          autoComplete="off"
        />
        
        {/* Botón para limpiar */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setSuggestions([])
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors w-5 h-5 flex items-center justify-center"
          >
            ✕
          </button>
        )}
        
        {/* Indicador de carga */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {/* Modal Full-Screen para Mobile/Tablet */}
      {isMobile && showSuggestions && (destinations.length > 0 || hotels.length > 0) && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header del modal */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={closeMobileModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-xl">←</span>
              </button>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Contenido del modal */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-200 h-full">
              {/* Columna de Destinos */}
              <div className="overflow-y-auto">
                <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Destinations</h3>
                </div>
                {destinations.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {destinations.map((suggestion, index) => (
                      <button
                        key={`dest-${suggestion.id}-${index}`}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-4 min-h-[56px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        {/* Icono de ubicación */}
                        <span className="text-gray-400 flex-shrink-0 text-lg">
                          📍
                        </span>
                        
                        {/* Contenido de la sugerencia */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-base">
                            {highlightMatch(suggestion.text, value)}
                          </div>
                          {suggestion.location && (
                            <div className="text-sm text-gray-500 truncate">
                              {suggestion.location}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center text-gray-500">
                    <div className="text-2xl mb-2">📍</div>
                    <div className="text-sm">No destinations found</div>
                  </div>
                )}
              </div>

              {/* Columna de Hoteles */}
              <div className="overflow-y-auto">
                <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Hotels</h3>
                </div>
                {hotels.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {hotels.map((suggestion, index) => (
                      <button
                        key={`hotel-${suggestion.id}-${index}`}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-4 min-h-[56px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        {/* Icono de hotel */}
                        <span className="text-gray-400 flex-shrink-0 text-lg">
                          🏨
                        </span>
                        
                        {/* Contenido de la sugerencia */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-base">
                            {highlightMatch(suggestion.text, value)}
                          </div>
                          {suggestion.location && (
                            <div className="text-sm text-gray-500 truncate">
                              {suggestion.location}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center text-gray-500">
                    <div className="text-2xl mb-2">🏨</div>
                    <div className="text-sm">No hotels found</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Dropdown Desktop (mantener original) */}
      {!isMobile && showSuggestions && (destinations.length > 0 || hotels.length > 0) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full min-w-[600px] mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[400px] overflow-hidden"
        >
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* Columna de Destinos */}
            <div className="overflow-y-auto max-h-[400px]">
              <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Destinations</h3>
              </div>
              {destinations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {destinations.map((suggestion, index) => (
                    <button
                      key={`dest-${suggestion.id}-${index}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 min-h-[48px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        selectedColumn === 'destinations' && index === selectedIndex 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700'
                      }`}
                      onMouseEnter={() => {
                        setSelectedColumn('destinations')
                        setSelectedIndex(index)
                      }}
                    >
                      {/* Icono de ubicación */}
                      <span className="text-gray-400 flex-shrink-0">
                        📍
                      </span>
                      
                      {/* Contenido de la sugerencia */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">
                          {highlightMatch(suggestion.text, value)}
                        </div>
                        {suggestion.location && (
                          <div className="text-xs text-gray-500 truncate">
                            {suggestion.location}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No hay destinos
                </div>
              )}
            </div>

            {/* Columna de Hoteles */}
            <div className="overflow-y-auto max-h-[400px]">
              <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Hotels</h3>
              </div>
              {hotels.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {hotels.map((suggestion, index) => (
                    <button
                      key={`hotel-${suggestion.id}-${index}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 min-h-[48px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        selectedColumn === 'hotels' && index === selectedIndex 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700'
                      }`}
                      onMouseEnter={() => {
                        setSelectedColumn('hotels')
                        setSelectedIndex(index)
                      }}
                    >
                      {/* Icono de hotel */}
                      <span className="text-gray-400 flex-shrink-0">
                        🏨
                      </span>
                      
                      {/* Contenido de la sugerencia */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">
                          {highlightMatch(suggestion.text, value)}
                        </div>
                        {suggestion.location && (
                          <div className="text-xs text-gray-500 truncate">
                            {suggestion.location}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No hay hoteles
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Mensaje cuando no hay resultados */}
      {!isMobile && showSuggestions && !loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-center text-gray-500">
          <div className="text-lg mb-2">🔍</div>
          <div className="text-sm">
            No se encontraron resultados para "{value}"
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete 