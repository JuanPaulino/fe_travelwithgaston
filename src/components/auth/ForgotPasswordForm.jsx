import { useState } from 'react';
import { authAPI } from '../../lib/http';
import { handleAPIError } from '../../lib/http';

const ForgotPasswordForm = ({ onBackToSignIn, onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        setSuccess(true);
        if (onEmailSent) {
          onEmailSent(email);
        }
      } else {
        setError(response.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      const errorData = handleAPIError(err);
      setError(errorData.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (success) {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your email and click the link to reset your password.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            The link will expire in 1 hour for security reasons.
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onBackToSignIn}
            className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Back to Sign In
          </button>
          
          <button
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Send another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
        <p className="text-sm text-gray-600">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
            Email address*
          </label>
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
          
          <button
            type="button"
            onClick={onBackToSignIn}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back to Sign In
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Remember your password?{' '}
          <button
            onClick={onBackToSignIn}
            className="text-gray-700 hover:text-gray-900 font-medium underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
