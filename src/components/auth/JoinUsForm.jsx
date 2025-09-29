import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/useAuth';
import { authAPI, handleAPIError } from '../../lib/http';
import worldCities from '../../data/world-cities.json';

const JoinUsForm = ({ onSwitchToSignIn, onStepComplete, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    accountType: 'personal',
    firstName: '',
    lastName: '',
    country: '',
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
  
  // Estados para el autocompletador de países
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(-1);
  const countryInputRef = useRef(null);
  const countryDropdownRef = useRef(null);

  // Usar el hook de autenticación para acceder al store
  const { register } = useAuth();

  // Efecto para filtrar países cuando cambia la búsqueda
  useEffect(() => {
    if (countrySearch.length > 0) {
      const filtered = worldCities.filter(country =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
      ).slice(0, 10); // Limitar a 10 resultados
      setFilteredCountries(filtered);
      setShowCountryDropdown(true);
      setSelectedCountryIndex(-1);
    } else {
      setFilteredCountries([]);
      setShowCountryDropdown(false);
    }
  }, [countrySearch]);

  // Efecto para cerrar el dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target) &&
          countryInputRef.current && !countryInputRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Función para manejar la búsqueda de países
  const handleCountrySearch = (e) => {
    const value = e.target.value;
    setCountrySearch(value);
    setFormData(prev => ({
      ...prev,
      country: value
    }));
  };

  // Función para autocompletar con la primera sugerencia
  const handleCountryInput = (e) => {
    const value = e.target.value;
    setCountrySearch(value);
    setFormData(prev => ({
      ...prev,
      country: value
    }));

    // Si hay sugerencias y el usuario no ha seleccionado una opción específica
    if (filteredCountries.length > 0 && selectedCountryIndex === -1) {
      const firstSuggestion = filteredCountries[0];
      // Solo autocompletar si el valor actual es un prefijo de la primera sugerencia
      if (firstSuggestion.toLowerCase().startsWith(value.toLowerCase()) && value.length > 0) {
        // No autocompletar automáticamente, solo mostrar sugerencias
        setShowCountryDropdown(true);
      }
    }
  };

  // Función para seleccionar un país del dropdown
  const selectCountry = (country) => {
    setCountrySearch(country);
    setFormData(prev => ({
      ...prev,
      country: country
    }));
    setShowCountryDropdown(false);
    setSelectedCountryIndex(-1);
  };

  // Función para manejar la navegación con teclado
  const handleCountryKeyDown = (e) => {
    if (!showCountryDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCountryIndex(prev => 
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCountryIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedCountryIndex >= 0 && selectedCountryIndex < filteredCountries.length) {
          selectCountry(filteredCountries[selectedCountryIndex]);
        } else if (filteredCountries.length > 0) {
          // Si no hay selección específica, tomar la primera opción
          selectCountry(filteredCountries[0]);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (filteredCountries.length > 0) {
          if (selectedCountryIndex >= 0 && selectedCountryIndex < filteredCountries.length) {
            selectCountry(filteredCountries[selectedCountryIndex]);
          } else {
            // Autocompletar con la primera sugerencia
            selectCountry(filteredCountries[0]);
          }
        }
        break;
      case 'Escape':
        setShowCountryDropdown(false);
        setSelectedCountryIndex(-1);
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country of residence is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one lowercase letter. We recommend adding numbers and special characters for better security.';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        country: formData.country,
        email: formData.email,
        password: formData.password,
        newsletter: formData.newsletter,
        whatsapp: formData.whatsapp,
        terms: formData.terms
      });
      
      if (data.success) {
        console.log('User registered successfully');
        
        // Guardar datos en el nano store
        const authData = {
          user: data.data.user,
          token: data.data.token,
          refreshToken: data.data.refreshToken
        };
        
        // Actualizar el store de autenticación
        await register(authData);
        
        // Cerrar el modal si existe la función
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
        
        // Redirigir a la página de checkout usando navegación nativa
        window.location.href = '/checkout';
        
      } else {
        setErrors({ general: data.message || 'Error creating account' });
      }
      
    } catch (error) {
      console.error('Error registering user:', error);
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
              {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-gray-900 mb-3">
          Country of residence*
        </label>
        <div className="relative" ref={countryDropdownRef}>
          <input
            ref={countryInputRef}
            type="text"
            name="country"
            value={countrySearch}
            onChange={handleCountryInput}
            onKeyDown={handleCountryKeyDown}
            onFocus={() => countrySearch.length > 0 && setShowCountryDropdown(true)}
            placeholder="Search for your country worldwide... (Press Tab to autocomplete)"
            className={`w-full h-10 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors ${
              errors.country ? 'border-red-300' : 'border-gray-300'
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-lpignore="true"
            data-form-type="other"
            role="combobox"
            aria-expanded={showCountryDropdown}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Dropdown de países */}
          {showCountryDropdown && filteredCountries.length > 0 && (
            <div 
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
              role="listbox"
              aria-label="Country suggestions"
            >
              {filteredCountries.map((country, index) => (
                <div
                  key={country}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    index === selectedCountryIndex ? 'bg-amber-50 text-amber-700' : ''
                  }`}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setSelectedCountryIndex(index)}
                  role="option"
                  aria-selected={index === selectedCountryIndex}
                >
                  <span className="text-sm">{country}</span>
                  {index === 0 && (
                    <span className="text-xs text-gray-500 ml-2">
                      Press Tab to autocomplete
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
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
            I'd like to receive exclusive travel offers & news from Travel with Gaston.
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
            <a href="/terms-and-conditions" className="underline hover:text-gray-900">
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