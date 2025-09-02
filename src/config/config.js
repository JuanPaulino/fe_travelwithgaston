// Configuración de la aplicación
console.log(import.meta.env.PUBLIC_API_URL);
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
    defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY || 'EUR',
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'es'
  }
}

export default config
