import { useState, useEffect } from 'react';
import http from '../lib/http.js';

const ReturnPageComponent = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        setError('No se encontró ID de sesión');
        setLoading(false);
        return;
      }

      // Obtener el estado de la sesión
      const response = await http.post(`/api/stripe/session-status?session_id=${sessionId}`);
      const sessionData = response.data;
      
      setSession(sessionData);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener el estado de la sesión:', err);
      setError('Error al verificar el estado del pago');
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado del pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se pudo obtener información de la sesión</p>
          <button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al inicio
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
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Pago Pendiente</p>
            <p>El pago no se completó o fue cancelado.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Estado del pago: <span className="font-semibold">{session.payment_status || 'Pendiente'}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetryPayment}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Intentar Pago Nuevamente
              </button>
              
              <button
                onClick={handleGoHome}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Volver al Inicio
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
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          {/* Título y mensaje */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pago Completado Exitosamente!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Tu suscripción ha sido activada. Recibirás un correo de confirmación pronto.
          </p>

          {/* Detalles del pago */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Detalles del Pago:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="font-medium text-green-600">Completado</span>
              </div>
              <div className="flex justify-between">
                <span>Estado del Pago:</span>
                <span className="font-medium">{session.payment_status || 'Pagado'}</span>
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Continuar Navegando
            </button>
            
            <button
              onClick={handleGoSearch}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Buscar Hoteles
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado desconocido
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Estado Desconocido</p>
          <p>El estado de la sesión no es reconocido: {session.status}</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Volver al Inicio
          </button>
          
          <button
            onClick={handleRetryPayment}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Intentar Pago Nuevamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPageComponent;
