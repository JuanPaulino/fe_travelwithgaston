// Endpoint para el formulario de viajes personalizados
// src/pages/api/custom-journeys.js

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

// Validación de datos de entrada para Custom Journeys
const validateCustomJourneys = (formData) => {
  const errors = [];
  
  // Campos requeridos
  const requiredFields = ['name', 'email', 'destination'];
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  // Validar email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Invalid email format');
  }
  
  // Validar fechas si están presentes
  if (formData.startDate && formData.returnDate) {
    const startDate = new Date(formData.startDate);
    const returnDate = new Date(formData.returnDate);
    
    if (returnDate <= startDate) {
      errors.push('Return date must be after start date');
    }
  }
  
  // Validar que al menos un tipo de viaje esté seleccionado si se proporciona
  if (formData.tripTypes && formData.tripTypes.length === 0) {
    // No es error, es opcional
  }
  
  // Validar que al menos una experiencia de vacaciones esté seleccionada si se proporciona
  if (formData.holidayExperiences && formData.holidayExperiences.length === 0) {
    // No es error, es opcional
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Función para enviar al webhook de Travel with Gaston
const sendToWebhook = async (formData) => {
  // Usar el mismo webhook que trip-inquiry o crear uno específico para custom journeys
  const webhookUrl = 'https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b';
  
  try {
    // Preparar datos para el webhook
    const webhookData = {
      formType: 'custom-journeys',
      timestamp: new Date().toISOString(),
      ...formData
    };
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log('Custom Journeys Webhook Response - Status:', response.status);
    console.log('Custom Journeys Webhook Response - Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      console.log('Custom Journeys Webhook Response - Content-Type:', contentType);
      console.log('Custom Journeys Webhook Response - Body:', responseText);
      
      let result = null;
      
      // Intentar parsear como JSON solo si hay contenido y es JSON
      if (responseText && responseText.trim() !== '') {
        if (contentType && contentType.includes('application/json')) {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            console.warn('Could not parse response as JSON:', parseError.message);
            result = { message: responseText, raw: true };
          }
        } else {
          result = { message: responseText, raw: true };
        }
      } else {
        // Respuesta vacía pero exitosa
        result = { message: 'Custom journey form processed successfully', empty: true };
      }
      
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.error('Custom Journeys Webhook Error:', response.status, response.statusText, errorText);
      return { 
        success: false, 
        error: `Webhook error: ${response.status} - ${response.statusText}`,
        details: errorText
      };
    }
  } catch (error) {
    console.error('Error sending to custom journeys webhook:', error);
    return { 
      success: false, 
      error: `Connection error: ${error.message}` 
    };
  }
};

// Manejo de errores centralizado
const handleError = (error, context = 'API endpoint') => {
  console.error(`Error in ${context}:`, error);
  return createResponse({
    success: false,
    error: error.message || 'Internal server error'
  }, 500);
};

export async function POST({ request }) {
  try {
    const formData = await request.json();
    
    console.log('=== CUSTOM JOURNEYS FORM DATA RECEIVED ===');
    console.log('Form received:', formData);
    console.log('==========================================');
    
    // Validar datos de entrada
    const validation = validateCustomJourneys(formData);
    if (!validation.isValid) {
      return createResponse({
        success: false,
        error: 'Invalid form data',
        details: validation.errors
      }, 400);
    }
    
    // Enviar al webhook de Travel with Gaston
    const webhookResult = await sendToWebhook(formData);
    
    if (webhookResult.success) {
      return createResponse({
        success: true,
        message: 'Custom journey form submitted successfully',
        data: webhookResult.data
      });
    } else {
      return createResponse({
        success: false,
        error: 'Error processing the form',
        details: webhookResult.error
      }, 500);
    }

  } catch (error) {
    return handleError(error, 'custom-journeys API');
  }
}

// Manejar preflight requests para CORS
export async function OPTIONS({ request }) {
  return createResponse({}, 200);
}
