import React, { useEffect, useState } from 'react'
import { useSearchStore } from '../stores/useSearchStore.js'
import HotelAvailabilityList from './HotelAvailabilityList.jsx'
import HotelsList from './HotelsList.jsx'
import ErrorMessage from './common/ErrorMessage.jsx'
import LoadingSpinner from './common/LoadingSpinner.jsx'
import { isAuthenticated } from '../stores/authStore.js'

const SearchResults = ({ className = '' }) => {
  const { resultsData, executeSearch } = useSearchStore()
  const { hotels, loading, error, lastSearch } = resultsData
  const [hasTriggeredDefaultSearch, setHasTriggeredDefaultSearch] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Solo verificar autenticación después de que el componente esté montado
  const userIsAuthenticated = isMounted ? isAuthenticated() : false

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const triggerDefaultSearch = async () => {
      if (!userIsAuthenticated && !lastSearch && !hasTriggeredDefaultSearch && !loading) {
        setHasTriggeredDefaultSearch(true)
        
        try {
          await executeSearch()
        } catch (error) {
          console.error('Error in default search', error)
        }
      }
    }

    triggerDefaultSearch()
  }, [isMounted, userIsAuthenticated, lastSearch, hasTriggeredDefaultSearch, loading, executeSearch])

  if (loading) {
    return (
      <div className={className}>
        <LoadingSpinner 
          text="Checking you into luxury, one search at a time..." 
          size="xl"
        />
      </div>
    )
  }

  // Mostrar mensaje de bienvenida solo después del montaje y cuando no hay búsqueda previa
  if (!lastSearch && isMounted && (userIsAuthenticated || hasTriggeredDefaultSearch)) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="text-gray-500">
          <p className="text-lg mb-2">Your digital concierge is ready, let's find your perfect room.</p>
          <p className="text-sm">Use the search bar above to find your perfect stay.</p>
        </div>
      </div>
    )
  }

  // Durante la hidratación inicial, mostrar un estado consistente
  if (!isMounted) {
    return (
      <div className={className}>
        <LoadingSpinner 
          text="Checking you into luxury, one search at a time..." 
          size="xl"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          message={error}
          className="text-center py-8"
        />
      </div>
    )
  }

  return (
    <div className={className}>
      {userIsAuthenticated ? (
        <HotelAvailabilityList
          hotels={hotels}
          rooms={lastSearch?.rooms || 1}
        />
      ) : (
        <HotelsList
          hotels={hotels}
        />
      )}
    </div>
  )
}

export default SearchResults
