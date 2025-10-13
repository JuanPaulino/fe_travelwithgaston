import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { authStore, authActions } from '../stores/authStore';
import { authAPI } from '../lib/http';

/**
 * Hook personalizado para manejar la verificación de autenticación y redirección
 * @param {string} redirectTo - URL a la que redirigir si no está autenticado (default: '/')
 * @param {boolean} requireAuth - Si requiere autenticación (default: true)
 */
export const useAuthRedirect = (redirectTo = '/', requireAuth = true) => {
  const authState = useStore(authStore);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Si no requiere autenticación, no hacer nada
      if (!requireAuth) return;

      // Si no hay token, redirigir inmediatamente
      if (!authState.token) {
        console.log('No token, redirecting to:', redirectTo);
        window.location.href = redirectTo;
        return;
      }

      // Si hay token pero no está marcado como autenticado, verificar con el servidor
      try {
        // Configurar el token en localStorage para que el interceptor lo use
        if (typeof window !== 'undefined') {
          localStorage.setItem('authtoken', authState.token);
        }

        // Intentar hacer una petición para verificar si el token es válido
        const response = await authAPI.verifyToken();
        
        if (response.success) {
          // Token válido, actualizar el estado si es necesario
          if (!authState.isAuthenticated) {
            authActions.updateToken(authState.token);
          }
        } else {
          // Token inválido, limpiar y redirigir
          console.log('Token invalid, redirecting to:', redirectTo);
          authActions.logout();
          window.location.href = redirectTo;
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        
        // Si hay error (probablemente 401), el token es inválido
        if (error.status === 401 || error.response?.status === 401) {
          console.log('Token expired (401), redirecting to:', redirectTo);
          authActions.logout();
          window.location.href = redirectTo;
        } else {
          // Otro tipo de error, mantener el estado actual pero mostrar error
          console.error('Error de red verifying authentication:', error);
        }
      }
    };

    checkAuthentication();
  }, [authState.isAuthenticated, authState.token, authState.user, redirectTo, requireAuth]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    error: authState.error
  };
};
