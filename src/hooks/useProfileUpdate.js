import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../lib/useAuth';

/**
 * Hook personalizado para manejar la actualización del perfil del usuario
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoUpdate - Si debe actualizar automáticamente al montar el componente
 * @param {boolean} options.autoUpdateOnAuth - Si debe actualizar automáticamente cuando el usuario se autentica
 * @returns {Object} Objeto con estado y funciones para manejar la actualización del perfil
 */
const useProfileUpdate = (options = {}) => {
  const { autoUpdate = false, autoUpdateOnAuth = false } = options;
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Función para actualizar el perfil
  const handleUpdateProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Usuario no autenticado');
      return { success: false, error: 'Usuario no autenticado' };
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateProfile();
      
      if (result.success) {
        setLastUpdate(new Date());
        setError(null);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated, updateProfile]);

  // Actualizar automáticamente al montar el componente si está configurado
  useEffect(() => {
    if (autoUpdate && isAuthenticated) {
      handleUpdateProfile();
    }
  }, [autoUpdate, isAuthenticated]); // Removido handleUpdateProfile de las dependencias

  // Actualizar automáticamente cuando el usuario se autentica si está configurado
  useEffect(() => {
    if (autoUpdateOnAuth && isAuthenticated && user) {
      handleUpdateProfile();
    }
  }, [autoUpdateOnAuth, isAuthenticated, user]); // Removido handleUpdateProfile de las dependencias

  // Escuchar eventos de actualización de perfil desde otros componentes
  useEffect(() => {
    const handleProfileUpdated = (event) => {
      setLastUpdate(new Date());
      setError(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:profileUpdated', handleProfileUpdated);
      return () => {
        window.removeEventListener('auth:profileUpdated', handleProfileUpdated);
      };
    }
  }, []);

  return {
    // Estado
    isUpdating,
    lastUpdate,
    error,
    user,
    isAuthenticated,
    
    // Funciones
    updateProfile: handleUpdateProfile,
    
    // Utilidades
    clearError: () => setError(null)
  };
};

export default useProfileUpdate;
