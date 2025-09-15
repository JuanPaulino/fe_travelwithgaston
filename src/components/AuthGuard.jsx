import React from 'react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

/**
 * Componente de protección de rutas que verifica autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar
 * @param {string} props.redirectTo - URL a la que redirigir si no está autenticado
 * @param {boolean} props.requireAuth - Si requiere autenticación (default: true)
 * @param {React.ReactNode} props.fallback - Componente a mostrar mientras se verifica la autenticación
 */
const AuthGuard = ({ 
  children, 
  redirectTo = '/', 
  requireAuth = true,
  fallback = null 
}) => {
  const { isAuthenticated, loading } = useAuthRedirect(redirectTo, requireAuth);

  // Si no requiere autenticación, renderizar los hijos directamente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Mostrar fallback mientras se verifica la autenticación
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el hook se encarga de la redirección)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, renderizar los hijos
  return <>{children}</>;
};

export default AuthGuard;
