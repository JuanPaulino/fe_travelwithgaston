import { useEffect, useState } from 'react';
import { authStore, authActions } from '../stores/authStore';

export const useAuth = () => {
  const [authState, setAuthState] = useState(authStore.get());

  useEffect(() => {
    // Suscribirse a cambios en el store
    const unsubscribe = authStore.subscribe((state) => {
      // Asegurar que null values no sean strings
      const cleanState = {
        user: state.user === 'null' ? null : state.user,
        token: state.token === 'null' ? null : state.token,
        isAuthenticated: state.isAuthenticated === 'null' ? false : state.isAuthenticated,
        loading: state.loading === 'null' ? false : state.loading,
        error: state.error === 'null' ? null : state.error
      };
      setAuthState(cleanState);
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
    updateProfile: authActions.updateProfile,
    
    // Forgot password actions
    forgotPassword: authActions.forgotPassword,
    resetPassword: authActions.resetPassword,
    validateResetToken: authActions.validateResetToken,
    
    // Utilidades
    checkAuth: authActions.checkAuth
  };
}; 