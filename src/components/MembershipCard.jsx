import React, { useEffect, useState } from 'react'
import { getUser, isAuthenticated as checkIsAuthenticated } from '../stores/authStore'

const MembershipCard = () => {
  const membershipCardImage = "/images/membership_card.png";
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState(false);

  // Verificar estado de autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = getUser();
      const currentAuthStatus = checkIsAuthenticated();
      setUser(currentUser);
      setAuthStatus(currentAuthStatus);
    };

    // Verificar estado inicial
    checkAuthStatus();

    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('auth:login', handleAuthChange);
    window.addEventListener('auth:logout', handleAuthChange);
    window.addEventListener('auth:tokenUpdated', handleAuthChange);

    return () => {
      window.removeEventListener('auth:login', handleAuthChange);
      window.removeEventListener('auth:logout', handleAuthChange);
      window.removeEventListener('auth:tokenUpdated', handleAuthChange);
    };
  }, []);

  const handleSeeMore = () => {
    console.log('See more details clicked');
    // Add your logic here
  };

  const handleSignIn = () => {
    // Disparar evento para abrir modal de autenticación
    window.dispatchEvent(new CustomEvent('openAuthModal', { 
      detail: { initialTab: 'signin' } 
    }));
  };

  const handleBecomeMember = () => {
    if (authStatus && user?.role === 'basic') {
      // Redirigir a checkout si está autenticado y tiene rol basic
      window.location.href = '/checkout';
    } else {
      // Disparar evento para abrir modal de autenticación con tab de registro
      window.dispatchEvent(new CustomEvent('openAuthModal', { 
        detail: { initialTab: 'join' } 
      }));
    }
  };

  return (
    <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg border border-neutral-lighter overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Membership Card */}
        <div className="lg:w-1/3 p-[18px] flex items-center justify-center">
          <img
            src={membershipCardImage}
            alt="Travel with Gaston Membership Card"
            className="w-full max-h-[250px] object-contain rounded-2xl shadow-lg"
          />
        </div>

        {/* Right side - Content */}
        <div className="lg:w-2/3 p-[18px] flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="font-heading text-[27px] text-neutral-darkest mb-4 leading-tight">
              Unlock Your Journey: Choose Your Membership
            </h1>

            <p className="text-sm text-neutral-light mb-0 leading-relaxed">
              Gain access to exclusive member-only rates, priority upgrades, and flexible booking options.
            </p>

            <p className="text-sm text-neutral-light mb-2 leading-relaxed">
              Select a membership plan to enhance every aspect of your travel.
            </p>

            {/* Botón See more details - oculto por ahora */}
            {false && (
              <button 
                className="text-primary text-sm font-medium hover:text-primary-dark transition-colors"
                onClick={handleSeeMore}
              >
                See more details
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8">
              {/* Mostrar botones cuando NO está autenticado */}
              {!authStatus && (
                <>
                  {/* Botón principal Join Us - más destacado */}
                  <button 
                    className="bg-black hover:bg-primary text-white px-8 py-3 text-base font-semibold transition-colors shadow-md hover:shadow-lg"
                    onClick={handleBecomeMember}
                  >
                    Join Us
                  </button>
                  
                  {/* Botón secundario Sign In - menos destacado */}
                  <p className="text-neutral-DEFAULT text-xs">
                    Already a member? 
                    <button 
                      className="ml-1 text-neutral-darkest font-medium hover:text-neutral-dark transition-colors underline"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                  </p>
                </>
              )}

              {/* Mostrar botón Become a member si está autenticado y tiene rol basic */}
              {authStatus && user?.role === 'basic' && (
                <button 
                  className="bg-neutral-darkest hover:bg-neutral-dark text-white px-8 py-3 text-base font-medium transition-colors"
                  onClick={handleBecomeMember}>
                  Become a member
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
