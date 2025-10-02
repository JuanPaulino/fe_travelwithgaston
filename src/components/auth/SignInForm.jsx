import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { handleAPIError } from '../../lib/http';

const SignInForm = ({ onLoginSuccess, onShowForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepSignedIn: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Usar el hook de autenticación
  const { login, loading, error, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Limpiar errores previos
    setErrors({});
    clearError();
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        console.log('Session started successfully');
        // Close the modal when the login is successful
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (error) {
      console.error('Error starting session:', error);
      const errorData = handleAPIError(error);
      setErrors({ general: 'Ups, we have a problem. Please try again later.' });
    }
  };

  // Escuchar cambios en el error del store
  useEffect(() => {
    if (error && !errors.general) {
      setErrors({ general: error });
    }
  }, [error, errors.general]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {(errors.general || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {errors.general || error}
        </div>
      )}
      
      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          Email address*
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="*required"
          className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          Password*
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="*required"
            className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="keepSignedIn"
            checked={formData.keepSignedIn}
            onChange={handleInputChange}
            className="w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 rounded focus:ring-amber-400 focus:ring-2"
          />
          <label className="ml-3 font-body text-sm text-gray-700">
            Keep me signed in
          </label>
        </div>
        <button
          type="button"
          onClick={onShowForgotPassword}
          className="font-body text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default SignInForm; 