import { useState } from 'react';

const PasswordResetSuccess = ({ onBackToSignIn }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleBackToSignIn = () => {
    setIsRedirecting(true);
    if (onBackToSignIn) {
      onBackToSignIn();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4">
          <svg className="h-6 w-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-black mb-2">Password updated successfully!</h3>
        
        <p className="text-sm text-black mb-6">
          Your password has been updated successfully. You can now sign in with your new password.
        </p>

        <div className="bg-primary-lightest border border-primary-light rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary-light" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-black">Security confirmation</h3>
              <div className="mt-2 text-sm text-black">
                <p>We've sent a confirmation email to notify you about this password change.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleBackToSignIn}
          disabled={isRedirecting}
          className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting ? 'Redirecting...' : 'Sign in with new password'}
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-black">
          Didn't make this change? Please contact our support team immediately.
        </p>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
