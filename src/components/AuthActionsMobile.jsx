import { useEffect, useState } from 'react';
import { isAuthenticated, authActions } from '../stores/authStore';

const AuthActionsMobile = ({ onButtonClick = null, onCloseMenu = null }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar estado inicial
    setAuthenticated(isAuthenticated());
    
    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = () => {
      setAuthenticated(isAuthenticated());
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

  const handleButtonClick = (action) => {
    if (onButtonClick) {
      onButtonClick(action);
    } else {
      // Fallback: dispatch the same event that the original code was using
      window.dispatchEvent(new CustomEvent('openAuthModal'));
    }
    
    // Try to close mobile menu by dispatching a custom event
    window.dispatchEvent(new CustomEvent('closeMobileMenu'));
  };

  const handleLogout = () => {
    authActions.logout();
    // Cerrar menú móvil después del logout
    window.dispatchEvent(new CustomEvent('closeMobileMenu'));
  };

  if (authenticated) {
    return (
      <div className="flex flex-col gap-4">
        <a 
          href="/account"
          className="border border-neutral-light text-black hover:border-primary transition-colors px-3 py-1 w-max"
        >
          Account
        </a>
        <button 
          onClick={handleLogout}
          className="text-neutral hover:text-primary transition-colors px-4 py-1.5 w-max"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => handleButtonClick('join')}
        className="text-left text-neutral hover:text-primary transition-colors px-3 py-2 rounded text-base w-max bg-white border border-neutral-light"
      >
        Join us
      </button>
      <button 
        onClick={() => handleButtonClick('signin')}
        className="text-left hover:text-primary transition-colors px-3 py-2 rounded text-base w-max bg-black text-white border border-black"
      >
        Sign in
      </button>
    </div>
  );
};

export default AuthActionsMobile;
