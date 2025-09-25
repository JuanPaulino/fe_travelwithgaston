import { useState, useEffect } from 'react'
import SearchForm from './SearchForm.jsx'
import SimpleSearchForm from './SimpleSearchForm.jsx'
import { isAuthenticated } from '../stores/authStore.js'

function SearchFormWrapper({ initialData = {}, className = "", isMain = false }) {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount and when auth state changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated()
      setUserIsAuthenticated(authStatus)
      setIsLoading(false)
    }

    // Check initial auth status
    checkAuthStatus()

    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthStatus()
    }

    // Add event listeners for auth state changes
    window.addEventListener('auth:login', handleAuthChange)
    window.addEventListener('auth:logout', handleAuthChange)
    window.addEventListener('auth:tokenUpdated', handleAuthChange)

    return () => {
      window.removeEventListener('auth:login', handleAuthChange)
      window.removeEventListener('auth:logout', handleAuthChange)
      window.removeEventListener('auth:tokenUpdated', handleAuthChange)
    }
  }, [])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center py-8`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render appropriate form based on authentication status
  return (
    <div className={className}>
      {userIsAuthenticated ? (
        // Authenticated users - show full SearchForm with dates, guests, etc.
        <SearchForm 
          initialData={initialData}
          className="w-full"
          isMain={isMain}
        />
      ) : (
        // Non-authenticated users - show simplified SimpleSearchForm
        <SimpleSearchForm 
          initialData={initialData}
          className="w-full max-w-3xl mx-auto"
          placeholder="Where are you going?"
          isMain={isMain}
        />
      )}
    </div>
  )
}

export default SearchFormWrapper
