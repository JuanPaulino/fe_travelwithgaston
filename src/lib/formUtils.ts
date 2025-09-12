import { FormField, FormValidation } from '../types/form';

// Utilidades para validación de campos
export const getValidationAttributes = (validation = '') => {
  const attrs: Record<string, any> = {};
  
  if (!validation || typeof validation !== 'string') {
    return attrs;
  }
  
  if (validation.includes('email')) {
    attrs.type = 'email';
  }
  if (validation.includes('url')) {
    attrs.type = 'url';
  }
  if (validation.includes('min:')) {
    const minMatch = validation.match(/min:(\d+)/);
    if (minMatch) attrs.minLength = parseInt(minMatch[1]);
  }
  if (validation.includes('max:')) {
    const maxMatch = validation.match(/max:(\d+)/);
    if (maxMatch) attrs.maxLength = parseInt(maxMatch[1]);
  }
  if (validation.includes('length:')) {
    const lengthMatch = validation.match(/length:(\d+)/);
    if (lengthMatch) {
      const length = parseInt(lengthMatch[1]);
      attrs.minLength = length;
      attrs.maxLength = length;
    }
  }
  
  return attrs;
};

// Validar un campo individual
export const validateField = (field: FormField, value: any): string[] => {
  const errors: string[] = [];

  if (field.required && (!value || value.toString().trim() === '')) {
    errors.push(`${field.label || field.name} es requerido`);
  }

  if (value && field.validation && typeof field.validation === 'string') {
    if (field.validation.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push('Por favor ingresa un email válido');
    }
    if (field.validation.includes('url') && !/^https?:\/\/.+/.test(value)) {
      errors.push('Por favor ingresa una URL válida');
    }
    if (field.validation.includes('min:')) {
      const minMatch = field.validation.match(/min:(\d+)/);
      if (minMatch && value.length < parseInt(minMatch[1])) {
        errors.push(`Mínimo ${minMatch[1]} caracteres`);
      }
    }
    if (field.validation.includes('max:')) {
      const maxMatch = field.validation.match(/max:(\d+)/);
      if (maxMatch && value.length > parseInt(maxMatch[1])) {
        errors.push(`Máximo ${maxMatch[1]} caracteres`);
      }
    }
  }

  return errors;
};

// Validar todos los campos del formulario
export const validateForm = (fields: FormField[], formData: Record<string, any>): FormValidation => {
  const errors: FormValidation = {};
  
  fields.forEach(field => {
    const value = formData[field.name];
    const fieldErrors = validateField(field, value);
    
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors[0];
    }
  });
  
  return errors;
};

// Obtener clases de ancho para campos
export const getWidthClass = (width = '100') => {
  const widthMap = {
    '100': 'w-full',
    '67': 'w-2/3',
    '50': 'w-1/2',
    '33': 'w-1/3'
  };
  return widthMap[width as keyof typeof widthMap] || 'w-full';
};

// Obtener clases de fondo para el formulario
export const getBackgroundClasses = (background = 'light') => {
  const backgroundClasses = {
    light: 'bg-neutral-white text-neutral-darker',
    dark: 'bg-neutral-darker text-neutral-white'
  };
  return backgroundClasses[background as keyof typeof backgroundClasses] || backgroundClasses.light;
};

// Ordenar campos por sort
export const sortFields = (fields: FormField[]): FormField[] => {
  return fields.sort((a, b) => (a.sort || 0) - (b.sort || 0));
};

