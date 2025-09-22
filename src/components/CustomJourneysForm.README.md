# CustomJourneysForm.astro

## Descripción
Formulario de consulta de viajes personalizados para Travel with Gaston. Este formulario permite a los usuarios solicitar viajes personalizados con opciones de lujo y experiencias específicas.

## Características

### Campos del Formulario

#### About the Trip
1. **Destination** - Región del mundo (África, Asia, Europa, etc.)
2. **Specific Country** - País específico (opcional)
3. **Secondary Destination** - Destino secundario (opcional)
4. **Secondary Specific Country** - País específico secundario (opcional)
5. **Trip Type** - Tipo de viaje (múltiple selección)
   - Honeymoon, Anniversary, Family Trip, etc.
6. **Holiday Experience** - Experiencia de vacaciones (múltiple selección)
   - Safari & Wildlife, Adventure & Active Sports, etc.
7. **Travel Dates** - Fechas de viaje
   - Exact dates, Approximate dates, Flexible
8. **Start Date / Return Date** - Fechas específicas (condicional)
9. **Nights** - Número de noches (3-5, 6-8, etc.)
10. **Budget** - Presupuesto por persona
    - Currency (USD, EUR, GBP, etc.)
    - Budget range (<5,000, 5,000-10,000, etc.)
    - Additional details (opcional)
11. **Special Occasion** - Ocasión especial
12. **Luxury Services** - Servicios de lujo adicionales (múltiple selección)
    - Private Jet & Helicopter Charter, Yacht Charter, etc.
    - Campo "Other" con input de texto (condicional)
13. **Trip Details** - Detalles adicionales del viaje

#### Personal Information
14. **Name & Surname** - Nombre completo (requerido)
15. **Email** - Correo electrónico (requerido)
16. **Phone** - Teléfono con código de país
17. **Address** - Dirección
18. **City** - Ciudad
19. **Postal Code** - Código postal
20. **Country of Residence** - País de residencia
21. **Traveling With** - Con quién viaja
    - Campo "Kids age" (condicional si selecciona "Family with kids")
22. **How did you hear** - Cómo se enteró de Travel with Gaston
23. **Newsletter** - Suscripción a newsletter (opcional)
24. **Privacy Policy** - Aceptación de política de privacidad (requerido)

## Funcionalidades

### Validación
- Campos requeridos: Name, Email, Destination, Privacy Policy
- Validación de email
- Validación de fechas (fecha de regreso debe ser posterior a fecha de salida)
- Validación en tiempo real

### Campos Condicionales
- **Kids Age**: Se muestra solo si se selecciona "Family with kids"
- **Luxury Services Other**: Se muestra solo si se selecciona "Other" en servicios de lujo
- **Start/Return Date**: Se muestran solo si se selecciona "Yes, exact dates"

### Selección Múltiple
- **Trip Types**: Botones que permiten selección múltiple
- **Holiday Experiences**: Botones que permiten selección múltiple
- **Luxury Services**: Checkboxes que permiten selección múltiple

### Envío de Datos
- Endpoint: `/api/custom-journeys`
- Método: POST
- Formato: JSON
- Manejo de errores y mensajes de estado

## Dependencias

### Archivos de Datos
- `src/data/customJourneysData.js` - Contiene todas las opciones de los dropdowns y selecciones

### Componentes
- `src/components/form/FormField.astro` - Componente base para campos de formulario

## Estilos
- Utiliza Tailwind CSS
- Diseño responsive
- Estados de hover y focus
- Indicadores de error
- Botones de selección múltiple con estados visuales

## Uso

```astro
---
import CustomJourneysForm from './CustomJourneysForm.astro';
---

<CustomJourneysForm />
```

## Estructura de Datos Enviados

```javascript
{
  // Información del viaje
  destination: "europe",
  specificCountry: "france",
  secondaryDestination: "asia",
  secondarySpecificCountry: "japan",
  tripTypes: ["honeymoon", "couples-escape"],
  holidayExperiences: ["art-culture", "gastronomy-wine"],
  travelDates: "exact-dates",
  startDate: "2024-06-15",
  returnDate: "2024-06-25",
  nights: "9-12",
  currency: "eur",
  budgetAmount: "15000-25000",
  budgetDetails: "Including flights and accommodation",
  specialOccasion: "anniversary",
  luxuryServices: ["private-jet-helicopter", "yacht-charter"],
  luxuryServicesOther: "Custom luxury service",
  tripDetails: "We want a romantic getaway...",
  
  // Información personal
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: "123 Main St",
  city: "New York",
  postalCode: "10001",
  countryOfResidence: "united-states",
  travelingWith: "couple",
  kidsAge: "",
  howDidYouHear: "instagram",
  newsletter: true,
  privacy: true
}
```

## Notas de Implementación

1. **API Endpoint**: El formulario envía datos a `/api/custom-journeys` - este endpoint debe ser implementado en el backend.

2. **Validación**: La validación se realiza tanto en el frontend (JavaScript) como debe implementarse en el backend.

3. **Campos Condicionales**: Los campos condicionales se muestran/ocultan dinámicamente usando JavaScript.

4. **Selección Múltiple**: Los botones de selección múltiple mantienen su estado visual y se incluyen en los datos enviados como arrays.

5. **Responsive**: El formulario está diseñado para ser completamente responsive usando Tailwind CSS.
