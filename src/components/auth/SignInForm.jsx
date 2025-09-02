import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { handleAPIError } from '../../lib/http';

const SignInForm = ({ onLoginSuccess }) => {
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
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
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
        console.log('Sesión iniciada exitosamente');
        // Cerrar el modal cuando el login sea exitoso
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrors({ general: result.error });
      }
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const errorData = handleAPIError(error);
      setErrors({ general: errorData.message });
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
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
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
        <a href="#" className="font-body text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-4 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Iniciando sesión...' : 'Sign in'}
      </button>
    </form>
  );
};

export default SignInForm; 