import React from 'react';
import http from '../../lib/http.js';
import { useAuth } from '../../lib/useAuth.js';
import useProfileUpdate from '../../hooks/useProfileUpdate.js';

const PaymentMethods = () => {
  const { user } = useAuth();
  const { updateProfile, isUpdating, error: profileError } = useProfileUpdate({
    autoUpdate: true, // Actualizar automáticamente al montar el componente
    autoUpdateOnAuth: false // No actualizar automáticamente en autenticación para evitar loops
  });

  const handleStripeRedirect = async () => {
    try {
      const response = await http.post('/api/stripe/billing-portal');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      alert('Error al conectar con el sistema de pagos. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSubscribeToTravelPlan = () => {
    window.location.href = '/checkout';
  };

  // Verificar si el usuario necesita suscribirse
  const needsSubscription = user && 
    user.role === 'basic' && 
    (!user.stripeCustomerId || user.stripeCustomerId === null);

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
        <p className="text-gray-500">
          Manage your payment methods, billing information, and subscription settings.
        </p>
        {isUpdating && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Updating profile...</span>
          </div>
        )}
        {profileError && (
          <div className="mt-4 text-sm text-red-600">
            Error: {profileError}
          </div>
        )}
      </div>
      
      {/* Stripe Billing Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            {needsSubscription ? (
              // Botón de suscripción para usuarios básicos sin Stripe
              <>
                <button
                  onClick={handleSubscribeToTravelPlan}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Subscribe to Travel Plan</span>
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Get access to premium travel features and manage your subscription
                  </p>
                </div>
              </>
            ) : (
              // Botón de portal de facturación para usuarios con Stripe
              <>
                <button
                  onClick={handleStripeRedirect}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Go to Billing Portal</span>
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    You'll be redirected to a secure page to manage your payment information
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Secure payment processing by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
