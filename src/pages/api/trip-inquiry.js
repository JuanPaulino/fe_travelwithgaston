// Endpoint para el formulario de consulta de viajes
// src/pages/api/trip-inquiry.js

// Utilidades para respuestas HTTP
const createResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

// Validación de datos de entrada
const validateTripInquiry = (formData) => {
  const errors = [];
  
  // Campos requeridos
  const requiredFields = ['name', 'surname', 'email', 'city', 'country', 'destination'];
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors.push(`${field} es requerido`);
    }
  });
  
  // Validar email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Email inválido');
  }
  
  // Validar fechas si están presentes
  if (formData.startDate && formData.returnDate) {
    const startDate = new Date(formData.startDate);
    const returnDate = new Date(formData.returnDate);
    
    if (returnDate <= startDate) {
      errors.push('La fecha de regreso debe ser posterior a la fecha de salida');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Función para enviar al webhook de Travel with Gaston
const sendToWebhook = async (formData) => {
  const webhookUrl = 'https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    console.log('Respuesta del webhook - Status:', response.status);
    console.log('Respuesta del webhook - Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      console.log('Respuesta del webhook - Content-Type:', contentType);
      console.log('Respuesta del webhook - Body:', responseText);
      
      let result = null;
      
      // Intentar parsear como JSON solo si hay contenido y es JSON
      if (responseText && responseText.trim() !== '') {
        if (contentType && contentType.includes('application/json')) {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            console.warn('No se pudo parsear la respuesta como JSON:', parseError.message);
            result = { message: responseText, raw: true };
          }
        } else {
          result = { message: responseText, raw: true };
        }
      } else {
        // Respuesta vacía pero exitosa
        result = { message: 'Formulario procesado correctamente', empty: true };
      }
      
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.error('Error del webhook:', response.status, response.statusText, errorText);
      return { 
        success: false, 
        error: `Error del webhook: ${response.status} - ${response.statusText}`,
        details: errorText
      };
    }
  } catch (error) {
    console.error('Error al enviar al webhook:', error);
    return { 
      success: false, 
      error: `Error de conexión: ${error.message}` 
    };
  }
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
    const formData = await request.json();
    
    console.log('=== DATOS RECIBIDOS EN API ===');
    console.log('Formulario recibido:', formData);
    console.log('==============================');
    
    // Validar datos de entrada
    const validation = validateTripInquiry(formData);
    if (!validation.isValid) {
      return createResponse({
        success: false,
        error: 'Datos de formulario inválidos',
        details: validation.errors
      }, 400);
    }
    
    // Enviar al webhook de Travel with Gaston
    const webhookResult = await sendToWebhook(formData);
    
    if (webhookResult.success) {
      return createResponse({
        success: true,
        message: 'Formulario enviado correctamente',
        data: webhookResult.data
      });
    } else {
      return createResponse({
        success: false,
        error: 'Error al procesar el formulario',
        details: webhookResult.error
      }, 500);
    }

  } catch (error) {
    return handleError(error, 'trip-inquiry API');
  }
}

// Manejar preflight requests para CORS
export async function OPTIONS({ request }) {
  return createResponse({}, 200);
}
