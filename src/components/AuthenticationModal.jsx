import { useState, useEffect } from 'react';
import SignInForm from './SignInForm';
import JoinUsForm from './JoinUsForm';

const AuthenticationModal = ({ isOpen, onClose }) => {
  const [currentTab, setCurrentTab] = useState('signin');

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const switchTab = (tab) => {
    setCurrentTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50 p-4" 
      onClick={handleModalOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-[900px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <img src="/close.png" alt="Close" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Travel with Gaston" />
            </div>
            <p className="font-body text-sm text-gray-600">Core message or value proposition</p>
          </div>

          {/* Tabs */}
          <div className="flex mt-8 border-b border-gray-200">
            <button
              onClick={() => switchTab('signin')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentTab === 'signin'
                  ? 'text-gray-900 border-b-2 border-amber-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => switchTab('joinus')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentTab === 'joinus'
                  ? 'text-gray-900 border-b-2 border-amber-400'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Join us
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentTab === 'signin' ? (
            <SignInForm onSwitchToSignUp={() => switchTab('joinus')} />
          ) : (
            <JoinUsForm onSwitchToSignIn={() => switchTab('signin')} />
          )}
        </div>

        {/* Footer link - solo mostrar en el tab de signin */}
        {currentTab === 'signin' && (
          <div className="p-8 pt-0 text-center">
            <p className="font-body text-sm text-gray-600">
              Not a member?{' '}
              <button
                onClick={() => switchTab('joinus')}
                className="text-amber-400 hover:text-amber-600 font-medium transition-colors"
              >
                Join now
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationModal; 