import { useEffect, useState } from 'react';
import { isAuthenticated, authActions } from '../stores/authStore';
import CurrencyDropdown from './CurrencyDropdown';

const AuthActions = ({ className = '', onButtonClick = null }) => {
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
      window.dispatchEvent(new CustomEvent('openAuthModal', { 
        detail: { initialTab: action } 
      }));
    }
  };

  const handleLogout = () => {
    authActions.logout();
  };

  if (authenticated) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <CurrencyDropdown />
        <a 
          href="/account"
          className="border border-neutral-light text-black hover:border-primary transition-colors px-3 py-1"
        >
          Account
        </a>
        <button 
          onClick={handleLogout}
          className="text-neutral hover:text-primary transition-colors px-4 py-1.5"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button 
        onClick={() => handleButtonClick('join')}
        className="text-neutral hover:text-primary transition-colors px-3 py-1 rounded"
      >
        Join us
      </button>
      <button 
        onClick={() => handleButtonClick('signin')}
        className="bg-black text-white px-4 py-1.5 rounded hover:bg-primary transition-colors"
      >
        Sign in
      </button>
    </div>
  );
};

export default AuthActions;
