import { useState, useEffect } from 'react';
import { authStore } from '../stores/authStore';

const CreditCardForm = ({ onCreditCardChange, className = '' }) => {
  // Nota: Todos los campos tienen autocompletado excepto CVC por seguridad
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    cvc: '',
    brand_name: '',
    exp_month: '',
    exp_year: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Obtener nombre del usuario autenticado
  useEffect(() => {
    const authState = authStore.get();
    if (authState.user?.name) {
      setFormData(prev => ({
        ...prev,
        name: authState.user.name
      }));
    }
  }, []);

  // Detectar marca de tarjeta basada en el número
  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'VISA';
    if (/^5[1-5]/.test(cleanNumber)) return 'MASTERCARD';
    if (/^3[47]/.test(cleanNumber)) return 'AMEX';
    if (/^6/.test(cleanNumber)) return 'DISCOVER';
    
    return '';
  };

  // Validar número de tarjeta
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
  };

  // Validar CVC
  const validateCVC = (cvc, brand) => {
    const length = brand === 'AMEX' ? 4 : 3;
    return /^\d+$/.test(cvc) && cvc.length === length;
  };

  // Validar fecha de expiración
  const validateExpiration = (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expMonth < 1 || expMonth > 12) return false;
    
    return true;
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    const formatted = cleanValue.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    
    // Marcar el campo como tocado
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    if (field === 'number') {
      processedValue = formatCardNumber(value);
      const brand = detectCardBrand(processedValue);
      setFormData(prev => ({
        ...prev,
        [field]: processedValue,
        brand_name: brand
      }));
    } else if (field === 'exp_month' || field === 'exp_year') {
      processedValue = value.replace(/\D/g, '');
      if (field === 'exp_month' && processedValue.length > 2) {
        processedValue = processedValue.slice(0, 2);
      }
      if (field === 'exp_year' && processedValue.length > 4) {
        processedValue = processedValue.slice(0, 4);
      }
      setFormData(prev => ({
        ...prev,
        [field]: processedValue
      }));
    } else if (field === 'cvc') {
      processedValue = value.replace(/\D/g, '');
      const maxLength = formData.brand_name === 'AMEX' ? 4 : 3;
      processedValue = processedValue.slice(0, maxLength);
      setFormData(prev => ({
        ...prev,
        [field]: processedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number || !validateCardNumber(formData.number)) {
      newErrors.number = 'Invalid card number';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    if (!formData.cvc || !validateCVC(formData.cvc, formData.brand_name)) {
      newErrors.cvc = 'Invalid CVC';
    }

    if (!formData.exp_month || !formData.exp_year || !validateExpiration(formData.exp_month, formData.exp_year)) {
      newErrors.expiration = 'Invalid expiration date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar un campo específico solo si ha sido tocado
  const validateField = (field) => {
    if (!touched[field]) return true; // No validar si no ha sido tocado

    switch (field) {
      case 'number':
        return formData.number && validateCardNumber(formData.number);
      case 'name':
        return formData.name.trim() !== '';
      case 'cvc':
        return formData.cvc && validateCVC(formData.cvc, formData.brand_name);
      case 'expiration':
        return formData.exp_month && formData.exp_year && validateExpiration(formData.exp_month, formData.exp_year);
      default:
        return true;
    }
  };

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onCreditCardChange) {
      const creditCardData = {
        number: formData.number.replace(/\s/g, ''),
        name: formData.name,
        cvc: formData.cvc,
        brand_name: formData.brand_name,
        exp_month: parseInt(formData.exp_month) || null,
        exp_year: parseInt(formData.exp_year) || null
      };
      
      onCreditCardChange(creditCardData, validateForm());
    }
  }, [formData, onCreditCardChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit card details</h3>
      
      {/* Número de tarjeta */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cc-number"
          value={formData.number}
          onChange={(e) => handleInputChange('number', e.target.value)}
          placeholder="1234 5678 9012 3456"
          autoComplete="cc-number"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.number && touched.number ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={19}
        />
        {errors.number && touched.number && (
          <p className="text-red-500 text-xs mt-1">{errors.number}</p>
        )}
        {formData.brand_name && (
          <p className="text-green-600 text-xs mt-1">Card brand detected: {formData.brand_name}</p>
        )}
      </div>

      {/* Nombre del titular */}
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder name
        </label>
        <input
          type="text"
          id="cardName"
          name="cc-name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          autoComplete="cc-name"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && touched.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Fecha de expiración y CVC */}
      <div className="grid grid-cols-2 gap-4">
        {/* Fecha de expiración */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiration date
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="cc-exp-month"
              value={formData.exp_month}
              onChange={(e) => handleInputChange('exp_month', e.target.value)}
              placeholder="MM"
              autoComplete="cc-exp-month"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiration && (touched.exp_month || touched.exp_year) ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={2}
            />
            <input
              type="text"
              name="cc-exp-year"
              value={formData.exp_year}
              onChange={(e) => handleInputChange('exp_year', e.target.value)}
              placeholder="YYYY"
              autoComplete="cc-exp-year"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expiration && (touched.exp_month || touched.exp_year) ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={4}
            />
          </div>
          {errors.expiration && (touched.exp_month || touched.exp_year) && (
            <p className="text-red-500 text-xs mt-1">{errors.expiration}</p>
          )}
        </div>

        {/* CVC code */}
        <div>
          <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-1">
            CVC code
          </label>
          <input
            type="text"
            id="cardCVC"
            name="cc-csc"
            value={formData.cvc}
            onChange={(e) => handleInputChange('cvc', e.target.value)}
            placeholder={formData.brand_name === 'AMEX' ? '1234' : '123'}
            autoComplete="off"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cvc && touched.cvc ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={4}
          />
          {errors.cvc && touched.cvc && (
            <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
          )}
        </div>
      </div>

      {/* Security information */}
      <div className="bg-primary/10 border border-primary rounded-md p-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-primary">
              Your card data is protected with SSL encryption. We do not store credit card information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
