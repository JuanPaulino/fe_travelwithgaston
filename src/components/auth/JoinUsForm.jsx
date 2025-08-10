import { useState } from 'react';
import { useAuth } from '../../lib/useAuth';
import { authAPI, handleAPIError } from '../../lib/http';

const JoinUsForm = ({ onSwitchToSignIn, onStepComplete }) => {
  const [formData, setFormData] = useState({
    accountType: 'personal',
    firstName: '',
    lastName: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    whatsapp: false,
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Usar el hook de autenticación para acceder al store
  const { register } = useAuth();

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
    
    if (!formData.accountType) {
      newErrors.accountType = 'El tipo de cuenta es requerido';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad de residencia es requerida';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'Please accept the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const data = await authAPI.register({
        accountType: formData.accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city,
        email: formData.email,
        password: formData.password,
        newsletter: formData.newsletter,
        whatsapp: formData.whatsapp,
        terms: formData.terms
      });
      
      if (data.success) {
        console.log('Usuario registrado exitosamente');
        
        // Guardar datos en el nano store
        const authData = {
          user: data.data.user,
          token: data.data.token,
          refreshToken: data.data.refreshToken
        };
        
        // Actualizar el store de autenticación
        await register(authData);
        
        // Continuar con el siguiente paso del proceso de registro
        if (onStepComplete) {
          onStepComplete({
            step: 'details',
            userData: data.data.user,
            completed: true
          });
        }
        
      } else {
        setErrors({ general: data.message || 'Error al crear la cuenta' });
      }
      
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const errorData = handleAPIError(error);
      setErrors({ general: errorData.message });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          Type of account*
        </label>
        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              name="accountType"
              value="personal"
              checked={formData.accountType === 'personal'}
              onChange={handleInputChange}
              className="w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 focus:ring-amber-400 focus:ring-2"
            />
            <label className="ml-2 font-body text-sm text-gray-700">
              Personal
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="accountType"
              value="business"
              checked={formData.accountType === 'business'}
              onChange={handleInputChange}
              className="w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 focus:ring-amber-400 focus:ring-2"
            />
            <label className="ml-2 font-body text-sm text-gray-700">
              Business
            </label>
          </div>
        </div>
        {errors.accountType && (
          <p className="mt-1 text-sm text-red-600">{errors.accountType}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
            First name*
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="*required"
            className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
            Last name*
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="*required"
            className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          Email*
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
            Confirm Password*
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="*required"
              className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          City of residence*
        </label>
        <div className="relative">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="*required"
            className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleInputChange}
            className="w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 rounded focus:ring-amber-400 focus:ring-2"
          />
          <label className="ml-3 font-body text-sm text-gray-700">
            (newsletter)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="whatsapp"
            checked={formData.whatsapp}
            onChange={handleInputChange}
            className="w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 rounded focus:ring-amber-400 focus:ring-2"
          />
          <label className="ml-3 font-body text-sm text-gray-700">
            I agree to being contacted via WhatsApp
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleInputChange}
            className={`w-4 h-4 text-amber-400 bg-gray-100 border-gray-300 rounded focus:ring-amber-400 focus:ring-2 mt-0.5 ${
              errors.terms ? 'border-red-300' : ''
            }`}
          />
          <label className="ml-3 font-body text-sm text-gray-700">
            I accept Travel with Gastón{' '}
            <a href="#" className="underline hover:text-gray-900">
              Terms & Conditions
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Continue'}
      </button>
    </form>
  );
};

export default JoinUsForm; 