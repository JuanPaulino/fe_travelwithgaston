# TripInquiryForm.astro

Formulario de consulta de viajes personalizado para Travel with Gaston, basado en el diseño proporcionado.

## Características

- **Accesibilidad completa**: Labels asociados, aria-invalid, aria-describedby, mensajes de error, focus visible, contraste AA
- **Diseño responsive**: 1 columna en móvil, 2 columnas en escritorio
- **Validación JavaScript**: Validación en tiempo real con HTML5 constraints
- **Sin envío**: Botón de tipo button que muestra mensaje "Submission is not enabled yet."
- **Diseño visual**: Fondo amarillo con borde azul punteado, siguiendo el diseño proporcionado

## Campos del Formulario

### About the Trip
- **Destino principal** (requerido): Select con opciones de destinos asiáticos
- **Destino secundario**: Select opcional para segundo destino
- **Tipo de viaje**: Botones seleccionables (Safari, Active Sports, Wellness, Art and Culture, Gastronomy, Nature, Beach)
- **Fechas de viaje**: Select para flexibilidad de fechas + campos de fecha específica
- **Día de boda**: Select con opciones de año
- **Presupuesto**: Select de moneda + select de rango de presupuesto
- **Noches**: Select con opciones de duración
- **Registro de boda**: Select con opciones Yes/No/Maybe
- **Detalles del viaje**: Textarea para información adicional

### Personal Information
- **Nombre** (requerido): Campo de texto
- **Apellido** (requerido): Campo de texto
- **Email** (requerido): Campo de email con validación
- **Teléfono**: Campo de teléfono
- **Dirección**: Campo de texto
- **Ciudad** (requerido): Campo de texto
- **Código postal**: Campo de texto
- **País** (requerido): Campo de texto
- **Información adicional**: Textarea para comentarios
- **Newsletter**: Checkbox para suscripción
- **Política de privacidad** (requerido): Checkbox obligatorio

## Validaciones

- **Campos requeridos**: Validación de campos obligatorios (nombre, apellido, email, ciudad, país, destino principal)
- **Email**: Validación de formato de email
- **Fechas**: Validación de coherencia entre fechas de salida y regreso
- **Política de privacidad**: Checkbox obligatorio para continuar
- **Tipo de viaje**: Botones seleccionables múltiples (opcional)

## Uso

```astro
---
import TripInquiryForm from '../components/TripInquiryForm.astro';
---

<TripInquiryForm />
```

## Dependencias

- `src/data/destinations.js`: Datos de destinos, presupuestos, grupos, etc.
- Tailwind CSS para estilos
- JavaScript vanilla para validación

## Estructura de Archivos

```
src/
├── components/
│   └── TripInquiryForm.astro
├── data/
│   └── destinations.js
└── pages/
    └── trip-inquiry.astro (ejemplo de uso)
```

## Accesibilidad

- Todos los campos tienen labels asociados
- Mensajes de error con aria-describedby
- Estados de error con aria-invalid
- Focus visible en todos los elementos interactivos
- Contraste AA en todos los textos
- Navegación por teclado completa
- Screen reader friendly

## Responsive Design

- **Móvil**: 1 columna, campos apilados verticalmente
- **Escritorio**: 2 columnas en secciones apropiadas
- Grid adaptativo con Tailwind CSS

## Validación en Tiempo Real

- Validación al perder el foco (blur)
- Limpieza automática de errores al corregir
- Cálculo automático de duración al cambiar fechas
- Validación de coherencia entre campos relacionados
