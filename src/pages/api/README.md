# API Endpoints

## Trip Inquiry API

### Endpoint: `/api/trip-inquiry`

**Método:** POST  
**Content-Type:** application/json

### Descripción
Endpoint para procesar el formulario de consulta de viajes. Valida los datos del formulario y los envía al webhook de Travel with Gaston.

### Flujo de Procesamiento

1. **Validación de Datos**
   - Campos requeridos: `name`, `surname`, `email`, `city`, `country`, `destination`
   - Validación de formato de email
   - Validación de fechas (si están presentes)

2. **Envío al Webhook**
   - URL: `https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b`
   - Método: POST
   - Content-Type: application/json

3. **Respuesta**
   - Éxito: 200 con datos de confirmación
   - Error de validación: 400 con detalles de errores
   - Error del webhook: 500 con mensaje de error

### CORS
El endpoint incluye headers CORS apropiados para permitir requests desde el frontend.

### Ejemplo de Request

```json
{
  "destination": "japan",
  "secondaryDestination": "thailand",
  "tripType": "safari",
  "travelDates": "flexible",
  "startDate": "2024-03-15",
  "returnDate": "2024-03-22",
  "weddingDay": "2024",
  "currency": "usd",
  "budgetAmount": "5000-10000",
  "nights": "8-14",
  "registry": "yes",
  "tripDetails": "Looking for a romantic honeymoon...",
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "Madrid",
  "zip": "28001",
  "country": "Spain",
  "additionalInfo": "Special dietary requirements...",
  "newsletter": true,
  "privacy": true,
  "tripTypes": ["safari", "wellness", "gastronomy"]
}
```

### Ejemplo de Response (Éxito)

```json
{
  "success": true,
  "message": "Formulario enviado correctamente",
  "data": {
    "id": "12345",
    "status": "received"
  }
}
```

### Ejemplo de Response (Error)

```json
{
  "success": false,
  "error": "Datos de formulario inválidos",
  "details": ["name es requerido", "email inválido"]
}
```
