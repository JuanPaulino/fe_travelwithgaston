# Sistema de Formularios Modular

Este directorio contiene un sistema de formularios completamente modular y reutilizable basado en los modelos de Directus.

## Estructura del Árbol de Componentes

```
form/
├── FormFieldWrapper.tsx      # Wrapper común para todos los campos
├── FormFieldRenderer.tsx     # Renderizador principal que decide qué componente usar
├── TextInput.tsx            # Campo de texto
├── EmailInput.tsx           # Campo de email
├── TextareaInput.tsx        # Campo de textarea
├── SelectInput.tsx          # Campo de select
├── RadioInput.tsx           # Campo de radio
├── CheckboxInput.tsx        # Campo de checkbox individual
├── CheckboxGroupInput.tsx   # Campo de checkbox group
├── FileInput.tsx            # Campo de archivo
├── HiddenInput.tsx          # Campo oculto
└── index.ts                 # Exportaciones centralizadas
```

## Características Principales

### ✅ **Modularidad**
- Cada tipo de campo es un componente independiente
- Fácil de mantener y extender
- Reutilizable en diferentes contextos

### ✅ **TypeScript**
- Tipos basados en los modelos de Directus
- Validación de tipos en tiempo de compilación
- Mejor experiencia de desarrollo

### ✅ **Validación**
- Validación centralizada en `formUtils.ts`
- Soporte para reglas de validación de Directus
- Mensajes de error personalizables

### ✅ **Estado**
- Hook personalizado `useForm` para manejo de estado
- Estado centralizado y predecible
- Manejo automático de errores

### ✅ **Accesibilidad**
- Labels apropiados
- Atributos ARIA
- Navegación por teclado

## Uso

```tsx
import FormBlock from '../components/FormBlock';
import { FormBlockData } from '../types/form';

const data: FormBlockData = {
  headline: "Contacto",
  tagline: "Envíanos un mensaje",
  form: {
    id: "contact-form",
    title: "Formulario de Contacto",
    submit_label: "Enviar",
    on_success: "message",
    success_message: "¡Gracias por tu mensaje!",
    fields: [
      {
        id: "name",
        name: "name",
        type: "text",
        label: "Nombre",
        required: true,
        width: "50",
        sort: 1
      },
      // ... más campos
    ]
  }
};

<FormBlock data={data} background="light" />
```

## Tipos de Campos Soportados

- **text**: Campo de texto simple
- **email**: Campo de email con validación
- **textarea**: Área de texto multilínea
- **select**: Lista desplegable
- **radio**: Botones de radio
- **checkbox**: Checkbox individual
- **checkbox_group**: Grupo de checkboxes
- **file**: Subida de archivos
- **hidden**: Campo oculto

## Validaciones Soportadas

- `email`: Validación de formato de email
- `url`: Validación de formato de URL
- `min:N`: Longitud mínima
- `max:N`: Longitud máxima
- `length:N`: Longitud exacta
- `required`: Campo obligatorio

## Beneficios de la Nueva Arquitectura

1. **Mantenibilidad**: Código más limpio y organizado
2. **Reutilización**: Componentes independientes y reutilizables
3. **Escalabilidad**: Fácil agregar nuevos tipos de campos
4. **Testing**: Componentes aislados fáciles de probar
5. **Performance**: Renderizado optimizado
6. **DX**: Mejor experiencia de desarrollo con TypeScript

