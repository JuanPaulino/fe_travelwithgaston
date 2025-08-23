import React from 'react';

const PaymentMethods = () => {
  const handleStripeRedirect = async () => {
    try {
      // Aquí irías a tu backend para crear una sesión de Stripe
      // Por ahora simulamos la redirección
      console.log('Redirigiendo a Stripe billing...');
      
      // Simular llamada a API para obtener la URL de Stripe
      // const response = await fetch('/api/stripe/create-billing-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ returnUrl: window.location.href })
      // });
      // const { url } = await response.json();
      
      // Redirigir al usuario a Stripe
      // window.location.href = url;
      
      // Por ahora mostramos un mensaje informativo
      alert('Redirigiendo a Stripe para gestionar tu suscripción y métodos de pago...');
      
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      alert('Error al conectar con el sistema de pagos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
        <p className="text-gray-500">
          Manage your payment methods, billing information, and subscription settings.
        </p>
      </div>
      
      {/* Stripe Billing Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Your Subscription
            </h4>
            <p className="text-gray-600 mb-6">
              Update payment methods, view billing history, and manage your subscription 
              through our secure payment partner.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleStripeRedirect}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
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
