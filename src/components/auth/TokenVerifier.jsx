import { useEffect } from 'react';
import { authAPI } from '../../lib/http';
import { authActions } from '../../stores/authStore';

/**
 * Componente para verificar el token de autenticación al cargar la página
 * Si el token está caducado, cierra sesión y muestra el modal de login
 */
const TokenVerifier = () => {
  useEffect(() => {
    const verifyAuthToken = async () => {
      // Solo verificar si hay un token en localStorage
      const token = localStorage.getItem('authtoken');
      
      if (!token || token === 'null' || token === '__NULL__') {
        console.log('No hay token para verificar');
        return;
      }

      try {
        console.log('Verificando token...');
        const response = await authAPI.verifyToken();
        
        if (response.success) {
          console.log('Token válido');
        } else {
          console.log('Token inválido, cerrando sesión...');
          handleTokenExpired();
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
        
        // Si el error es 401 (no autorizado), el token está caducado
        if (error.response?.status === 401) {
          console.log('Token caducado (401), cerrando sesión...');
          handleTokenExpired();
        }
      }
    };

    const handleTokenExpired = () => {
      // Cerrar sesión (limpia el store y localStorage)
      authActions.logout();
      
      // Usar requestAnimationFrame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        console.log('Disparando evento openAuthModal');
        // Abrir el modal de login
        window.dispatchEvent(
          new CustomEvent('openAuthModal', {
            detail: { initialTab: 'signin' }
          })
        );
      });
    };

    // Ejecutar la verificación al montar el componente
    verifyAuthToken();
  }, []); // Solo ejecutar una vez al montar

  // Este componente no renderiza nada
  return null;
};

export default TokenVerifier;
