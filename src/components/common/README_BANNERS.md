# Sistema de Banners Global

Este sistema proporciona una forma elegante y desacoplada de mostrar mensajes de notificación en toda la aplicación.

## Arquitectura

```
Layout.astro (Global)
    ↓
BannerManagerIsland (Isla React)
    ↓
BannerManager (Componente React)
    ↓
BannerContainer + Banner (UI Components)****
    ↓
nanostore (Estado Global)
```

## Componentes

### 1. Banner.jsx
Componente base que renderiza un banner individual con:
- 4 tipos: success, error, warning, info
- Iconos SVG apropiados
- Botón de cierre opcional
- Estilos con Tailwind CSS

### 2. BannerContainer.jsx
Contenedor que posiciona múltiples banners con opciones de:
- top-left, top-center, top-right
- bottom-left, bottom-center, bottom-right
- Z-index alto para estar por encima del contenido

### 3. BannerManager.jsx
Componente React que se conecta al nanostore global y renderiza el BannerContainer.

### 4. BannerManagerIsland.jsx
Isla de React para usar en Astro con `client:load`.

## Store Global

### bannerStore.js
```javascript
import { showSuccess, showError, showWarning, showInfo } from '../../stores/bannerStore';

// Uso básico
showSuccess('¡Operación exitosa!');

// Con opciones
showError('Error ocurrido', { 
  autoHide: true, 
  duration: 3000 
});
```

## Funciones Disponibles

### showSuccess(message, options)
- `message`: Texto del mensaje
- `options.autoHide`: Boolean (default: false)
- `options.duration`: Number en ms (default: 5000)

### showError(message, options)
### showWarning(message, options)
### showInfo(message, options)

## Uso en Componentes

```javascript
import React from 'react';
import { showSuccess, showError } from '../../stores/bannerStore';

const MiComponente = () => {
  const handleSuccess = () => {
    showSuccess('¡Datos guardados!', { autoHide: true });
  };

  const handleError = () => {
    showError('Error al guardar', { autoHide: true });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Guardar</button>
      <button onClick={handleError}>Simular Error</button>
    </div>
  );
};
```

## Ventajas

1. **Global**: No necesitas importar BannerContainer en cada componente
2. **Desacoplado**: Los componentes solo llaman a las funciones del store
3. **Consistente**: Mismo estilo y comportamiento en toda la app
4. **Eficiente**: Un solo lugar para renderizar todos los banners
5. **Flexible**: Posicionamiento y opciones configurables
6. **Auto-hide**: Los mensajes pueden desaparecer automáticamente

## Posicionamiento

Los banners se muestran en la esquina superior derecha por defecto.
Para cambiar la posición, modifica el `BannerManager.jsx`:

```javascript
<BannerContainer 
  banners={banners}
  onRemoveBanner={removeBanner}
  position="top-center" // Cambiar aquí
/>
```

## Personalización

Para personalizar estilos, modifica:
- `Banner.jsx` - Estilos individuales de cada banner
- `BannerContainer.jsx` - Posicionamiento y layout
- `bannerStore.js` - Lógica de negocio y opciones por defecto
