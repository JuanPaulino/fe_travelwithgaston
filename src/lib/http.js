import axios from 'axios';
import { config } from '../config/config.js';

// Configuración base de axios
const http = axios.create({
  baseURL: config.api.baseURL,
  // timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token.replaceAll('"', '')}`;
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
      // Verificar si el error es específicamente "Token expirado"
      const errorMessage = error.response?.data?.message;
      const isTokenExpired = errorMessage === 'Token expirado';
      
      // Si es token expirado, no intentar refresh y cerrar sesión directamente
      if (isTokenExpired) {
        console.log('Token expirado detectado, cerrando sesión...');
        
        // Limpiar todos los tokens y datos de autenticación
        localStorage.removeItem('authtoken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Emitir evento para notificar al store de auth
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Redirigir a la página principal si no estamos ya ahí
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }

      // Para otros errores 401, intentar refresh del token
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', {
            refreshToken
          });

          if (response.data.success) {
            localStorage.setItem('authtoken', response.data.data.token);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            
            // Emitir evento para notificar al store de auth sobre la actualización del token
            window.dispatchEvent(new CustomEvent('auth:tokenUpdated', { 
              detail: { 
                token: response.data.data.token,
                refreshToken: response.data.data.refreshToken 
              } 
            }));
            
            // Reintentar la request original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
            return http(originalRequest);
          }
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        localStorage.removeItem('authtoken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Emitir evento para notificar al store de auth
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Redirigir a la página principal si no estamos ya ahí
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
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
  },

  // Solicitar reseteo de contraseña
  forgotPassword: async (email) => {
    const response = await http.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Resetear contraseña
  resetPassword: async (token, newPassword) => {
    const response = await http.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Validar token de reseteo
  validateResetToken: async (token) => {
    const response = await http.get(`/api/auth/validate-reset-token/${token}`);
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

  // Obtener lista de hoteles (endpoint público)
  getHotels: async (searchParams = {}) => {
    try {
      const params = new URLSearchParams()
      
      // Agregar parámetros de paginación
      if (searchParams.page) params.append('page', searchParams.page)
      if (searchParams.per_page) params.append('per_page', searchParams.per_page)
      
      // Agregar parámetros de filtrado
      if (searchParams.location_id) params.append('location_id', searchParams.location_id)
      if (searchParams.inspiration_id) params.append('inspiration_id', searchParams.inspiration_id)
      
      // Agregar arrays de filtros
      if (searchParams.hotel_group_ids) {
        searchParams.hotel_group_ids.forEach(id => params.append('hotel_group_ids[]', id))
      }
      if (searchParams.activities_ids) {
        searchParams.activities_ids.forEach(id => params.append('activities_ids[]', id))
      }
      if (searchParams.family_facilities_ids) {
        searchParams.family_facilities_ids.forEach(id => params.append('family_facilities_ids[]', id))
      }
      if (searchParams.hotel_facilities_ids) {
        searchParams.hotel_facilities_ids.forEach(id => params.append('hotel_facilities_ids[]', id))
      }
      if (searchParams.property_types_ids) {
        searchParams.property_types_ids.forEach(id => params.append('property_types_ids[]', id))
      }
      if (searchParams.location_types_ids) {
        searchParams.location_types_ids.forEach(id => params.append('location_types_ids[]', id))
      }
      if (searchParams.trip_types_ids) {
        searchParams.trip_types_ids.forEach(id => params.append('trip_types_ids[]', id))
      }
      if (searchParams.wellness_ids) {
        searchParams.wellness_ids.forEach(id => params.append('wellness_ids[]', id))
      }

      const response = await http.get(`/api/hotels?${params}`)
      const data = response.data

      // Si la respuesta es exitosa, retornar los resultados
      if (data.success && data.data) {
        return data.data
      }
      
      return []
    } catch (error) {
      console.error('Error getting hotels:', error)
      return []
    }
  },
};

// API de usuarios
export const userAPI = {
  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    const response = await http.get('/api/users/profile');
    return response.data;
  },

  // Actualizar perfil del usuario autenticado
  updateProfile: async (userData) => {
    const response = await http.put('/api/users/profile', userData);
    return response.data;
  },

  // Actualizar usuario por ID (solo admin)
  updateUserById: async (userId, userData) => {
    const response = await http.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  // Cambiar contraseña del usuario autenticado
  changePassword: async (passwordData) => {
    const response = await http.put('/api/users/change-password', passwordData);
    return response.data;
  },

  requestAccountDeletion: async () => {
    const response = await http.put('/api/users/request-delete');
    return response.data;
  }
};

// API de filtros
export const filtersApi = {
  getFilters: () => {
    return http.get('/api/hotels/filters');
  }
};

// API de bookings
export const bookingAPI = {
  // Obtener idempotency key para un booking
  getIdempotencyKey: async (hotelId, checkIn, checkOut) => {
    const response = await http.get('/api/bookings/idempotency-key', {
      params: { hotelId, checkIn, checkOut }
    });
    return response.data;
  },

  // Crear una nueva reserva
  createBooking: async (bookingData) => {
    const response = await http.post('/api/bookings', bookingData);
    return response.data;
  },

  // Obtener reservas del usuario
  getBookings: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await http.get(`/api/bookings?${queryParams}`);
    return response.data;
  },

  // Obtener reserva por ID
  getBookingById: async (id) => {
    const response = await http.get(`/api/bookings/${id}`);
    return response.data;
  },

  // Cancelar reserva
  cancelBooking: async (id) => {
    const response = await http.put(`/api/bookings/${id}/cancel`);
    return response.data;
  }
};

// Función helper para manejar errores
export const handleAPIError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { success: false, message: data.message || 'Invalid data' };
      case 401:
        return { success: false, message: 'Unauthorized' };
      case 403:
        return { success: false, message: 'Access denied' };
      case 404:
        return { success: false, message: 'Resource not found' };
      case 422:
        return { success: false, message: data.message || 'Validation errors' };
      case 500:
        return { success: false, message: 'Internal server error' };
      default:
        return { success: false, message: data.message || 'Unknown error' };
    }
  } else if (error.request) {
    // Error de red
    return { success: false, message: 'Connection error. Check your internet connection.' };
  } else {
    // Error de configuración
    return { success: false, message: 'Configuration error' };
  }
};

export default http; 