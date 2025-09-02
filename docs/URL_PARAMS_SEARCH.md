# Parámetros de URL para Autocompletar Búsqueda

El componente `SearchForm` ahora puede autocompletarse automáticamente cuando se carga la página con parámetros específicos en la URL.

## Parámetros Soportados

### Destino
- `destination`: Texto del destino (ej: "Cancún, México")
- `destinationId`: ID único del destino
- `destinationType`: Tipo de destino ("hotel" o "location")
- `destinationLocation`: Ubicación del destino

### Fechas
- `checkIn`: Fecha de check-in (formato: YYYY-MM-DD)
- `checkOut`: Fecha de check-out (formato: YYYY-MM-DD)

### Huéspedes
- `adults`: Número de adultos (por defecto: 2)
- `children`: Número de niños (por defecto: 0)
- `rooms`: Número de habitaciones (por defecto: 1)
- `childrenAges`: Edades de los niños separadas por comas (ej: "8,10,12")

## Ejemplos de Uso

### Búsqueda básica con destino
```
/search?destination=Cancún&destinationId=123&destinationType=location
```

### Búsqueda completa con fechas y huéspedes
```
/search?destination=Hotel%20Ritz&destinationId=456&destinationType=hotel&checkIn=2024-12-25&checkOut=2024-12-30&adults=2&children=2&rooms=1&childrenAges=8,10
```

### Búsqueda con solo destino y fechas
```
/search?destination=Playa%20del%20Carmen&destinationId=789&checkIn=2024-12-20&checkOut=2024-12-27
```

## Funcionalidades

1. **Autocompletado Automático**: Al cargar la página, el formulario se llena automáticamente con los parámetros de la URL
2. **Sincronización de URL**: Cuando se ejecuta una búsqueda, la URL se actualiza con los parámetros actuales
3. **Persistencia**: Los parámetros se mantienen en la URL para compartir o guardar búsquedas
4. **Compatibilidad Móvil**: Funciona tanto en desktop como en dispositivos móviles

## Implementación Técnica

- **Hook `useUrlParams`**: Maneja la lectura y escritura de parámetros de URL
- **Store Integration**: Se integra con el store de búsqueda existente
- **Astro Integration**: Los parámetros se leen en el servidor y se pasan como `initialData`
- **React Hooks**: Utiliza `useEffect` para sincronizar datos al montar el componente

## Casos de Uso

1. **Enlaces de Marketing**: Crear enlaces directos a búsquedas específicas
2. **Compartir Búsquedas**: Permitir a usuarios compartir sus búsquedas
3. **Bookmarks**: Guardar búsquedas favoritas en el navegador
4. **Integración Externa**: Permitir que otros sitios redirijan a búsquedas específicas
