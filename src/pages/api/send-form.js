// API Unificada Simple para todos los formularios
// src/pages/api/send-form.js

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

// Función simple para enviar al webhook
const sendToWebhook = async (formData) => {
  const webhookUrl = 'https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Webhook error:', error);
    throw new Error('Failed to submit form data');
  }
};

export async function POST({ request }) {
  try {
    const formData = await request.json();
    
    console.log('=== DATOS RECIBIDOS EN SEND-FORM ===');
    console.log('Form ID:', formData.form_id || 'No especificado');
    console.log('Formulario recibido:', formData);
    console.log('=====================================');
    
    // Enviar al webhook sin validaciones
    await sendToWebhook(formData);

    return createResponse({
      success: true,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error en send-form:', error);
    return createResponse({
      success: false,
      error: 'Error sending the form. Please try again later.'
    }, 500);
  }
}

export async function OPTIONS({ request }) {
  return createResponse({}, 200);
}
