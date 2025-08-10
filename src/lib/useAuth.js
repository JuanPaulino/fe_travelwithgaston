import { useEffect, useState } from 'react';
import { authStore, authActions } from './authStore';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.get());

  useEffect(() => {
    // Suscribirse a cambios en el store
    const unsubscribe = authStore.subscribe((state) => {
      setAuthState(state);
    });

    return unsubscribe;
  }, []);

  return {
    // Estado
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    error: authState.error,
    
    // Acciones
    login: authActions.login,
    register: authActions.register,
    logout: authActions.logout,
    clearError: authActions.clearError,
    
    // Utilidades
    checkAuth: authActions.checkAuth
  };
}; 