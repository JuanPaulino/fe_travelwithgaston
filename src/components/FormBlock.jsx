import React, { useState } from 'react';

const FormBlock = ({ data, background = 'light' }) => {
  console.log('FormBlock: Component rendered with data:', data);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Función para obtener clases de ancho
  const getWidthClass = (width = '100') => {
    const widthMap = {
      '100': 'w-full',
      '67': 'w-2/3',
      '50': 'w-1/2',
      '33': 'w-1/3'
    };
    return widthMap[width] || 'w-full';
  };

  // Función para obtener atributos de validación
  const getValidationAttributes = (validation = '') => {
    const attrs = {};
    
    // Verificar que validation no sea null o undefined
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

  // Función para validar un campo
  const validateField = (field, value) => {
    const fieldErrors = [];

    if (field.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${field.label || field.name} es requerido`);
    }

    if (value && field.validation && typeof field.validation === 'string') {
      if (field.validation.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push('Por favor ingresa un email válido');
      }
      if (field.validation.includes('url') && !/^https?:\/\/.+/.test(value)) {
        fieldErrors.push('Por favor ingresa una URL válida');
      }
      if (field.validation.includes('min:')) {
        const minMatch = field.validation.match(/min:(\d+)/);
        if (minMatch && value.length < parseInt(minMatch[1])) {
          fieldErrors.push(`Mínimo ${minMatch[1]} caracteres`);
        }
      }
      if (field.validation.includes('max:')) {
        const maxMatch = field.validation.match(/max:(\d+)/);
        if (maxMatch && value.length > parseInt(maxMatch[1])) {
          fieldErrors.push(`Máximo ${maxMatch[1]} caracteres`);
        }
      }
    }

    return fieldErrors;
  };

  // Función para manejar cambios en los campos
  const handleFieldChange = (fieldName, value, fieldType) => {
    if (fieldType === 'checkbox_group') {
      const currentValues = formData[fieldName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setFormData(prev => ({ ...prev, [fieldName]: newValues }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
    
    // Limpiar errores del campo
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    console.log('FormBlock: handleSubmit called', e);
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});
    debugger;
    // Validar todos los campos
    const newErrors = {};
    let hasErrors = false;

    sortedFields.forEach(field => {
      const value = formData[field.name];
      const fieldErrors = validateField(field, value);
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors[0];
        hasErrors = true;
      }
    });
    console.log(newErrors);
    if (hasErrors) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    console.log(formData);
    console.log(sortedFields);
    try {
      // Enviar formulario usando el endpoint API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: data.form.id,
          formData: formData,
          fields: sortedFields
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({});
        
        // Redirigir si está configurado
        if (data.form.on_success === 'redirect' && data.form.success_redirect_url) {
          window.location.href = data.form.success_redirect_url;
        }
      } else {
        throw new Error(result.error || 'Error en el envío');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ordenar campos por sort - acceder a los campos desde la estructura correcta
  const sortedFields = data.form?.fields?.sort((a, b) => (a.sort || 0) - (b.sort || 0)) || [];

  const backgroundClasses = {
    light: '',
    dark: ''
  };

  return (
    <div className={`form-block py-16 px-4 ${backgroundClasses[background] || backgroundClasses.light}`}>
      <div className="max-w-4xl mx-auto">
        {/* Título del formulario */}
        {data.headline && (
          <h2 className="text-h2 font-heading mb-8 text-center">
            {data.headline}
          </h2>
        )}

        {/* Tagline */}
        {data.tagline && (
          <p className="text-tagline text-center mb-8 text-neutral-DEFAULT">
            {data.tagline}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="form_id" value={data.form.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {sortedFields.map((field) => {
              const widthClass = getWidthClass(field.width);
              const validationAttrs = getValidationAttributes(field.validation);
              const fieldId = `field-${field.id}`;
              const fieldValue = formData[field.name] || '';
              const fieldError = errors[field.name];

              return (
                <div key={field.id} className={`form-field ${widthClass} ${field.type === 'hidden' ? 'hidden' : ''}`}>
                  {/* Campo oculto */}
                  {field.type === 'hidden' ? (
                    <input
                      type="hidden"
                      id={fieldId}
                      name={field.name}
                      value=""
                    />
                  ) : (
                    <div className="field-wrapper">
                      {/* Label */}
                      {field.label && field.type !== 'checkbox' && (
                        <label htmlFor={fieldId} className="block text-sm font-medium mb-2">
                          {field.label}
                          {field.required && <span className="text-secondary-DEFAULT ml-1">*</span>}
                        </label>
                      )}

                      {/* Campo de texto */}
                      {field.type === 'text' && (
                        <input
                          type="text"
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                          {...validationAttrs}
                        />
                      )}

                      {/* Campo de email */}
                      {field.type === 'email' && (
                        <input
                          type="email"
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                          {...validationAttrs}
                        />
                      )}

                      {/* Campo de textarea */}
                      {field.type === 'textarea' && (
                        <textarea
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          placeholder={field.placeholder}
                          required={field.required}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                          {...validationAttrs}
                        />
                      )}

                      {/* Campo de email */}
                      {field.type === 'text' && field.validation && field.validation.includes('email') && (
            <input
              type="email"
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                          {...validationAttrs}
                        />
                      )}

                      {/* Campo de URL */}
                      {field.type === 'text' && field.validation && field.validation.includes('url') && (
                        <input
                          type="url"
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                          {...validationAttrs}
                        />
                      )}

                      {/* Campo de archivo */}
                      {field.type === 'file' && (
                        <input
                          type="file"
                          id={fieldId}
                          name={field.name}
                          onChange={(e) => handleFieldChange(field.name, e.target.files[0], field.type)}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
              }`}
            />
                      )}

                      {/* Campo de select */}
                      {field.type === 'select' && (
                        <select
                          id={fieldId}
                          name={field.name}
                          value={fieldValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                          required={field.required}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            fieldError ? 'border-secondary-DEFAULT' : 'border-neutral-light'
                          }`}
                        >
                          <option value="">Seleccionar...</option>
                          {field.choices?.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.text}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Campo de radio */}
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.choices?.map((choice) => (
                            <label key={choice.value} className="flex items-center">
                              <input
                                type="radio"
                                name={field.name}
                                value={choice.value}
                                checked={fieldValue === choice.value}
                                onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                                required={field.required}
                                className="mr-2 text-primary focus:ring-primary"
                              />
                              <span className="text-sm">{choice.text}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Campo de checkbox individual */}
                      {field.type === 'checkbox' && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            id={fieldId}
                            name={field.name}
                            checked={fieldValue === 'true'}
                            onChange={(e) => handleFieldChange(field.name, e.target.checked ? 'true' : 'false', field.type)}
                            required={field.required}
                            className="mr-2 text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{field.label}</span>
                        </label>
                      )}

                      {/* Campo de checkbox group */}
                      {field.type === 'checkbox_group' && (
                        <div className="space-y-2">
                          {field.choices?.map((choice) => (
                            <label key={choice.value} className="flex items-center">
                              <input
                                type="checkbox"
                                name={`${field.name}[]`}
                                value={choice.value}
                                checked={fieldValue.includes(choice.value)}
                                onChange={(e) => handleFieldChange(field.name, choice.value, field.type)}
                                className="mr-2 text-primary focus:ring-primary"
                              />
                              <span className="text-sm">{choice.text}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Texto de ayuda */}
                      {field.help && (
                        <p className="text-xs text-neutral-DEFAULT mt-1">
                          {field.help}
                        </p>
                      )}

                      {/* Mensaje de error */}
                      {fieldError && (
                        <p className="text-xs text-secondary-DEFAULT mt-1">
                          {fieldError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botón de envío */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : (data.form.submit_label || 'Enviar')}
            </button>
          </div>
        </form>

          {/* Mensajes de estado */}
        {submitStatus === 'success' && data.form.on_success === 'message' && (
          <div className="mt-6 p-4 bg-primary-lightest text-primary-dark rounded-lg text-center">
            {data.form.success_message || '¡Gracias! Tu formulario ha sido enviado correctamente.'}
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-secondary-lightest text-secondary-dark rounded-lg text-center">
              Hubo un error al enviar el formulario. Por favor, intenta de nuevo.
            </div>
          )}
      </div>
    </div>
  );
};

export default FormBlock;