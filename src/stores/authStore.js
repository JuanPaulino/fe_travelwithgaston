import { atom } from 'nanostores'
import { authAPI, handleAPIError } from './http'

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Store principal de autenticación
export const authStore = atom(initialState)

// Acciones para el store
export const authActions = {
  // Iniciar sesión
  login: async (credentials) => {
    authStore.set({ ...authStore.get(), loading: true, error: null })
    
    try {
      const payload = await authAPI.login(credentials)
      
      if (payload.success && payload.data?.token) {
        // Guardar token y refresh token en localStorage
        localStorage.setItem('token', payload.data.token)
        if (payload.data.refreshToken) {
          localStorage.setItem('refreshToken', payload.data.refreshToken)
        }
        localStorage.setItem('user', JSON.stringify(payload.data.user))
        
        // Actualizar store
        authStore.set({
          user: payload.data.user,
          token: payload.data.token,
          isAuthenticated: true,
          loading: false,
          error: null
        })
        
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
      // Guardar token y refresh token en localStorage
      localStorage.setItem('token', authData.token)
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      localStorage.setItem('user', JSON.stringify(authData.user))
      
      // Actualizar store
      authStore.set({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        loading: false,
        error: null
      })
      
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
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    authStore.set(initialState)
  },

  // Verificar si el usuario está autenticado al cargar la página
  checkAuth: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        authStore.set({
          user: userData,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
        authActions.logout()
      }
    }
  },

  // Limpiar errores
  clearError: () => {
    authStore.set({ ...authStore.get(), error: null })
  }
}

// Inicializar estado al cargar
if (typeof window !== 'undefined') {
  authActions.checkAuth()
} 