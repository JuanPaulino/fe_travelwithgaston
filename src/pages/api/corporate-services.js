// Endpoint para el formulario de servicios corporativos
// src/pages/api/corporate-services.js

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

// Validación de datos de entrada para Corporate Services
const validateCorporateServices = (formData) => {
  const errors = [];
  
  // Campos requeridos
  const requiredFields = ['companyName', 'contactPerson', 'email', 'phone'];
  
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
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }
  
  // Validar que al menos un servicio esté seleccionado si se proporciona
  if (formData.services && formData.services.length === 0) {
    // No es error, es opcional
  }
  
  // Validar campos condicionales basados en servicios seleccionados
  if (formData.services && formData.services.includes('flight-bookings')) {
    if (!formData.flightClass) {
      // No es error obligatorio, pero podría ser recomendado
    }
  }
  
  if (formData.services && formData.services.includes('hotel-reservations')) {
    if (!formData.hotelCategory) {
      // No es error obligatorio, pero podría ser recomendado
    }
  }
  
  if (formData.services && formData.services.includes('meetings-events')) {
    if (!formData.meetingSpaceType || !formData.numberOfParticipants) {
      // No es error obligatorio, pero podría ser recomendado
    }
  }
  
  if (formData.services && formData.services.includes('ground-transportation')) {
    if (!formData.groundTransportation) {
      // No es error obligatorio, pero podría ser recomendado
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Función para enviar al webhook de Travel with Gaston
const sendToWebhook = async (formData) => {
  // Usar el mismo webhook que trip-inquiry o crear uno específico para corporate services
  const webhookUrl = 'https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b';
  
  try {
    // Preparar datos para el webhook
    const webhookData = {
      formType: 'corporate-services',
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
    
    console.log('Corporate Services Webhook Response - Status:', response.status);
    console.log('Corporate Services Webhook Response - Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      // Verificar si la respuesta tiene contenido
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      console.log('Corporate Services Webhook Response - Content-Type:', contentType);
      console.log('Corporate Services Webhook Response - Body:', responseText);
      
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
        result = { message: 'Corporate services form processed successfully', empty: true };
      }
      
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.error('Corporate Services Webhook Error:', response.status, response.statusText, errorText);
      return { 
        success: false, 
        error: `Webhook error: ${response.status} - ${response.statusText}`,
        details: errorText
      };
    }
  } catch (error) {
    console.error('Error sending to corporate services webhook:', error);
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
    
    console.log('=== CORPORATE SERVICES FORM DATA RECEIVED ===');
    console.log('Form received:', formData);
    console.log('=============================================');
    
    // Validar datos de entrada
    const validation = validateCorporateServices(formData);
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
        message: 'Corporate services form submitted successfully',
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
    return handleError(error, 'corporate-services API');
  }
}

// Manejar preflight requests para CORS
export async function OPTIONS({ request }) {
  return createResponse({}, 200);
}
