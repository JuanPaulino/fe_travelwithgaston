import { atom } from 'nanostores'
import { authAPI, userAPI, handleAPIError } from '../lib/http'
import { persistentMap } from '@nanostores/persistent'

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Serializador personalizado para manejar null values correctamente
const serializer = {
  encode: (value) => {
    // Convertir null a string especial para evitar "null" literal
    if (value === null) return '__NULL__'
    return JSON.stringify(value)
  },
  decode: (value) => {
    // Convertir string especial de vuelta a null
    if (value === '__NULL__') return null
    if (value === 'null') return null
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
}

// Store principal de autenticación con serializador personalizado
export const authStore = persistentMap('auth', initialState, serializer)

// Getters para acceder al estado del store
export const getAuthState = () => authStore.get()
export const getToken = () => authStore.get().token
export const getUser = () => authStore.get().user
export const isAuthenticated = () => authStore.get().isAuthenticated

// Helper para obtener refresh token (se mantiene separado por seguridad)
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

// Helper para limpiar refresh token
export const clearRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refreshToken')
  }
}

// Acciones para el store
export const authActions = {
  // Iniciar sesión
  login: async (credentials) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      const payload = await authAPI.login(credentials)
      
      if (payload.success && payload.data?.token) {
        // Actualizar store (el persistentMap se encarga del localStorage)
        const newState = {
          user: payload.data.user,
          token: payload.data.token,
          refreshToken: payload.data.refreshToken,
          isAuthenticated: true,
          loading: false,
          error: null
        }
        
        authStore.set(newState)
        
        // Emitir evento para notificar a otros componentes
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:login', { detail: newState }))
        }
        
        return { success: true, data: payload.data }
      } else {
        const errorMessage = payload.message || 'Error al iniciar sesión'
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Error logging in:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...authStore.get(),
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  },

  // Registrar usuario exitosamente
  register: async (authData) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      // Actualizar store (el persistentMap se encarga del localStorage)
      const newState = {
        user: authData.user,
        token: authData.token,
        refreshToken: authData.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null
      }
      
      authStore.set(newState)
      
      // Emitir evento para notificar a otros componentes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:login', { detail: newState }))
      }
      
      return { success: true, data: authData }
    } catch (error) {
      console.error('Error registering user:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...authStore.get(),
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  },

  // Cerrar sesión
  logout: () => {
    // Limpiar refresh token
    clearRefreshToken()
    
    // Limpiar store (el persistentMap se encarga del localStorage)
    authStore.set(initialState)
    
    // Emitir evento para notificar a otros componentes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
  },

  // Actualizar token (para refresh)
  updateToken: (newToken, newRefreshToken = null) => {
    const currentState = authStore.get()
    const updatedState = {
      ...currentState,
      token: newToken,
      refreshToken: newRefreshToken
    }
    
    if (newRefreshToken) {
      // Si tenemos refresh token, actualizarlo también
      // Nota: refreshToken no está en el store principal, se maneja por separado
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', newRefreshToken)
      }
    }
    
    authStore.set(updatedState)
    
    // Emitir evento para notificar a otros componentes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:tokenUpdated', { detail: { token: newToken } }))
    }
  },

  // Verificar si el usuario está autenticado al cargar la página
  checkAuth: () => {
    const currentState = authStore.get()
    
    // Si ya tenemos un token válido en el store, no hacer nada
    if (currentState.token && currentState.user && currentState.isAuthenticated) {
      return
    }
    
    // Si no hay datos de autenticación, el store ya está en estado inicial
    // (persistentMap se encarga de cargar desde localStorage automáticamente)
  },

  // Limpiar errores
  clearError: () => {
    authStore.set({ ...authStore.get(), error: null })
  },

  // Actualizar perfil del usuario
  updateProfile: async () => {
    const currentState = authStore.get()
    
    if (!currentState.token || !currentState.isAuthenticated) {
      console.warn('No hay token de autenticación para actualizar perfil')
      return { success: false, error: 'No autenticado' }
    }

    try {
      const data = await userAPI.getProfile()
      
      if (data.success && data.data?.user) {
        // Actualizar solo los datos del usuario en el store
        const updatedState = {
          ...currentState,
          user: data.data.user,
          loading: false,
          error: null
        }
        
        authStore.set(updatedState)
        
        // Emitir evento para notificar a otros componentes
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:profileUpdated', { detail: data.data.user }))
        }
        
        return { success: true, data: data.data.user }
      } else {
        const errorMessage = data.message || 'Error al obtener perfil'
        authStore.set({
          ...currentState,
          loading: false,
          error: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...currentState,
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  },

  // Solicitar reseteo de contraseña
  forgotPassword: async (email) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      const response = await authAPI.forgotPassword(email)
      
      if (response.success) {
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: null
        })
        return { success: true, message: response.message }
      } else {
        const errorMessage = response.message || 'Error requesting password reset'
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Error requesting password reset:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...authStore.get(),
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      const response = await authAPI.resetPassword(token, newPassword)
      
      if (response.success) {
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: null
        })
        return { success: true, message: response.message }
      } else {
        const errorMessage = response.message || 'Error resetting password'
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...authStore.get(),
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  },

  // Validar token de reseteo
  validateResetToken: async (token) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      const response = await authAPI.validateResetToken(token)
      
      if (response.success) {
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: null
        })
        return { success: true, data: response.data }
      } else {
        const errorMessage = response.message || 'Invalid reset token'
        authStore.set({
          ...authStore.get(),
          loading: false,
          error: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error('Error validating reset token:', error)
      const errorData = handleAPIError(error)
      authStore.set({
        ...authStore.get(),
        loading: false,
        error: errorData.message
      })
      return { success: false, error: errorData.message }
    }
  }
}

// Inicializar estado al cargar
if (typeof window !== 'undefined') {
  // Escuchar eventos de logout desde el interceptor HTTP
  window.addEventListener('auth:logout', () => {
    console.log('Evento auth:logout recibido, cerrando sesión...')
    authActions.logout()
  })

  // Escuchar eventos de token actualizado desde el interceptor HTTP
  window.addEventListener('auth:tokenUpdated', (event) => {
    console.log('Evento auth:tokenUpdated recibido')
    if (event.detail?.token) {
      authActions.updateToken(event.detail.token)
    }
  })

  // Verificar si hay datos legacy para migrar
  const legacyToken = localStorage.getItem('token')
  const legacyUser = localStorage.getItem('user')
  
  if (legacyToken && legacyUser) {
    // Si hay datos legacy, migrarlos al store
    try {
      const userData = JSON.parse(legacyUser)
      authStore.set({
        user: userData,
        token: legacyToken,
        isAuthenticated: true,
        loading: false,
        error: null
      })
      
      // Limpiar datos legacy
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log('Migrated legacy auth data to store')
    } catch (error) {
      console.error('Error migrating legacy auth data:', error)
      // Limpiar datos corruptos
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  } else {
    // Si no hay datos legacy, solo verificar el estado actual
    authActions.checkAuth()
  }
} 