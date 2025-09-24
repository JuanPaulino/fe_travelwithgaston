import { useState, useEffect, useRef } from 'react'
import { hotelsApi } from '../lib/http'

function SearchAutocomplete({ 
  value, 
  onChange,
  onSelectionChange,
  onClear,
  placeholder,
  className = "",
  disabled = false 
}) {
  
  // Component states
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedColumn, setSelectedColumn] = useState('destinations') // 'destinations', 'hotels' o 'inspirations'
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // References
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceRef = useRef(null)
  const sideSheetRef = useRef(null)
  
  // Detect if it's a mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  
  // Function to search suggestions
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
      // Set the first visible column as selected
      const resultsArray = results || []
      const destinations = resultsArray.filter(s => s.type === 'location')
      const hotels = resultsArray.filter(s => s.type === 'hotel')
      const inspirations = resultsArray.filter(s => s.type === 'inspiration')
      const firstVisibleColumn = destinations.length > 0 ? 'destinations' : 
                                hotels.length > 0 ? 'hotels' : 
                                inspirations.length > 0 ? 'inspirations' : 'destinations'
      setSelectedColumn(firstVisibleColumn)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }
  
  // Separate suggestions by type
  const getGroupedSuggestions = () => {
    const destinations = suggestions.filter(s => s.type === 'location')
    const hotels = suggestions.filter(s => s.type === 'hotel')
    const inspirations = suggestions.filter(s => s.type === 'inspiration')
    return { destinations, hotels, inspirations }
  }
  
  // Handle input changes with debounce
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    // Set new timeout for search
    debounceRef.current = setTimeout(() => {
      searchSuggestions(newValue)
    }, 300) // 300ms debounce
  }
  
  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    // Update input value with suggestion text
    const suggestionText = suggestion.text || suggestion.location || ''
    onChange(suggestionText)
    
    // Call selection callback with complete object
    if (onSelectionChange) {
      onSelectionChange(suggestion)
    }
    
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }
  console.log(showSuggestions)
  // Handle keyboard keys for navigation between columns
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    
    const { destinations, hotels, inspirations } = getGroupedSuggestions()
    const visibleCols = getVisibleColumns()
    const currentList = selectedColumn === 'destinations' ? destinations : 
                      selectedColumn === 'hotels' ? hotels : inspirations
    
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
        const currentIndex = visibleCols.indexOf(selectedColumn)
        if (currentIndex < visibleCols.length - 1) {
          setSelectedColumn(visibleCols[currentIndex + 1])
          setSelectedIndex(0)
        }
        break
        
      case 'ArrowLeft':
        e.preventDefault()
        const currentIndexLeft = visibleCols.indexOf(selectedColumn)
        if (currentIndexLeft > 0) {
          setSelectedColumn(visibleCols[currentIndexLeft - 1])
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
  
  // Handle click outside component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile) return // On mobile we handle closing with the side sheet
      
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
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])
  
  
  // Close side sheet on mobile
  const closeMobileSideSheet = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
      setIsAnimating(false)
    }, 200) // Animation duration
  }

  const { destinations, hotels, inspirations } = getGroupedSuggestions()
  
  // Determine which columns to show
  const getVisibleColumns = () => {
    const visibleColumns = []
    if (destinations.length > 0) visibleColumns.push('destinations')
    if (hotels.length > 0) visibleColumns.push('hotels')
    if (inspirations.length > 0) visibleColumns.push('inspirations')
    return visibleColumns
  }
  
  const visibleColumns = getVisibleColumns()
  // Mobile first: 1 column on mobile, 2-3 on desktop
  const gridCols = visibleColumns.length === 1 ? 'grid-cols-1' : 
                   visibleColumns.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'

  return (
    <div className="relative flex-1">
      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg focus:border-transparent focus:ring-0 focus:outline-none ${className} remove-clear`}
          autoComplete="off"
        />
        
        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setSuggestions([])
              setShowSuggestions(false)
              inputRef.current?.focus()
              // Call parent component callback if available
              if (onClear) {
                onClear()
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors w-5 h-5 flex items-center justify-center"
          >
            ✕
          </button>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {/* Side Sheet for mobile */}
      {isMobile && showSuggestions && (destinations.length > 0 || hotels.length > 0 || inspirations.length > 0) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-200 ${
              isAnimating ? 'opacity-0' : 'opacity-50'
            }`}
            onClick={closeMobileSideSheet}
          />
          
          {/* Side Sheet */}
          <div 
            ref={sideSheetRef}
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-200 ease-out ${
              isAnimating ? 'translate-y-full' : 'translate-y-0'
            }`}
            style={{ maxHeight: '80vh' }}
          >
            {/* Side sheet header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeMobileSideSheet}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="text-xl">✕</span>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 text-black focus:border-transparent"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Side sheet content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
              <div className="p-4 space-y-6">
                {/* Destinations */}
                {destinations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">Destinations</h3>
                    <div className="space-y-2">
                      {destinations.map((suggestion, index) => (
                        <button
                          key={`dest-${suggestion.id}-${index}`}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-base truncate text-black">
                              {suggestion.text}
                            </div>
                            {suggestion.location && (
                              <div className="text-sm text-gray-500 truncate mt-1">
                                {suggestion.location}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotels */}
                {hotels.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">Hotels</h3>
                    <div className="space-y-2">
                      {hotels.map((suggestion, index) => (
                        <button
                          key={`hotel-${suggestion.id}-${index}`}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-base truncate text-black">
                              {suggestion.text}
                            </div>
                            {suggestion.location && (
                              <div className="text-sm text-gray-500 truncate mt-1">
                                {suggestion.location}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inspirations */}
                {inspirations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">Inspiration</h3>
                    <div className="space-y-2">
                      {inspirations.map((suggestion, index) => (
                        <button
                          key={`insp-${suggestion.id}-${index}`}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-base truncate text-black">
                              {suggestion.text}
                            </div>
                            {suggestion.location && (
                              <div className="text-sm text-gray-500 truncate mt-1">
                                {suggestion.location}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-t-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestions dropdown for desktop */}
      {!isMobile && showSuggestions && (destinations.length > 0 || hotels.length > 0 || inspirations.length > 0) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[400px] overflow-hidden lg:min-w-[900px]"
        >
          <div className={`grid ${gridCols} divide-x divide-gray-200 lg:divide-x`}>
            {/* Destinations Column */}
            {visibleColumns.includes('destinations') && (
              <div className="overflow-y-auto max-h-[400px]">
                <div className="sticky top-0 bg-primary-lighter px-4 py-3 border-b border-primary-lighter">
                  <h3 className="text-sm font-medium text-neutral-darkest">Destinations</h3>
                </div>
                <div className="divide-gray-100">
                  {destinations.map((suggestion, index) => (
                    <button
                      key={`dest-${suggestion.id}-${index}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 min-h-[48px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        selectedColumn === 'destinations' && index === selectedIndex 
                          ? 'bg-primary-lighter text-neutral-darkest' 
                          : 'text-gray-700'
                      }`}
                      onMouseEnter={() => {
                        setSelectedColumn('destinations')
                        setSelectedIndex(index)
                      }}
                    >
                      {/* Contenido de la sugerencia */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm text-black">
                          {suggestion.text}
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
              </div>
            )}

            {/* Hotels Column */}
            {visibleColumns.includes('hotels') && (
              <div className="overflow-y-auto max-h-[400px]">
                <div className="sticky top-0 bg-primary-lightest px-4 py-3 border-b border-primary-lightest">
                  <h3 className="text-sm font-medium text-black">Hotels</h3>
                </div>
                <div className="divide-gray-100">
                  {hotels.map((suggestion, index) => (
                    <button
                      key={`hotel-${suggestion.id}-${index}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 min-h-[48px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        selectedColumn === 'hotels' && index === selectedIndex 
                          ? 'bg-primary-lighter text-neutral-darkest' 
                          : 'text-black'
                      }`}
                      onMouseEnter={() => {
                        setSelectedColumn('hotels')
                        setSelectedIndex(index)
                      }}
                    >
                      {/* Contenido de la sugerencia */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm text-black">
                          {suggestion.text}
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
              </div>
            )}

            {/* Inspirations Column */}
            {visibleColumns.includes('inspirations') && (
              <div className="overflow-y-auto max-h-[400px]">
                <div className="sticky top-0 bg-primary-lighter px-4 py-3 border-b border-primary-lighter">
                  <h3 className="text-sm font-medium text-black">Inspiration</h3>
                </div>
                <div className="divide-gray-100">
                  {inspirations.map((suggestion, index) => (
                    <button
                      key={`insp-${suggestion.id}-${index}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 min-h-[48px] text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        selectedColumn === 'inspirations' && index === selectedIndex 
                          ? 'bg-primary-lighter text-neutral-darkest' 
                          : 'text-black'
                      }`}
                      onMouseEnter={() => {
                        setSelectedColumn('inspirations')
                        setSelectedIndex(index)
                      }}
                    >
                      {/* Contenido de la sugerencia */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm text-black">
                          {suggestion.text}
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
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Message when no results - desktop only */}
      {!isMobile && showSuggestions && !loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 text-center text-gray-500">
          <div className="text-lg mb-2">🔍</div>
          <div className="text-sm">
            No results found for "{value}"
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete 