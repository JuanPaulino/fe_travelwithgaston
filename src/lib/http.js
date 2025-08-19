import axios from 'axios';
import { config } from '../config/config.js';

// Configuración base de axios
const http = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken
          });

          if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            
            // Reintentar la request original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
            return http(originalRequest);
          }
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Aquí podrías emitir un evento para notificar al store de auth
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }

    return Promise.reject(error);
  }
);

// API de autenticación
export const authAPI = {
  // Registrar usuario
  register: async (userData) => {
    const response = await http.post('/api/auth/register', userData);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await http.post('/api/auth/login', credentials);
    return response.data;
  },

  // Cerrar sesión
  logout: async () => {
    const response = await http.post('/api/auth/logout');
    return response.data;
  },

  // Refrescar token
  refreshToken: async (refreshToken) => {
    const response = await http.post('/api/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await http.get('/api/auth/verify');
    return response.data;
  }
};

export const hotelsApi = {
  // search
  search: async (query, limit = 10) => {
    try {
      const params = new URLSearchParams()
      
      if (query) params.append('query', query)
      if (limit) params.append('limit', limit)

      const response = await http.get(`/api/hotels/search?${params}`)
      const data = response.data

      // Si la respuesta es exitosa, retornar los resultados
      if (data.success && data.data) {
        return data.data
      }
      
      return []
    } catch (error) {
      console.error('Error searching:', error)
      return []
    }
  },

  // Buscar destinos para obtener location_id
  searchDestinations: async (query) => {
    try {
      const response = await http.get(`/api/hotels/search?query=${encodeURIComponent(query)}&limit=5`)
      const data = response.data

      if (data.success && data.data) {
        return data.data
      }
      
      return []
    } catch (error) {
      console.error('Error searching destinations:', error)
      return []
    }
  },

  // Obtener disponibilidad de hoteles
  getAvailability: async (searchParams) => {
    try {
      const response = await http.post('/api/hotels/availability', searchParams)
      const data = response.data

      // Si la respuesta es exitosa, retornar los resultados
      if (data.success && data.data) {
        return data.data
      }
      
      return []
    } catch (error) {
      console.error('Error getting hotel availability:', error)
      throw error // Re-lanzar el error para manejarlo en el store
    }
  },

  // Obtener hotel por ID (endpoint público)
  getHotelById: async (id) => {
    try {
      // Usar axios directamente sin interceptores para endpoints públicos
      const response = await axios.get(`${config.api.baseURL}/api/hotels/${id}`)
      const data = response.data

      // Si la respuesta es exitosa, retornar los datos del hotel
      if (data.success && data.data) {
        return data.data
      }
      
      return null
    } catch (error) {
      console.error('Error getting hotel by ID:', error)
      return null
    }
  },
};
"ReferenceError: localStorage is not defined\n    at eval (/Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/src/lib/http.js:22:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async Axios.request (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/axios/lib/core/Axios.js:40:14)\n    at async Object.getHotelById (/Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/src/lib/http.js:171:24)\n    at async eval (/Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/src/pages/hotels/[id_hotel].astro:37:17)\n    at async callComponentAsTemplateResultOrResponse (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/runtime/server/render/astro/render.js:91:25)\n    at async renderToAsyncIterable (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/runtime/server/render/astro/render.js:133:26)\n    at async renderPage (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/runtime/server/render/page.js:36:24)\n    at async lastNext (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/core/render-context.js:198:25)\n    at async callMiddleware (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/core/middleware/callMiddleware.js:11:10)\n    at async RenderContext.render (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/core/render-context.js:232:22)\n    at async handleRoute (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/vite-plugin-astro-server/route.js:178:16)\n    at async run (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/vite-plugin-astro-server/request.js:40:14)\n    at async runWithErrorHandling (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/vite-plugin-astro-server/controller.js:64:5)\n    at async handleRequest (file:///Users/juanfranciscopaulinoveras/Documents/projects/travelwithgaston/fe_traverwithgaston/node_modules/astro/dist/vite-plugin-astro-server/request.js:34:3)"// Función helper para manejar errores
export const handleAPIError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { success: false, message: data.message || 'Datos inválidos' };
      case 401:
        return { success: false, message: 'No autorizado' };
      case 403:
        return { success: false, message: 'Acceso denegado' };
      case 404:
        return { success: false, message: 'Recurso no encontrado' };
      case 422:
        return { success: false, message: data.message || 'Datos de validación incorrectos' };
      case 500:
        return { success: false, message: 'Error interno del servidor' };
      default:
        return { success: false, message: data.message || 'Error desconocido' };
    }
  } else if (error.request) {
    // Error de red
    return { success: false, message: 'Error de conexión. Verifica tu conexión a internet.' };
  } else {
    // Error de configuración
    return { success: false, message: 'Error de configuración' };
  }
};

export default http; 