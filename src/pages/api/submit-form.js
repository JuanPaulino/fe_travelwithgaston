import { submitForm } from '../../lib/directus.js';

// Utilidades para respuestas HTTP
const createResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Validación de datos de entrada
const validateFormSubmission = ({ formId, formData, fields }) => {
  const errors = [];
  
  if (!formId) errors.push('formId es requerido');
  if (!formData || typeof formData !== 'object') errors.push('formData es requerido');
  if (!fields || !Array.isArray(fields)) errors.push('fields es requerido y debe ser un array');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Manejo de errores centralizado
const handleError = (error, context = 'API endpoint') => {
  console.error(`Error in ${context}:`, error);
  return createResponse({
    success: false,
    error: error.message || 'Error interno del servidor'
  }, 500);
};

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { formId, formData, fields } = body;

    // Validar datos de entrada
    const validation = validateFormSubmission({ formId, formData, fields });
    if (!validation.isValid) {
      return createResponse({
        success: false,
        error: validation.errors.join(', ')
      }, 400);
    }

    // Enviar formulario a Directus
    const result = await submitForm(formId, formData, fields);
    
    return createResponse(result, result.success ? 200 : 400);

  } catch (error) {
    return handleError(error, 'submit-form API');
  }
}
