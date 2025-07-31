# Sistema de Tipografía - TravelWithGaston

## Configuración

El sistema de tipografía está configurado en `tailwind.config.mjs` con las siguientes características:

### Familias de Fuente
- **Heading**: `Roboto Serif` (serif)
- **Body**: `Inter` (sans-serif)

### Escala de Encabezados

| Token | Mobile | Desktop | Line-height |
|-------|--------|---------|-------------|
| h1 | 40px (2.5rem) | 56px (3.5rem) | 120% |
| h2 | 36px (2.25rem) | 48px (3rem) | 120% |
| h3 | 32px (2rem) | 40px (2.5rem) | 120% |
| h4 | 24px (1.5rem) | 32px (2rem) | 140% |
| h5 | 20px (1.25rem) | 24px (1.5rem) | 140% |
| h6 | 18px (1.125rem) | 20px (1.25rem) | 140% |
| tagline | 16px (1rem) | 16px (1rem) | 150% |

### Escala de Texto de Cuerpo

| Tamaño | Píxeles | Rem | Clase Tailwind |
|--------|---------|-----|----------------|
| Large | 20px | 1.25rem | `text-lg` |
| Medium/Regular | 18px/16px | 1.125rem/1rem | `text-base` |
| Small | 14px | 0.875rem | `text-sm` |
| Tiny | 12px | 0.75rem | `text-xs` |

## Componentes

### Heading

```jsx
import Heading from './components/common/Heading.jsx';

// Uso básico
<Heading level={1}>Título Principal</Heading>
<Heading level={2}>Subtítulo</Heading>

// Con clases adicionales
<Heading level={3} className="text-blue-600 font-bold">
  Título con estilos
</Heading>

// Con elemento personalizado
<Heading level={1} as="div" className="text-center">
  Título como div
</Heading>
```

### Text

```jsx
import Text from './components/common/Text.jsx';

// Uso básico
<Text>Párrafo normal</Text>

// Con diferentes tamaños
<Text size="lg">Texto grande</Text>
<Text size="sm">Texto pequeño</Text>
<Text size="tagline">Tagline</Text>

// Con diferentes pesos
<Text weight="bold">Texto en negrita</Text>
<Text weight="semibold">Texto semi-negrita</Text>
<Text weight="light">Texto ligero</Text>

// Combinando propiedades
<Text size="lg" weight="semibold" className="text-gray-700">
  Texto personalizado
</Text>
```

## Clases CSS Directas

### Encabezados

```html
<!-- Mobile por defecto, desktop en sm+ -->
<h1 class="font-heading text-h1 sm:text-h1-desktop">Título</h1>
<h2 class="font-heading text-h2 sm:text-h2-desktop">Subtítulo</h2>
<h3 class="font-heading text-h3 sm:text-h3-desktop">Sección</h3>
```

### Texto de Cuerpo

```html
<p class="font-body text-base leading-relaxed">Párrafo normal</p>
<p class="font-body text-lg leading-relaxed">Párrafo grande</p>
<p class="font-body text-sm leading-relaxed">Párrafo pequeño</p>
```

### Pesos de Fuente

```html
<p class="font-body font-extrabold">Extra Bold</p>
<p class="font-body font-bold">Bold</p>
<p class="font-body font-semibold">Semi Bold</p>
<p class="font-body font-medium">Medium</p>
<p class="font-body font-normal">Normal</p>
<p class="font-body font-light">Light</p>
```

## Responsive Design

El sistema está configurado para ser mobile-first:

- **Mobile (< 640px)**: Tamaños más pequeños
- **Desktop (≥ 640px)**: Tamaños más grandes

Los componentes `Heading` y `Text` manejan automáticamente las variantes responsive.

## Demo

Visita `/typography` para ver una demostración completa del sistema de tipografía.

## Instalación de Fuentes

Para que las fuentes funcionen correctamente, asegúrate de incluir:

```html
<!-- En el head de tu HTML -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto+Serif:opsz,wght@8..144,300;8..144,400;8..144,500;8..144,600;8..144,700&display=swap" rel="stylesheet">
```

O incluir en tu CSS global:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto+Serif:opsz,wght@8..144,300;8..144,400;8..144,500;8..144,600;8..144,700&display=swap');
``` 