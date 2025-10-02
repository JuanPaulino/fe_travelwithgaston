import { useState, useEffect } from 'react';
import http from '../lib/http.js';
import useProfileUpdate from '../hooks/useProfileUpdate.js';
import { useAuth } from '../lib/useAuth.js';

const ReturnPageComponent = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Hook de autenticación para esperar la hidratación del store
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // Hook para actualizar el perfil del usuario
  const { updateProfile, isUpdating: isProfileUpdating, error: profileError } = useProfileUpdate({
    autoUpdate: false,
    autoUpdateOnAuth: false
  });

  // Esperar a que la autenticación esté lista antes de inicializar
  useEffect(() => {
    // Si aún está cargando la autenticación, esperar
    if (authLoading) {
      return;
    }
    
    // Si no está autenticado, mostrar modal de login y abrirlo automáticamente
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setLoading(false);
      // Abrir modal de autenticación automáticamente
      window.dispatchEvent(new CustomEvent('openAuthModal', { 
        detail: { initialTab: 'signin' } 
      }));
      return;
    }
    
    // Si está autenticado, proceder con la inicialización
    initialize();
  }, [isAuthenticated, authLoading]);

  // Función para manejar el éxito del login
  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    // Reinicializar después del login exitoso
    setIsInitialized(false);
    initialize();
  };

  // Escuchar eventos de autenticación exitosa
  useEffect(() => {
    const handleAuthSuccess = () => {
      if (showAuthModal) {
        handleLoginSuccess();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:login', handleAuthSuccess);
      window.addEventListener('auth:profileUpdated', handleAuthSuccess);
      
      return () => {
        window.removeEventListener('auth:login', handleAuthSuccess);
        window.removeEventListener('auth:profileUpdated', handleAuthSuccess);
      };
    }
  }, [showAuthModal]);

  const initialize = async () => {
    // Prevenir múltiples inicializaciones
    if (isInitialized) return;
    
    try {
      // Verificar que window esté disponible (especialmente importante en móvil)
      if (typeof window === 'undefined') {
        console.warn('Window not available, retrying...');
        setTimeout(initialize, 100);
        return;
      }

      setIsInitialized(true);

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
      const debug = urlParams.get('debug');

      // Modo debug - usar datos mock
      if (debug) {
        const mockData = getMockData(debug);
        setSession(mockData);
        setLoading(false);
        return;
      }

      if (!sessionId) {
        setError('Session ID not found');
        setLoading(false);
        return;
      }

      // Validar formato del session ID
      if (!sessionId.startsWith('cs_')) {
        setError('Invalid session ID format');
        setLoading(false);
        return;
      }

      // PRIMERO: Obtener el estado de la sesión de Stripe
      // Esto puede actualizar stripeCustomerId y role en la BD
      const response = await http.post(`/api/stripe/session-status?session_id=${sessionId}`);
      const responseData = response.data;
      
      console.log('Full response from API:', responseData);
      
      // Manejar la estructura de respuesta del backend
      let sessionData;
      if (responseData.success && responseData.data) {
        // Nueva estructura: { success: true, data: { status, payment_status, customer_email } }
        sessionData = responseData.data;
        console.log('Using new response structure:', sessionData);
      } else {
        // Estructura legacy: directamente el objeto de sesión
        sessionData = responseData;
        console.log('Using legacy response structure:', sessionData);
      }
      
      // Validar que tenemos los datos necesarios
      if (!sessionData || !sessionData.status) {
        console.error('Invalid session data received:', sessionData);
        setError('Invalid session data received');
        setLoading(false);
        return;
      }
      
      setSession(sessionData);
      console.log('Session data set:', sessionData);
      // DESPUÉS: Actualizar el perfil del usuario con los datos actualizados de la BD
      // Esto incluye el stripeCustomerId y role actualizados por el session status
      try {
        await updateProfile();
        console.log('Profile updated after session status check');
      } catch (profileError) {
        console.warn('Profile update failed after session check:', profileError);
        // No fallar si la actualización del perfil falla, ya tenemos la sesión
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error getting session status:', err);
      
      // Manejo específico de errores
      if (err.response?.status === 401) {
        // En lugar de mostrar error, mostrar modal de login y abrirlo automáticamente
        setShowAuthModal(true);
        setLoading(false);
        // Abrir modal de autenticación automáticamente
        window.dispatchEvent(new CustomEvent('openAuthModal', { 
          detail: { initialTab: 'signin' } 
        }));
        return;
      } else if (err.response?.status === 400) {
        setError('Invalid session ID. Please try again.');
      } else if (err.response?.data?.error === 'Invalid session ID') {
        setError('Invalid session ID. Please try again.');
      } else if (err.response?.data?.error === 'Payment service temporarily unavailable') {
        setError('Payment service temporarily unavailable. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Connection error. Please check your internet connection and try again.');
      } else {
        setError('Error verifying payment status. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const getMockData = (debugType) => {
    const mockData = {
      'success': {
        status: 'complete',
        payment_status: 'paid',
        customer_email: 'test@example.com'
      },
      'pending': {
        status: 'open',
        payment_status: 'unpaid'
      },
      'error': {
        status: 'open',
        payment_status: 'failed'
      }
    };

    return mockData[debugType] || mockData['success'];
  };

  const handleRetryPayment = () => {
    window.location.href = '/checkout';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoSearch = () => {
    window.location.href = '/search';
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading || loading || isProfileUpdating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Verifying authentication...' : 
             isProfileUpdating ? 'Updating user profile...' : 
             'Verifying payment status...'}
          </p>
          {profileError && (
            <p className="text-red-600 text-sm mt-2">
              Ups, we have a problem. Please try again later.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Mostrar modal de autenticación si es necesario
  if (showAuthModal) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-primary-lighter border border-primary-lightest text-primary-dark px-6 py-4 mb-6">
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-sm">
              Your session has expired. Please sign in to continue with your payment verification.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                // Disparar evento para abrir modal de autenticación
                window.dispatchEvent(new CustomEvent('openAuthModal', { 
                  detail: { initialTab: 'signin' } 
                }));
              }}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 w-full transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={handleGoHome}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 w-full transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-700 px-4 py-3 mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Could not retrieve session information</p>
          <button
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Manejar la sesión según su estado
  if (session.status === 'open') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-primary-lighter text-black px-4 py-3 mb-6">
            <p className="font-bold">Payment Pending</p>
            <p>The payment was not completed or was cancelled.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-black">
              Payment Status: <span className="font-semibold">{session.payment_status || 'Pending'}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetryPayment}
                className="bg-primary hover:bg-primary/90 text-white py-3 px-6 transition-colors"
              >
                Try Payment Again
              </button>
              
              <button
                onClick={handleGoHome}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session.status === 'complete') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icono de éxito */}
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-lighter mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Título y mensaje */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Completed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your subscription has been activated. You will receive a confirmation email soon.
          </p>

          {/* Detalles del pago */}
          <div className="bg-primary-lighter p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold font-body text-gray-900 mb-3">Payment Details:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-medium">{session.payment_status || 'Paid'}</span>
              </div>
              {session.customer_email && (
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{session.customer_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 transition-colors"
            >
              Go to Home
            </button>
            
            <button
              onClick={handleGoSearch}
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 transition-colors"
            >
              Search Hotels
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado desconocido
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-100 text-gray-700 px-4 py-3 mb-4">
          <p className="font-bold">Unknown Status</p>
          <p>Session status is not recognized: {session.status}</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 w-full"
          >
            Back to Home
          </button>
          
          <button
            onClick={handleRetryPayment}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 w-full"
          >
            Try Payment Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPageComponent;
