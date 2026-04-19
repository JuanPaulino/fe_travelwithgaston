// Configuración de la aplicación
export const config = {
  // URLs de la API
  api: {
    baseURL: import.meta.env.PUBLIC_API_URL,
    timeout: 30000
  },
  
  // Configuración de la aplicación
  app: {
    name: 'Travel with Gaston',
    version: '1.0.0'
  },
  
  // Configuración de búsqueda
  search: {
    defaultAdults: 2,
    defaultChildren: 0,
    defaultRooms: 1,
    maxRooms: 10,
    maxAdults: 10,
    maxChildren: 10,
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    /** ISO enviado al API cuando «Hotel currency» deja selectedCurrency vacío */
    defaultCurrency: 'USD'
  },
  stripe: {
    publishableKey: import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY
  }
}

export default config
